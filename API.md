# API Documentation - NutriAthlete AI

## Overview

The API follows RESTful conventions and uses JSON for request/response bodies. All endpoints require authentication via JWT tokens (sent as HTTP-only cookies).

**Base URL**: `https://api.nutriathlete.ai` (or `http://localhost:3000` in development)

## Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (201):
```json
{
  "message": "Conta criada com sucesso",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### Logout
```http
POST /api/auth/logout
```

**Response** (200):
```json
{
  "message": "Logout realizado com sucesso"
}
```

## Athletes

### List Athletes
```http
GET /api/athletes?organizationId={organizationId}
Authorization: Bearer {token}
```

**Response** (200):
```json
[
  {
    "id": "uuid",
    "organizationId": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "age": 25,
    "weight": "75.5",
    "height": "180",
    "targetWeight": "72.0",
    "sport": "jiu-jitsu",
    "notes": "...",
    "createdAt": "2026-03-13T10:00:00Z",
    "updatedAt": "2026-03-13T10:00:00Z",
    "deletedAt": null
  }
]
```

### Create Athlete
```http
POST /api/athletes
Authorization: Bearer {token}
Content-Type: application/json

{
  "organizationId": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "age": 25,
  "weight": "75.5",
  "height": "180",
  "targetWeight": "72.0",
  "sport": "jiu-jitsu",
  "notes": "..."
}
```

**Response** (201): Same as athlete object above

### Get Athlete
```http
GET /api/athletes/{id}
Authorization: Bearer {token}
```

**Response** (200): Single athlete object

### Update Athlete
```http
PUT /api/athletes/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "weight": "74.5",
  "targetWeight": "72.0"
}
```

**Response** (200): Updated athlete object

### Delete Athlete
```http
DELETE /api/athletes/{id}
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "message": "Atleta deletado com sucesso"
}
```

## Diets

### Generate Diet
```http
POST /api/diets/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "athleteId": "uuid",
  "organizationId": "uuid",
  "type": "maintenance",
  "dietName": "Dieta Personalizada"
}
```

**Diet Types**:
- `maintenance` - Manutenção do peso
- `cutting` - Perda de peso
- `bulking` - Ganho de massa
- `recomposition` - Recomposição corporal

**Response** (201):
```json
{
  "id": "uuid",
  "athleteId": "uuid",
  "organizationId": "uuid",
  "name": "Dieta Personalizada",
  "type": "maintenance",
  "dailyCalories": 2500,
  "protein": "180",
  "carbs": "280",
  "fat": "85",
  "meals": [
    {
      "name": "Café da Manhã",
      "foods": ["Ovos", "Pão integral"],
      "calories": 600
    }
  ],
  "generatedAt": "2026-03-13T10:00:00Z",
  "validUntil": "2026-04-12T10:00:00Z",
  "createdAt": "2026-03-13T10:00:00Z"
}
```

### List Diets
```http
GET /api/diets?organizationId={organizationId}&athleteId={athleteId}
Authorization: Bearer {token}
```

**Response** (200): Array of diet objects

### Get Diet
```http
GET /api/diets/{id}
Authorization: Bearer {token}
```

**Response** (200): Single diet object

## Progress

### Log Progress
```http
POST /api/progress
Authorization: Bearer {token}
Content-Type: application/json

{
  "athleteId": "uuid",
  "organizationId": "uuid",
  "weight": "74.5",
  "bodyFatPercentage": "15.2",
  "notes": "..."
}
```

**Response** (201): Progress record object

### Get Progress History
```http
GET /api/progress?athleteId={athleteId}
Authorization: Bearer {token}
```

**Response** (200): Array of progress records

## Error Handling

All errors return appropriate HTTP status codes and a JSON error message.

**Error Response**:
```json
{
  "message": "Error description"
}
```

**Common Status Codes**:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## Rate Limiting

API calls are rate-limited:
- **Auth endpoints**: 5 requests per minute per IP
- **Other endpoints**: 100 requests per minute per user

## SDK Examples

### JavaScript / Node.js

```javascript
const API_URL = 'http://localhost:3000'

// Login
const loginRes = await fetch(`${API_URL}/api/auth/login`, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})

// Get athletes
const athletesRes = await fetch(
  `${API_URL}/api/athletes?organizationId=org123`,
  { credentials: 'include' }
)
const athletes = await athletesRes.json()
```

### Python

```python
import requests

BASE_URL = 'http://localhost:3000'
session = requests.Session()

# Login
session.post(f'{BASE_URL}/api/auth/login', json={
    'email': 'user@example.com',
    'password': 'password123'
})

# Get athletes
response = session.get(
    f'{BASE_URL}/api/athletes',
    params={'organizationId': 'org123'}
)
athletes = response.json()
```

## Webhooks (Coming Soon)

Webhook support for subscription events will be available soon.

## Changelog

### v0.1.0 (2026-03-13)
- Initial API release
- Authentication endpoints
- Athletes management
- Diet generation with AI
- Progress tracking
