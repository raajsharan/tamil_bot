# 📡 Tamil Calendar API Documentation

## Base URL
```
https://your-domain.com/api
```

## Authentication
All admin endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🔓 PUBLIC API ENDPOINTS

### 1. Get Today's Panchangam
```
GET /public/today
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "date": "2024-01-15T00:00:00Z",
    "dateString": "2024-01-15",
    "tamilDate": "15 சித்திரை",
    "tithi": {
      "name": "Navami",
      "nameTamil": "நவமி",
      "startTime": "06:00",
      "endTime": "18:00"
    },
    "nakshatram": {
      "name": "Kritika",
      "nameTamil": "கிருத்திகை",
      "startTime": "06:00",
      "endTime": "18:00"
    },
    "sunrise": "06:15",
    "sunset": "18:30",
    "rahuKalam": {
      "startTime": "14:30",
      "endTime": "16:00"
    },
    "festivals": [
      {
        "name": "Pongal",
        "nameTamil": "பொங்கல்",
        "type": "major",
        "description": "Harvest festival"
      }
    ]
  },
  "timestamp": "2024-01-15T12:00:00Z"
}
```

**Status Codes:**
- `200` - Success
- `404` - Data not found

---

### 2. Get Tomorrow's Panchangam
```
GET /public/tomorrow
```

Same response structure as `/today`

---

### 3. Get Specific Date
```
GET /public/date/:dateString
```

**Parameters:**
- `dateString` (required) - Date in YYYY-MM-DD format

**Example:**
```
GET /public/date/2024-01-15
```

---

### 4. Get Monthly Calendar
```
GET /public/month/:year/:month
```

**Parameters:**
- `year` (required) - 4-digit year (e.g., 2024)
- `month` (required) - Month number 1-12

**Example:**
```
GET /public/month/2024/01
```

**Response:**
```json
{
  "success": true,
  "year": 2024,
  "month": 1,
  "count": 31,
  "data": [
    {
      "dateString": "2024-01-01",
      "tamilDate": "1 சித்திரை",
      "tithi": { ... },
      "nakshatram": { ... }
    },
    ...
  ]
}
```

---

### 5. Get Festivals
```
GET /public/festivals
```

**Query Parameters:**
- `month` (optional) - Month number 1-12
- `year` (optional) - 4-digit year
- `limit` (optional) - Max results (default: 50, max: 100)

**Example:**
```
GET /public/festivals?month=1&year=2024&limit=20
```

---

### 6. Get Amavasya (New Moon) Dates
```
GET /public/amavasya
```

**Query Parameters:**
- `year` (optional) - 4-digit year (default: current year)

**Example:**
```
GET /public/amavasya?year=2024
```

