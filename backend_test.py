#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class KrishiSetuAPITester:
    def __init__(self, base_url="https://web-craft-studio-13.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    "test": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "error": response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "endpoint": endpoint,
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_current_prices(self):
        """Test current prices endpoint"""
        success, response = self.run_test("Current Prices", "GET", "prices/current", 200)
        if success:
            # Verify response structure
            if isinstance(response, list) and len(response) > 0:
                required_fields = ['crop_name', 'current_price', 'market', 'date']
                first_item = response[0]
                missing_fields = [field for field in required_fields if field not in first_item]
                if missing_fields:
                    print(f"⚠️  Warning: Missing fields in response: {missing_fields}")
                else:
                    print("✅ Response structure is correct")
                    # Check for specific crops
                    crop_names = [item['crop_name'] for item in response]
                    expected_crops = ['Wheat', 'Rice', 'Potato']
                    found_crops = [crop for crop in expected_crops if crop in crop_names]
                    print(f"   Found crops: {found_crops}")
        return success

    def test_current_prices_with_filter(self):
        """Test current prices with crop filter"""
        return self.run_test("Current Prices - Wheat", "GET", "prices/current?crop_name=Wheat", 200)

    def test_price_trends(self):
        """Test price trends endpoint"""
        return self.run_test("Price Trends", "GET", "prices/trends?crop_name=Wheat", 200)

    def test_price_prediction(self):
        """Test price prediction endpoint"""
        return self.run_test("Price Prediction", "GET", "prices/prediction?crop_name=Rice", 200)

    def test_crops_endpoint(self):
        """Test crops listing endpoint"""
        return self.run_test("Crops Listing", "GET", "crops", 200)

    def test_crops_with_filters(self):
        """Test crops with filters"""
        return self.run_test("Crops with Location Filter", "GET", "crops?location=Lucknow", 200)

    def test_auth_endpoints_without_token(self):
        """Test auth endpoints without token (should fail)"""
        success, _ = self.run_test("Auth Me (No Token)", "GET", "auth/me", 401)
        return success

    def test_protected_endpoints_without_token(self):
        """Test protected endpoints without token"""
        # Test create crop without auth
        crop_data = {
            "name": "Test Wheat",
            "name_hi": "टेस्ट गेहूं",
            "quantity": 100,
            "unit": "quintal",
            "price": 2000,
            "location": "Lucknow",
            "description": "Test crop",
            "description_hi": "टेस्ट फसल"
        }
        success, _ = self.run_test("Create Crop (No Auth)", "POST", "crops", 401, data=crop_data)
        return success

def main():
    print("🌾 KrishiSetuAI Backend API Testing")
    print("=" * 50)
    
    # Setup
    tester = KrishiSetuAPITester()
    
    # Run basic API tests
    print("\n📋 Testing Basic API Endpoints...")
    tester.test_root_endpoint()
    
    print("\n💰 Testing Price Intelligence APIs...")
    tester.test_current_prices()
    tester.test_current_prices_with_filter()
    tester.test_price_trends()
    tester.test_price_prediction()
    
    print("\n🌾 Testing Crop APIs...")
    tester.test_crops_endpoint()
    tester.test_crops_with_filters()
    
    print("\n🔒 Testing Auth Protection...")
    tester.test_auth_endpoints_without_token()
    tester.test_protected_endpoints_without_token()
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for test in tester.failed_tests:
            error_msg = test.get('error', f'Status {test.get("actual", "unknown")}')
            print(f"   - {test['test']}: {error_msg}")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())