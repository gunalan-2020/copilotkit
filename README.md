# CopilotKit Backend

NestJS backend with PostgreSQL, OAuth authentication, and dashboard/chart/chat management.

## Features

- **OAuth Authentication**: Google & GitHub login
- **User Management**: Profile management with JWT tokens
- **Dashboards**: Create and manage multiple dashboards per user
- **Charts**: Add charts to dashboards with customizable config/data
- **Chat**: Store conversation history with ordered messages

## Tech Stack

- NestJS + TypeScript
- PostgreSQL + TypeORM
- Passport (Google, GitHub, JWT)
- Class Validator

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Create database
createdb copilotkit

# Run development server
npm run start:dev
```

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=copilotkit

# JWT
JWT_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

# Frontend
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=3000
```

## Database Schema

```
User (1) ----< (N) Dashboard (1) ----< (N) Chart
                         |
                         └---- (1) Chat (1) ----< (N) ChatMessage
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/google` | Login with Google |
| GET | `/auth/google/callback` | Google callback |
| GET | `/auth/github` | Login with GitHub |
| GET | `/auth/github/callback` | GitHub callback |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user |
| GET | `/users/:id` | Get user by ID |
| PUT | `/users/:id` | Update user |

### Dashboards
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/dashboards` | Create dashboard |
| GET | `/dashboards` | List user dashboards |
| GET | `/dashboards/:id` | Get dashboard |
| PUT | `/dashboards/:id` | Update dashboard |
| DELETE | `/dashboards/:id` | Delete dashboard |

### Charts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/charts` | Create chart |
| GET | `/charts/dashboard/:dashboardId` | List dashboard charts |
| GET | `/charts/:id` | Get chart |
| PUT | `/charts/:id` | Update chart |
| DELETE | `/charts/:id` | Delete chart |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/chats/dashboard/:dashboardId` | Get chat |
| GET | `/chats/dashboard/:dashboardId/messages` | Get messages |
| POST | `/chats/dashboard/:dashboardId/messages` | Add message |
| DELETE | `/chats/dashboard/:dashboardId/messages` | Clear messages |
| PUT | `/chats/dashboard/:dashboardId` | Update chat title |

## DTO Examples

### Create Dashboard
```json
{
  "name": "My Dashboard",
  "description": "Sales analytics"
}
```

### Create Chart
```json
{
  "name": "Revenue Chart",
  "type": "bar",
  "config": { "xAxis": "month", "yAxis": "revenue" },
  "data": [{ "month": "Jan", "revenue": 1000 }],
  "dashboardId": "uuid"
}
```

### Add Chat Message
```json
{
  "content": "Hello, assistant!",
  "role": "user"
}
```

## Getting OAuth Credentials

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project → APIs & Services → OAuth consent screen
3. Create OAuth client ID (Web application)
4. Add redirect URI: `http://localhost:3000/auth/google/callback`
5. Copy Client ID and Client Secret

### GitHub OAuth
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. New OAuth App
3. Add callback URL: `http://localhost:3000/auth/github/callback`
4. Copy Client ID and generate Client Secret

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure proper CORS origin
- [ ] Run migrations instead of `synchronize`
- [ ] Enable HTTPS
- [ ] Set up proper logging

## Development

```bash
# Build
npm run build

# Lint
npm run lint

# Run tests
npm run test
```