**Response:**
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "date": "2024-01-11",
      "dateString": "2024-01-11",
      "tamilDate": "11 சித்திரை",
      "moonPhase": {
        "phase": "new",
        "illumination": 0
      }
    },
    ...
  ]
}
```

---

### 7. Get Pournami (Full Moon) Dates
```
GET /public/pournami
```

Same parameters and response structure as `/amavasya`

---

### 8. Search Calendar
```
GET /public/search
```

**Query Parameters:**
- `q` (required) - Search query (min. 1 character)
- `limit` (optional) - Max results (default: 20, max: 100)

**Example:**
```
GET /public/search?q=Pongal&limit=10
```

**Response:**
```json
{
  "success": true,
  "query": "Pongal",
  "count": 5,
  "data": [
    {
      "dateString": "2024-01-15",
      "tamilDate": "15 சித்திரை",
      "festivals": [
        {
          "name": "Pongal",
          "description": "Harvest festival"
        }
      ]
    }
  ]
}
```

---

### 9. Get Date Range
```
GET /public/range/:startDate/:endDate
```

**Parameters:**
- `startDate` (required) - YYYY-MM-DD format
- `endDate` (required) - YYYY-MM-DD format

**Example:**
```
GET /public/range/2024-01-01/2024-01-31
```

---

## 🔐 ADMIN API ENDPOINTS

### 1. Login
```
POST /admin/login
```

**Request Body:**
```json
{
  "email": "admin@tamil-calendar.local",
  "password": "YourPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "_id": "...",
    "email": "admin@tamil-calendar.local",
    "name": "Administrator",
    "role": "admin",
    "lastLogin": "2024-01-15T10:30:00Z"
  },
  "expiresIn": "7d"
}
```

**Status Codes:**
- `200` - Success
- `401` - Invalid credentials

---

### 2. Get Admin Profile
```
GET /admin/profile
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "email": "admin@tamil-calendar.local",
    "name": "Administrator",
    "role": "admin",
    "permissions": [
      "view_calendar",
      "edit_calendar",
      "manage_scraper"
    ],
    "lastLogin": "2024-01-15T10:30:00Z"
  }
}
```

---

### 3. Get Dashboard
```
GET /admin/dashboard
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": {
      "byType": [ ... ],
      "byStatus": [ ... ],
      "bySeverity": [ ... ],
      "errors": { "total": 5 },
      "totalLogs": { "total": 1250 }
    },
    "calendar": {
      "totalEntries": 365,
      "entriesWithError": 3,
      "overriddenEntries": 12,
      "errorRate": "0.82%"
    },
    "recentActivity": [
      {
        "message": "Calendar entry updated",
        "type": "calendar_override",
        "status": "success",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

### 4. Get Calendar Entries
```
GET /admin/calendar
Authorization: Bearer TOKEN
```

**Query Parameters:**
- `month` (optional) - Month number 1-12
- `year` (optional) - 4-digit year
- `limit` (optional) - Max results (default: 50)
- `skip` (optional) - Pagination offset
- `showErrors` (optional) - Show only entries with errors (true/false)

**Example:**
```
GET /admin/calendar?month=1&year=2024&limit=30
```

---

### 5. Get Calendar Entry
```
GET /admin/calendar/:dateString
Authorization: Bearer TOKEN
```

**Parameters:**
- `dateString` (required) - YYYY-MM-DD format

**Response:**
```json
{
  "success": true,
  "data": {
    "dateString": "2024-01-15",
    "tamilDate": "15 சித்திரை",
    "tithi": { ... },
    "nakshatram": { ... },
    "sunrise": "06:15",
    "sunset": "18:30",
    "dataQuality": {
      "hasError": false,
      "isVerified": true,
      "confidence": 95
    },
    "manualOverride": {
      "isOverridden": false
    }
  }
}
```

---

### 6. Update Calendar Entry (Override)
```
PUT /admin/calendar/:dateString
Authorization: Bearer TOKEN
```

**Parameters:**
- `dateString` (required) - YYYY-MM-DD format

**Request Body:**
```json
{
  "reason": "Corrected based on astronomical data",
  "data": {
    "tithi": {
      "name": "Navami",
      "startTime": "06:00",
      "endTime": "18:00"
    },
    "sunrise": "06:20",
    "sunset": "18:35"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Calendar entry updated successfully",
  "data": { ... }
}
```

---

### 7. Verify Calendar Data
```
POST /admin/calendar/:dateString/verify
Authorization: Bearer TOKEN
```

**Parameters:**
- `dateString` (required) - YYYY-MM-DD format

**Request Body:**
```json
{
  "confidence": 95
}
```

**Response:**
```json
{
  "success": true,
  "message": "Calendar data verified",
  "data": { ... }
}
```

---

### 8. Get Activity Logs
```
GET /admin/logs
Authorization: Bearer TOKEN
```

**Query Parameters:**
- `type` (optional) - Log type (scraper, calendar_override, error, etc.)
- `status` (optional) - Status (success, failed, warning)
- `severity` (optional) - Severity (info, warning, error, critical)
- `limit` (optional) - Max results (default: 50)
- `page` (optional) - Page number for pagination

**Example:**
```
GET /admin/logs?type=scraper&severity=error&limit=20&page=0
```

**Response:**
```json
{
  "success": true,
  "pagination": {
    "total": 245,
    "limit": 50,
    "page": 0,
    "pages": 5
  },
  "data": [
    {
      "_id": "...",
      "type": "scraper",
      "message": "Scraper failed for date",
      "status": "failed",
      "severity": "warning",
      "createdAt": "2024-01-15T04:35:00Z"
    }
  ]
}
```

---

### 9. Run Scraper
```
POST /admin/scraper/run
Authorization: Bearer TOKEN
```

**Request Body:**
```json
{
  "sources": ["all"]
}
```

**Possible sources:**
- `all` - All enabled scrapers
- `drikpanchang` - Drik Panchang only
- `prokerala` - Pro Kerala only
- `dinamalar` - Dinamalar only

**Response:**
```json
{
  "success": true,
  "message": "Scraper triggered successfully",
  "details": {
    "sources": ["all"],
    "triggeredBy": "admin@tamil-calendar.local",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

### 10. Logout
```
POST /admin/logout
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

**Common Status Codes:**
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Server Error

---

## Rate Limiting

Public endpoints: 100 requests per 15 minutes
Admin endpoints: 5 requests per 15 minutes

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1705332000
```

---

## Pagination

For endpoints returning multiple results:

**Query Parameters:**
- `limit` - Results per page (default: 50, max: 1000)
- `page` or `skip` - Pagination offset

**Response Meta:**
```json
{
  "pagination": {
    "total": 365,
    "limit": 50,
    "page": 0,
    "pages": 8
  },
  "data": [ ... ]
}
```

---

## Date Formats

All dates are in ISO 8601 format:
- API responses: `2024-01-15T10:30:00Z`
- URL parameters: `2024-01-15`
- Response time format: `HH:MM` (24-hour)

---

## Caching

Public endpoints support HTTP caching:
- `/today` - Cached for 1 hour
- `/month/:year/:month` - Cached for 24 hours
- `/festivals` - Cached for 7 days

---

## Example Requests

### JavaScript/Fetch API
```javascript
// Get today's data
fetch('https://your-domain.com/api/public/today')
  .then(res => res.json())
  .then(data => console.log(data));

// Admin login
fetch('https://your-domain.com/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@tamil-calendar.local',
    password: 'password'
  })
})
  .then(res => res.json())
  .then(data => {
    localStorage.setItem('token', data.token);
  });
```

### cURL
```bash
# Get today's data
curl https://your-domain.com/api/public/today

# Get specific date
curl https://your-domain.com/api/public/date/2024-01-15

# Admin login
curl -X POST https://your-domain.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tamil-calendar.local","password":"password"}'

# Get dashboard (requires token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-domain.com/api/admin/dashboard
```

### Python/Requests
```python
import requests

# Get today's data
response = requests.get('https://your-domain.com/api/public/today')
data = response.json()
print(data)

# Admin login
response = requests.post(
  'https://your-domain.com/api/admin/login',
  json={'email': 'admin@tamil-calendar.local', 'password': 'password'}
)
token = response.json()['token']

# Get dashboard
headers = {'Authorization': f'Bearer {token}'}
response = requests.get(
  'https://your-domain.com/api/admin/dashboard',
  headers=headers
)
```

---

## Support

For API issues or questions, please:
1. Check this documentation
2. Review error messages
3. Check application logs
4. Contact: support@tamil-calendar.com

Last Updated: January 2024
