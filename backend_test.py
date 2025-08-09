#!/usr/bin/env python3
"""
CourseSwipe Backend API Testing Suite
Tests all backend endpoints with real-time Google Sheets integration and MongoDB persistence
"""

import requests
import json
import time
import uuid
from typing import Dict, List, Any

# Configuration
BACKEND_URL = "https://19f69d4b-aec8-4eef-864f-2ac5ed388d19.preview.emergentagent.com/api"
TEST_SESSION_ID = f"test_session_{uuid.uuid4().hex[:8]}"

class CourseSwipeAPITester:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = "", data: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "data": data,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
        if data and not success:
            print(f"   Data: {data}")
    
    def test_api_root(self):
        """Test the root API endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "CourseSwipe API" in data["message"]:
                    self.log_test("API Root Endpoint", True, f"API is running: {data['message']}")
                    return True
                else:
                    self.log_test("API Root Endpoint", False, f"Unexpected response format", data)
            else:
                self.log_test("API Root Endpoint", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("API Root Endpoint", False, f"Connection error: {str(e)}")
        return False
    
    def test_get_courses(self):
        """Test GET /api/courses endpoint - Google Sheets integration"""
        try:
            response = self.session.get(f"{self.base_url}/courses")
            
            if response.status_code != 200:
                self.log_test("GET /courses", False, f"HTTP {response.status_code}: {response.text}")
                return False
            
            data = response.json()
            
            # Verify response structure
            if "courses" not in data:
                self.log_test("GET /courses", False, "Missing 'courses' key in response", data)
                return False
            
            courses = data["courses"]
            
            # Verify it's an array
            if not isinstance(courses, list):
                self.log_test("GET /courses", False, "Courses is not an array", type(courses))
                return False
            
            # Check if we have courses
            if len(courses) == 0:
                self.log_test("GET /courses", False, "No courses returned from Google Sheets")
                return False
            
            # Verify course structure
            required_fields = ["id", "course_name", "description", "link"]
            sample_course = courses[0]
            
            missing_fields = [field for field in required_fields if field not in sample_course]
            if missing_fields:
                self.log_test("GET /courses", False, f"Missing required fields: {missing_fields}", sample_course)
                return False
            
            # Check for expected course names from the Google Sheet
            course_names = [course.get("course_name", "") for course in courses]
            expected_courses = [
                "Fundamentals of Machine Learning",
                "Best Artificial Intelligence Courses"
            ]
            
            found_expected = any(expected in course_names for expected in expected_courses)
            
            # Log detailed results
            self.log_test("GET /courses", True, 
                         f"Successfully fetched {len(courses)} courses from Google Sheets. "
                         f"Expected courses found: {found_expected}")
            
            # Log sample course for verification
            print(f"   Sample course: {sample_course}")
            print(f"   Total courses: {len(courses)}")
            print(f"   Course names preview: {course_names[:3]}")
            
            return True
            
        except Exception as e:
            self.log_test("GET /courses", False, f"Exception: {str(e)}")
            return False
    
    def test_post_swipe_history_save(self):
        """Test POST /api/swipe-history with 'save' action"""
        try:
            payload = {
                "course_id": "1",
                "action": "save",
                "session_id": TEST_SESSION_ID
            }
            
            response = self.session.post(
                f"{self.base_url}/swipe-history",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code != 200:
                self.log_test("POST /swipe-history (save)", False, 
                             f"HTTP {response.status_code}: {response.text}")
                return False
            
            data = response.json()
            
            if data.get("status") == "success":
                self.log_test("POST /swipe-history (save)", True, 
                             f"Successfully recorded save action: {data.get('message')}")
                return True
            else:
                self.log_test("POST /swipe-history (save)", False, 
                             "Unexpected response format", data)
                return False
                
        except Exception as e:
            self.log_test("POST /swipe-history (save)", False, f"Exception: {str(e)}")
            return False
    
    def test_post_swipe_history_ignore(self):
        """Test POST /api/swipe-history with 'ignore' action"""
        try:
            payload = {
                "course_id": "2",
                "action": "ignore",
                "session_id": TEST_SESSION_ID
            }
            
            response = self.session.post(
                f"{self.base_url}/swipe-history",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code != 200:
                self.log_test("POST /swipe-history (ignore)", False, 
                             f"HTTP {response.status_code}: {response.text}")
                return False
            
            data = response.json()
            
            if data.get("status") == "success":
                self.log_test("POST /swipe-history (ignore)", True, 
                             f"Successfully recorded ignore action: {data.get('message')}")
                return True
            else:
                self.log_test("POST /swipe-history (ignore)", False, 
                             "Unexpected response format", data)
                return False
                
        except Exception as e:
            self.log_test("POST /swipe-history (ignore)", False, f"Exception: {str(e)}")
            return False
    
    def test_post_swipe_history_invalid_data(self):
        """Test POST /api/swipe-history with invalid data"""
        try:
            # Test with missing course_id
            payload = {
                "action": "save",
                "session_id": TEST_SESSION_ID
            }
            
            response = self.session.post(
                f"{self.base_url}/swipe-history",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code >= 400:
                self.log_test("POST /swipe-history (invalid data)", True, 
                             f"Properly rejected invalid data with HTTP {response.status_code}")
                return True
            else:
                self.log_test("POST /swipe-history (invalid data)", False, 
                             f"Should have rejected invalid data but got HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("POST /swipe-history (invalid data)", False, f"Exception: {str(e)}")
            return False
    
    def test_get_swipe_history(self):
        """Test GET /api/swipe-history/{session_id}"""
        try:
            # Wait a moment for data to be persisted
            time.sleep(1)
            
            response = self.session.get(f"{self.base_url}/swipe-history/{TEST_SESSION_ID}")
            
            if response.status_code != 200:
                self.log_test("GET /swipe-history", False, 
                             f"HTTP {response.status_code}: {response.text}")
                return False
            
            data = response.json()
            
            # Verify response structure
            required_keys = ["saved_courses", "ignored_courses"]
            missing_keys = [key for key in required_keys if key not in data]
            
            if missing_keys:
                self.log_test("GET /swipe-history", False, 
                             f"Missing required keys: {missing_keys}", data)
                return False
            
            # Verify data types
            if not isinstance(data["saved_courses"], list) or not isinstance(data["ignored_courses"], list):
                self.log_test("GET /swipe-history", False, 
                             "saved_courses and ignored_courses should be arrays", data)
                return False
            
            # Verify our test data is present
            saved_courses = data["saved_courses"]
            ignored_courses = data["ignored_courses"]
            
            has_saved = "1" in saved_courses
            has_ignored = "2" in ignored_courses
            
            if has_saved and has_ignored:
                self.log_test("GET /swipe-history", True, 
                             f"Successfully retrieved history: {len(saved_courses)} saved, {len(ignored_courses)} ignored")
                print(f"   Saved courses: {saved_courses}")
                print(f"   Ignored courses: {ignored_courses}")
                return True
            else:
                self.log_test("GET /swipe-history", False, 
                             f"Missing expected test data. Saved: {saved_courses}, Ignored: {ignored_courses}")
                return False
                
        except Exception as e:
            self.log_test("GET /swipe-history", False, f"Exception: {str(e)}")
            return False
    
    def test_get_swipe_history_anonymous(self):
        """Test GET /api/swipe-history with anonymous session"""
        try:
            response = self.session.get(f"{self.base_url}/swipe-history/anonymous")
            
            if response.status_code != 200:
                self.log_test("GET /swipe-history (anonymous)", False, 
                             f"HTTP {response.status_code}: {response.text}")
                return False
            
            data = response.json()
            
            # Should return valid structure even if empty
            if "saved_courses" in data and "ignored_courses" in data:
                self.log_test("GET /swipe-history (anonymous)", True, 
                             f"Successfully retrieved anonymous history: {len(data['saved_courses'])} saved, {len(data['ignored_courses'])} ignored")
                return True
            else:
                self.log_test("GET /swipe-history (anonymous)", False, 
                             "Invalid response structure", data)
                return False
                
        except Exception as e:
            self.log_test("GET /swipe-history (anonymous)", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print(f"\n🚀 Starting CourseSwipe Backend API Tests")
        print(f"Backend URL: {self.base_url}")
        print(f"Test Session ID: {TEST_SESSION_ID}")
        print("=" * 60)
        
        # Test sequence
        tests = [
            self.test_api_root,
            self.test_get_courses,
            self.test_post_swipe_history_save,
            self.test_post_swipe_history_ignore,
            self.test_post_swipe_history_invalid_data,
            self.test_get_swipe_history,
            self.test_get_swipe_history_anonymous
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
            print()  # Add spacing between tests
        
        print("=" * 60)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! Backend API is working correctly.")
        else:
            print("⚠️  Some tests failed. Check the details above.")
        
        return passed == total

def main():
    """Main test execution"""
    tester = CourseSwipeAPITester(BACKEND_URL)
    success = tester.run_all_tests()
    
    # Return appropriate exit code
    exit(0 if success else 1)

if __name__ == "__main__":
    main()