# CourseSwipe Backend Integration Contracts

## API Contracts

### 1. GET /api/courses
**Purpose**: Fetch all courses from Google Sheets in real-time
**Response Format**:
```json
{
  "courses": [
    {
      "id": "unique_id",
      "course_name": "Course Title",
      "description": "Course description text",
      "link": "https://course-url.com",
      "datetime": "2024-01-01T00:00:00Z" // optional field
    }
  ]
}
```

### 2. POST /api/swipe-history
**Purpose**: Store user swipe actions (save/ignore)
**Request Body**:
```json
{
  "course_id": "unique_id",
  "action": "save" | "ignore",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 3. GET /api/swipe-history
**Purpose**: Retrieve user's swipe history
**Response Format**:
```json
{
  "saved_courses": ["course_id_1", "course_id_2"],
  "ignored_courses": ["course_id_3", "course_id_4"]
}
```

## Data Mocked in Frontend (to be replaced)

### Location: `/app/frontend/src/data/mock.js`
- Array of 17 courses with fields: `id`, `course_name`, `description`, `link`
- Currently used in SwipeContext for course management

### Location: `/app/frontend/src/context/SwipeContext.js`
- `courses` state - will be populated from API
- `savedCourses` and `ignoredCourses` - will sync with backend
- Need to add API integration for real-time data fetching

## Backend Implementation Plan

### 1. Google Sheets Integration
- **Sheet URL**: https://docs.google.com/spreadsheets/d/1WzPZQzqtdPMTPYj5Z7YDV1NA038-bZcoM6YiLra9Wa8/edit?gid=0#gid=0
- **Access Method**: CSV export from public sheet
- **CSV URL Format**: `https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=0`
- **Data Processing**: Parse CSV and convert to JSON format
- **Real-time Updates**: Fetch fresh data on each API call (no caching for now)

### 2. Database Schema (MongoDB)
```python
# Course model (cached from Google Sheets)
class Course(BaseModel):
    id: str
    course_name: str
    description: str
    link: str
    datetime: Optional[str] = None
    last_updated: datetime

# User swipe history
class SwipeHistory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str  # For anonymous tracking
    course_id: str
    action: str  # "save" or "ignore"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
```

### 3. Backend Services
- **GoogleSheetsService**: Handle CSV fetching and parsing
- **CourseService**: Manage course data and caching
- **HistoryService**: Track user swipe actions

## Frontend-Backend Integration Steps

### 1. Replace Mock Data
- Update `SwipeContext.js` to fetch from `/api/courses`
- Add loading states during data fetch
- Handle API errors gracefully

### 2. Add History Sync
- Call `/api/swipe-history` on swipe actions
- Sync local state with backend state
- Add session management for anonymous users

### 3. Real-time Updates
- Implement periodic refresh of course data
- Add manual refresh functionality
- Handle new courses added to sheet

## Error Handling
- Google Sheets unavailable: Use cached data or mock fallback
- API failures: Show user-friendly error messages
- Network issues: Implement retry mechanisms

## Testing Requirements
- Verify Google Sheets CSV parsing
- Test real-time data updates
- Validate swipe history persistence
- Check error handling scenarios