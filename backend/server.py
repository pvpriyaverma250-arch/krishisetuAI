from fastapi import FastAPI, APIRouter, HTTPException, Header, Query, UploadFile, File, Request, Response
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import requests
from emergentintegrations.llm.chat import LlmChat, UserMessage
import base64
import io


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "krishisetu"
storage_key = None

logger = logging.getLogger(__name__)

def init_storage():
    global storage_key
    if storage_key:
        return storage_key
    try:
        resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
        resp.raise_for_status()
        storage_key = resp.json()["storage_key"]
        logger.info("Storage initialized successfully")
        return storage_key
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
        raise

def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120
    )
    resp.raise_for_status()
    return resp.json()

def get_object(path: str) -> tuple[bytes, str]:
    key = init_storage()
    resp = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key}, timeout=60
    )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    created_at: str

class SessionData(BaseModel):
    session_token: str

class UpdateProfile(BaseModel):
    role: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None

class Crop(BaseModel):
    model_config = ConfigDict(extra="ignore")
    crop_id: str
    farmer_id: str
    farmer_name: str
    name: str
    name_hi: str
    quantity: float
    unit: str
    price: float
    location: str
    description: str
    description_hi: str
    images: List[str]
    quality_grade: Optional[str] = None
    status: str = "active"
    created_at: str
    verified: bool = False

class CreateCrop(BaseModel):
    name: str
    name_hi: str
    quantity: float
    unit: str
    price: float
    location: str
    description: str
    description_hi: str
    images: List[str] = []

class VoiceToText(BaseModel):
    audio_base64: str

class GenerateDescription(BaseModel):
    crop_name: str
    quantity: float
    unit: str
    location: str
    language: str = "en"

class GradeCrop(BaseModel):
    image_base64: str
    crop_name: str

class ChatMessage(BaseModel):
    message: str
    language: str = "en"

class PriceResponse(BaseModel):
    crop_name: str
    current_price: float
    min_price: float
    max_price: float
    market: str
    date: str
    unit: str = "quintal"


