## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info

### Tracking Sessions
- `POST /sessions` - Create new tracking session
- `GET /sessions` - Get user's sessions
- `GET /sessions/:id` - Get specific session
- `PATCH /sessions/:id/end` - End session
- `GET /sessions/:id/stats` - Get session statistics

### Location Updates
- `POST /location/:code` - Push location update (rider)
- `GET /location/:code/latest` - Get latest location
- `GET /location/:code/all` - Get location history
- `GET /location/:code/stats` - Get location statistics

### Public Access
- `GET /public/:code` - Get session info by code
- `GET /public/:code/view` - Get live location for viewers
- `GET /public/:code/stats` - Get public session stats

### Utility
- `GET /health` - Health check endpoint

## 💡 Usage Examples

### 1. Register and Login
```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### 2. Create Tracking Session
```bash
curl -X POST http://localhost:3000/sessions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description":"Trip to downtown"}'
```

### 3. Push Location (Rider)
```bash
curl -X POST http://localhost:3000/location/TRK-ABC123 \
  -H "Content-Type: application/json" \
  -d '{"latitude":40.7128,"longitude":-74.0060,"accuracy":10}'
```

### 4. View Live Location (Public)
```bash
curl http://localhost:3000/public/TRK-ABC123/view
```

## 🔒 Security Features

- **JWT Authentication** for secure API access
- **Rate Limiting** to prevent abuse
- **Input Validation** on all endpoints
- **SQL Injection Protection** via Sequelize ORM
- **CORS** and **Helmet** security middleware
- **Password Hashing** with bcrypt
