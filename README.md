# Smart Fitness Routine & Meal Planner

A full-stack web application that provides personalized fitness routines and meal plans based on user goals.

## Technical Stack

### Frontend
- **Angular 18**
- **Angular Material** for UI components
- **TypeScript**
- **Angular Routing**
- **Angular Guards** for role-based access
- **ngx-charts** for progress graphs

### Backend
- **Node.js**
- **Express.js**
- **TypeScript**
- **RESTful API** architecture
- Centralized validation & error handling

### Database
- **MySQL**
- Two tables: `users` and `workout_meal_plans`
- Simple relational mapping (Users ↔ WorkoutMealPlans)

## Project Structure

```
.
├── backend/          # Node.js + Express backend
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── middleware/   # Auth, validation, error handling
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── server.ts     # Entry point
│   └── package.json
│
└── frontend/        # Angular 18 frontend
    ├── src/
    │   └── app/
    │       ├── components/    # Angular components
    │       ├── guards/        # Route guards
    │       ├── interceptors/  # HTTP interceptors
    │       ├── models/        # TypeScript models
    │       ├── services/      # Angular services
    │       └── app.module.ts
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smart_fitness
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

4. Initialize the database:
```bash
mysql -u root -p < src/config/db-init.sql
```

5. Start the backend server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update the API URL in `src/app/services/auth.service.ts` and `src/app/services/fitness.service.ts` if needed (default: `http://localhost:3000/api`)

4. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:4200`

## Features

### User Roles
- **User**: Can register, set fitness goals, view workouts and meal plans, and track progress
- **Trainer/Admin** (Optional): Can manage workout templates, meal plans, and provide analytics

### Core Features
1. **Profile Management**: Users can create and update their profile with personal information and fitness goals
2. **Workout Routines**: Auto-generated weekly workout routines based on goals
3. **Meal Planner**: Personalized meal plans with calorie tracking
4. **Progress Tracker**: Visual progress tracking with charts and graphs

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile/regenerate-plans` - Regenerate workout and meal plans

#### Plans
- `GET /api/plans` - Get all weekly plans
- `GET /api/plans/:day` - Get plan for specific day
- `PUT /api/plans/:day` - Update plan (mark exercises/meals as completed)

#### Progress
- `GET /api/progress` - Get progress data
- `GET /api/progress/stats` - Get progress statistics

## Database Schema

### Users Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `name` (VARCHAR(255))
- `age` (INT)
- `gender` (ENUM: 'male', 'female', 'other')
- `height` (DECIMAL(5,2)) - Height in cm
- `weight` (DECIMAL(5,2)) - Weight in kg
- `goal` (ENUM: 'weight_loss', 'muscle_gain', 'maintenance')
- `email` (VARCHAR(255), UNIQUE)
- `password_hash` (VARCHAR(255))
- `role` (ENUM: 'user', 'trainer', 'admin')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### WorkoutMealPlans Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (INT, FOREIGN KEY → users.id)
- `day` (ENUM: 'Monday' through 'Sunday')
- `exercises` (JSON) - Array of exercise objects
- `meals` (JSON) - Array of meal objects with calories
- `completed_status` (JSON) - Tracks completed exercises/meals
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with hot-reload
npm run build  # Builds for production
npm start  # Runs production build
```

### Frontend Development
```bash
cd frontend
npm start  # Starts Angular dev server
npm run build  # Builds for production
```

## License

ISC