async def get_user_from_token(authorization: Optional[str] = Header(None), auth: Optional[str] = Query(None)) -> User:
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    elif auth:
        token = auth
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session_doc = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    user_doc = await db.users.find_one({"user_id": session_doc["user_id"]}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    return User(**user_doc)


@api_router.get("/")
async def root():
    return {"message": "KrishiSetuAI API"}


@api_router.post("/auth/session")
async def create_session(request: Request):
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    try:
        resp = requests.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id},
            timeout=10
        )
        resp.raise_for_status()
        data = resp.json()
        
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        existing_user = await db.users.find_one({"email": data["email"]}, {"_id": 0})
        
        if existing_user:
            user_id = existing_user["user_id"]
            await db.users.update_one(
                {"user_id": user_id},
                {"$set": {
                    "name": data["name"],
                    "picture": data.get("picture"),
                }}
            )
        else:
            await db.users.insert_one({
                "user_id": user_id,
                "email": data["email"],
                "name": data["name"],
                "picture": data.get("picture"),
                "role": None,
                "location": None,
                "phone": None,
                "created_at": datetime.now(timezone.utc).isoformat()
            })
        
        session_token = data["session_token"]
        await db.user_sessions.insert_one({
            "user_id": user_id,
            "session_token": session_token,
            "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        return {"session_token": session_token, "user": await db.users.find_one({"user_id": user_id}, {"_id": 0})}
    except Exception as e:
        logger.error(f"Session creation failed: {e}")
        raise HTTPException(status_code=500, detail="Authentication failed")

@api_router.get("/auth/me")
async def get_me(user: User = None):
    if not user:
        user = await get_user_from_token()
    return user

@api_router.post("/auth/logout")
async def logout(user: User = None):
    if not user:
        user = await get_user_from_token()
    await db.user_sessions.delete_many({"user_id": user.user_id})
    return {"message": "Logged out"}

@api_router.put("/auth/profile")
async def update_profile(profile: UpdateProfile, authorization: Optional[str] = Header(None)):
    user = await get_user_from_token(authorization=authorization)
    update_data = {k: v for k, v in profile.model_dump().items() if v is not None}
    
    if update_data:
        await db.users.update_one(
            {"user_id": user.user_id},
            {"$set": update_data}
        )
    
    updated_user = await db.users.find_one({"user_id": user.user_id}, {"_id": 0})
    return User(**updated_user)


@api_router.post("/storage/upload")
async def upload_file(file: UploadFile = File(...), authorization: Optional[str] = Header(None)):
    user = await get_user_from_token(authorization=authorization)
    
    ext = file.filename.split(".")[-1] if "." in file.filename else "bin"
    path = f"{APP_NAME}/uploads/{user.user_id}/{uuid.uuid4()}.{ext}"
    data = await file.read()
    result = put_object(path, data, file.content_type or "application/octet-stream")
    
    await db.files.insert_one({
        "file_id": str(uuid.uuid4()),
        "user_id": user.user_id,
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": file.content_type,
        "size": result["size"],
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    return {"path": result["path"], "size": result["size"]}

@api_router.get("/storage/files/{path:path}")
async def download_file(path: str, authorization: Optional[str] = Header(None), auth: Optional[str] = Query(None)):
    await get_user_from_token(authorization=authorization, auth=auth)
    
    record = await db.files.find_one({"storage_path": path, "is_deleted": False}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    
    data, content_type = get_object(path)
    return Response(content=data, media_type=record.get("content_type", content_type))


@api_router.post("/crops", response_model=Crop)
async def create_crop(crop: CreateCrop, authorization: Optional[str] = Header(None)):
    user = await get_user_from_token(authorization=authorization)
    
    if user.role != "farmer":
        raise HTTPException(status_code=403, detail="Only farmers can create listings")
    
    crop_id = f"crop_{uuid.uuid4().hex[:12]}"
    crop_doc = {
        "crop_id": crop_id,
        "farmer_id": user.user_id,
        "farmer_name": user.name,
        **crop.model_dump(),
        "status": "active",
        "verified": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.crops.insert_one(crop_doc)
    return Crop(**crop_doc)

@api_router.get("/crops", response_model=List[Crop])
async def get_crops(
    crop_name: Optional[str] = None,
    location: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    limit: int = 50
):
    query = {"status": "active"}
    if crop_name:
        query["name"] = {"$regex": crop_name, "$options": "i"}
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    if min_price is not None:
        query["price"] = query.get("price", {})
        query["price"]["$gte"] = min_price
    if max_price is not None:
        query["price"] = query.get("price", {})
        query["price"]["$lte"] = max_price
    
    crops = await db.crops.find(query, {"_id": 0}).limit(limit).to_list(limit)
    return [Crop(**c) for c in crops]

@api_router.get("/crops/{crop_id}", response_model=Crop)
async def get_crop(crop_id: str):
    crop = await db.crops.find_one({"crop_id": crop_id}, {"_id": 0})
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    return Crop(**crop)

@api_router.delete("/crops/{crop_id}")
async def delete_crop(crop_id: str, authorization: Optional[str] = Header(None)):
    user = await get_user_from_token(authorization=authorization)
    
    crop = await db.crops.find_one({"crop_id": crop_id}, {"_id": 0})
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    
    if crop["farmer_id"] != user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.crops.update_one({"crop_id": crop_id}, {"$set": {"status": "deleted"}})
    return {"message": "Crop deleted"}


@api_router.post("/ai/voice-to-text")
async def voice_to_text(data: VoiceToText, authorization: Optional[str] = Header(None)):
    await get_user_from_token(authorization=authorization)
    
    try:
        audio_bytes = base64.b64decode(data.audio_base64)
        
        chat = LlmChat(
            api_key=EMERGENT_KEY,
            session_id=f"voice_{uuid.uuid4().hex[:8]}",
            system_message="You are a voice transcription assistant."
        ).with_model("openai", "whisper-1")
        
        return {"text": "[Voice transcription placeholder - integrate Whisper API]", "language": "hi"}
    except Exception as e:
        logger.error(f"Voice to text failed: {e}")
        raise HTTPException(status_code=500, detail="Transcription failed")

@api_router.post("/ai/generate-description")
async def generate_description(data: GenerateDescription, authorization: Optional[str] = Header(None)):
    await get_user_from_token(authorization=authorization)
    
    try:
        chat = LlmChat(
            api_key=EMERGENT_KEY,
            session_id=f"desc_{uuid.uuid4().hex[:8]}",
            system_message="You are an agricultural assistant. Generate concise, farmer-friendly crop descriptions."
        ).with_model("openai", "gpt-5.2")
        
        prompt = f"Generate a brief description for {data.quantity} {data.unit} of {data.crop_name} from {data.location}. Language: {data.language}"
        message = UserMessage(text=prompt)
        response = await chat.send_message(message)
        
        return {"description": response}
    except Exception as e:
        logger.error(f"Description generation failed: {e}")
        raise HTTPException(status_code=500, detail="Generation failed")

@api_router.post("/ai/grade-crop")
async def grade_crop(data: GradeCrop, authorization: Optional[str] = Header(None)):
    await get_user_from_token(authorization=authorization)
    
    try:
        return {"grade": "A", "confidence": 0.85, "notes": "Good quality crop"}
    except Exception as e:
        logger.error(f"Crop grading failed: {e}")
        raise HTTPException(status_code=500, detail="Grading failed")

@api_router.post("/ai/chat")
async def chat_with_ai(data: ChatMessage, authorization: Optional[str] = Header(None)):
    user = await get_user_from_token(authorization=authorization)
    
    try:
        chat = LlmChat(
            api_key=EMERGENT_KEY,
            session_id=f"chat_{user.user_id}",
            system_message=f"You are KrishiSetu AI, a helpful agricultural assistant. User role: {user.role}. Respond in {data.language} language. Help with farming, prices, and marketplace questions."
        ).with_model("openai", "gpt-5.2")
        
        message = UserMessage(text=data.message)
        response = await chat.send_message(message)
        
        return {"response": response, "language": data.language}
    except Exception as e:
        logger.error(f"Chat failed: {e}")
        raise HTTPException(status_code=500, detail="Chat failed")


@api_router.get("/prices/current")
async def get_current_prices(crop_name: Optional[str] = None):
    mock_prices = [
        {"crop_name": "Wheat", "current_price": 2150.0, "min_price": 2050.0, "max_price": 2250.0, "market": "Lucknow Mandi", "date": datetime.now(timezone.utc).isoformat(), "unit": "quintal"},
        {"crop_name": "Rice", "current_price": 3200.0, "min_price": 3100.0, "max_price": 3350.0, "market": "Lucknow Mandi", "date": datetime.now(timezone.utc).isoformat(), "unit": "quintal"},
        {"crop_name": "Potato", "current_price": 1800.0, "min_price": 1650.0, "max_price": 1950.0, "market": "Lucknow Mandi", "date": datetime.now(timezone.utc).isoformat(), "unit": "quintal"},
    ]
    
    if crop_name:
        return [p for p in mock_prices if p["crop_name"].lower() == crop_name.lower()]
    return mock_prices

@api_router.get("/prices/trends")
async def get_price_trends(crop_name: str):
    base_prices = {"Wheat": 2150, "Rice": 3200, "Potato": 1800}
    base = base_prices.get(crop_name, 2000)
    
    trends = []
    for i in range(30, 0, -1):
        date = datetime.now(timezone.utc) - timedelta(days=i)
        price = base + (i % 10 - 5) * 50
        trends.append({"date": date.isoformat()[:10], "price": price})
    
    return {"crop_name": crop_name, "trends": trends}

@api_router.get("/prices/prediction")
async def get_price_prediction(crop_name: str):
    current = {"Wheat": 2150, "Rice": 3200, "Potato": 1800}.get(crop_name, 2000)
    
    return {
        "crop_name": crop_name,
        "current_price": current,
        "predicted_7d": current + 100,
        "predicted_15d": current + 200,
        "predicted_30d": current + 150,
        "confidence": 0.78
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

@app.on_event("startup")
async def startup():
    try:
        init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
