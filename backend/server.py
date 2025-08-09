from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import requests
import csv
import io
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Google Sheets Configuration
GOOGLE_SHEET_ID = "1WzPZQzqtdPMTPYj5Z7YDV1NA038-bZcoM6YiLra9Wa8"
GOOGLE_SHEET_CSV_URL = f"https://docs.google.com/spreadsheets/d/{GOOGLE_SHEET_ID}/export?format=csv&gid=0"

# Models
class Course(BaseModel):
    id: str
    course_name: str
    description: str
    link: str
    datetime: Optional[str] = None
    last_updated: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SwipeAction(BaseModel):
    course_id: str
    action: str  # "save" or "ignore"
    session_id: Optional[str] = "anonymous"

class SwipeHistory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    course_id: str
    action: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class HistoryResponse(BaseModel):
    saved_courses: List[str]
    ignored_courses: List[str]

# Services
class GoogleSheetsService:
    @staticmethod
    async def fetch_courses():
        try:
            response = requests.get(GOOGLE_SHEET_CSV_URL, timeout=10)
            response.raise_for_status()
            
            # Parse CSV
            csv_content = response.text
            reader = csv.DictReader(io.StringIO(csv_content))
            
            courses = []
            for i, row in enumerate(reader):
                # Handle different possible column names
                course_name = row.get('course_name') or row.get('Course Name') or row.get('name', '')
                description = row.get('description') or row.get('Description', '')
                link = row.get('link') or row.get('Link') or row.get('url', '')
                datetime_field = row.get('datetime') or row.get('date') or row.get('Date', '')
                
                if course_name and description and link:
                    courses.append(Course(
                        id=str(i + 1),
                        course_name=course_name.strip(),
                        description=description.strip(),
                        link=link.strip(),
                        datetime=datetime_field.strip() if datetime_field else None
                    ))
            
            logger.info(f"Successfully fetched {len(courses)} courses from Google Sheets")
            return courses
            
        except requests.RequestException as e:
            logger.error(f"Failed to fetch from Google Sheets: {e}")
            raise HTTPException(status_code=503, detail="Unable to fetch courses from Google Sheets")
        except Exception as e:
            logger.error(f"Error parsing Google Sheets data: {e}")
            raise HTTPException(status_code=500, detail="Error processing course data")

# API Routes
@api_router.get("/")
async def root():
    return {"message": "CourseSwipe API is running!"}

@api_router.get("/courses", response_model=dict)
async def get_courses():
    """Fetch all courses from Google Sheets in real-time"""
    courses = await GoogleSheetsService.fetch_courses()
    return {"courses": [course.dict() for course in courses]}

@api_router.post("/swipe-history")
async def record_swipe_action(swipe_action: SwipeAction):
    """Record a user's swipe action"""
    try:
        history_entry = SwipeHistory(
            session_id=swipe_action.session_id or "anonymous",
            course_id=swipe_action.course_id,
            action=swipe_action.action
        )
        
        await db.swipe_history.insert_one(history_entry.dict())
        return {"status": "success", "message": "Swipe action recorded"}
        
    except Exception as e:
        logger.error(f"Error recording swipe action: {e}")
        raise HTTPException(status_code=500, detail="Failed to record swipe action")

@api_router.get("/swipe-history/{session_id}", response_model=HistoryResponse)
async def get_swipe_history(session_id: str = "anonymous"):
    """Get user's swipe history"""
    try:
        history_records = await db.swipe_history.find({"session_id": session_id}).to_list(1000)
        
        saved_courses = [record["course_id"] for record in history_records if record["action"] == "save"]
        ignored_courses = [record["course_id"] for record in history_records if record["action"] == "ignore"]
        
        return HistoryResponse(
            saved_courses=saved_courses,
            ignored_courses=ignored_courses
        )
        
    except Exception as e:
        logger.error(f"Error fetching swipe history: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch swipe history")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()