# Smart Fitness Backend

Node.js + Express + TypeScript backend for the Smart Fitness Routine & Meal Planner application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (see `.env.example`):
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

3. Initialize database:
```bash
mysql -u root -p < src/config/db-init.sql
```

4. Run development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Profile
- `GET /api/profile` - Get user profile (requires auth)
- `PUT /api/profile` - Update user profile (requires auth)
- `POST /api/profile/regenerate-plans` - Regenerate plans (requires auth)

### Plans
- `GET /api/plans` - Get all weekly plans (requires auth)
- `GET /api/plans/:day` - Get plan for specific day (requires auth)
- `PUT /api/plans/:day` - Update plan (requires auth)

### Progress
- `GET /api/progress` - Get progress data (requires auth)
- `GET /api/progress/stats` - Get progress statistics (requires auth)

## Database Schema

See `src/config/db-init.sql` for the complete database schema.

