# LiveTrack - Frontend

A modern Vue.js application for real-time location tracking with consent-based sharing.

## 🚀 Features

- **Real-time Location Tracking**: Share and view live location updates
- **Consent-Based**: Users must explicitly grant permission to share location
- **Temporary Sessions**: Tracking sessions can auto-expire or be manually ended
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Interactive Maps**: Google Maps integration for real-time visualization
- **QR Code Sharing**: Generate QR codes for easy link sharing
- **Session Management**: Full CRUD operations for tracking sessions
- **Admin Panel**: System overview and management tools

## 🛠️ Tech Stack

- **Framework**: Vue.js 3 (Composition API)
- **Routing**: Vue Router 4
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Icons**: Lucide Vue
- **Maps**: Google Maps JavaScript API
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **QR Codes**: qrcode library

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tracking-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```
   VITE_API_URL=http://localhost:3001/api
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── layout/         # Layout components (Navbar, Footer)
│   ├── ui/             # UI components (Modal, Alert, etc.)
│   └── SessionCard.vue # Session display component
├── layouts/            # Page layouts
│   ├── DefaultLayout.vue
│   └── AuthLayout.vue
├── pages/              # Route components
│   ├── auth/           # Authentication pages
│   ├── Dashboard.vue   # Main dashboard
│   ├── NewSession.vue  # Create new tracking session
│   ├── RiderShare.vue  # Location sharing interface
│   ├── PublicViewer.vue # Public tracking viewer
│   └── ...
├── router/             # Vue Router configuration
├── stores/             # Pinia stores
│   ├── auth.js         # Authentication state
│   └── session.js      # Session management
├── services/           # API and external services
│   ├── api.js          # HTTP client setup
│   └── maps.js         # Google Maps integration
├── utils/              # Utility functions
└── style.css           # Global styles
```

## 🔑 Key Features

### Authentication
- Login, register, and password reset
- JWT token-based authentication
- Protected routes and role-based access

### Session Management
- Create tracking sessions with custom notes
- Auto-expiring sessions
- Real-time location updates
- Session history and analytics

### Location Tracking
- Browser-based geolocation
- Real-time position updates
- Location accuracy indicators
- Interactive map visualization

### Sharing & Privacy
- Shareable tracking links
- QR code generation
- Consent-based location sharing
- Session-based privacy controls

## 🎨 UI Components

The app uses a comprehensive design system built with Tailwind CSS:

- **Buttons**: Primary, secondary, success, danger variants
- **Forms**: Styled inputs, selects, and form validation
- **Cards**: Consistent card layouts throughout the app
- **Status Badges**: Visual indicators for session status
- **Modals**: Reusable modal component
- **Alerts**: Success, error, warning notifications

## 📱 Mobile Responsiveness

- Mobile-first design approach
- Touch-friendly interfaces
- Responsive navigation
- Optimized map interactions
- Progressive Web App ready

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Style

- Vue 3 Composition API with `<script setup>`
- Consistent component naming
- Proper TypeScript-style prop definitions
- Reactive state management with Pinia

## 🚀 Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

3. **Environment variables** for production:
   - Set `VITE_API_URL` to your backend API
   - Configure Google Maps API key
   - Update `VITE_APP_URL` for correct redirects

## 🔗 API Integration

The frontend expects a REST API with the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/forgot-password` - Password reset
- `GET /auth/me` - Get current user

### Sessions
- `GET /sessions` - List user sessions
- `POST /sessions` - Create new session
- `GET /sessions/:code` - Get session details
- `POST /sessions/:code/location` - Update location
- `POST /sessions/:code/end` - End session
- `DELETE /sessions/:code` - Delete session

### Admin (Optional)
- `GET /admin/stats` - System statistics
- `GET /admin/sessions/recent` - Recent sessions
- `GET /admin/reports` - Abuse reports

## 🗺️ Google Maps Setup

1. **Get API Key** from Google Cloud Console
2. **Enable APIs**:
   - Maps JavaScript API
   - Geolocation API
3. **Configure restrictions** for security
4. **Add to environment** variables

## 🔒 Security Features

- Environment-based configuration
- API request interceptors
- Auto logout on token expiration
- Input validation and sanitization
- CORS and security headers (backend)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or support, please contact the development team or create an issue in the repository.


## Jittering Fix
| Fix                          | Description                           |
| ---------------------------- | ------------------------------------- |
| ✅ Filter by `accuracy <= 30` | Only use good readings                |
| ✅ Ignore movements `< 15m`   | Prevent jitter from false positives   |
| ✅ Throttle updates (5–10s)   | Fewer GPS calls = more stable results |
| ✅ Use `watchPosition()`      | Already using — good                  |
| 🔁 Kalman Filter (optional)  | For smoother animation/path tracking  |
