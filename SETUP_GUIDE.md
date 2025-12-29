# Step-by-Step Setup and Testing Guide

This guide will walk you through setting up and testing the Smart Fitness Routine & Meal Planner application on your local machine.

## Prerequisites

Before starting, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/mysql/)
- **npm** (comes with Node.js)
- A code editor (VS Code recommended)

---

## Step 1: Database Setup

### 1.1 Install and Start MySQL

1. Install MySQL if you haven't already
2. Start MySQL service:
   - **Windows**: Start MySQL from Services or Command Prompt
   - **macOS**: `brew services start mysql` or use MySQL Workbench
   - **Linux**: `sudo systemctl start mysql`

### 1.2 Create Database and Tables

1. Open MySQL command line or MySQL Workbench
2. Connect to MySQL (default user is usually `root`)
3. Run the database initialization script:

```bash
# Navigate to backend directory
cd backend

# Run the SQL script (replace with your MySQL credentials)
mysql -u root -p < src/config/db-init.sql
```

**Or manually in MySQL:**

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS smart_fitness CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE smart_fitness;

-- Then copy and paste the contents of backend/src/config/db-init.sql
```

### 1.3 Verify Database Creation

```sql
-- Check if tables were created
SHOW TABLES;

-- You should see:
-- - users
-- - workout_meal_plans
```

---

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd backend
```

### 2.2 Install Backend Dependencies

```bash
npm install
```

**Expected output:** Dependencies should install without errors (this may take 1-2 minutes)

### 2.3 Configure Environment Variables

1. Create a `.env` file in the `backend` directory:

```bash
# On Windows (PowerShell)
New-Item .env

# On macOS/Linux
touch .env
```

2. Copy the following content into `.env`:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=smart_fitness
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL root password.

### 2.4 Start the Backend Server

```bash
npm run dev
```

**Expected output:**
```
Server is running on port 3000
```

**If you see errors:**
- Check your MySQL credentials in `.env`
- Ensure MySQL is running
- Verify database `smart_fitness` exists

**Keep this terminal window open!** The backend needs to keep running.

### 2.5 Test Backend API (Optional)

Open a new terminal and test the health endpoint:

```bash
# On Windows (PowerShell)
curl http://localhost:3000/health

# Or use a browser to visit:
# http://localhost:3000/health
```

**Expected response:**
```json
{"status":"ok","message":"Smart Fitness API is running"}
```

---

## Step 3: Frontend Setup

### 3.1 Open a New Terminal Window

Keep the backend running in the first terminal, open a new one for the frontend.

### 3.2 Navigate to Frontend Directory

```bash
cd frontend
```

### 3.3 Install Frontend Dependencies

```bash
npm install
```

**Expected output:** Dependencies should install (this may take 2-3 minutes as Angular has many dependencies)

**Note:** If you encounter issues with Angular CLI, you may need to install it globally:
```bash
npm install -g @angular/cli
```

### 3.4 Start the Frontend Development Server

```bash
npm start
```

**Expected output:**
```
** Angular Live Development Server is listening on localhost:4200 **
```

The Angular dev server will automatically open your browser to `http://localhost:4200`

**Keep this terminal window open too!**

---

## Step 4: Testing the Application

### 4.1 Initial Access

1. Open your browser and go to: `http://localhost:4200`
2. You should see the **Auth/Login** page

### 4.2 Create a New Account (Registration)

1. Click "Need an account? Register" or the register link
2. Fill in the registration form:
   - **Email**: `test@example.com`
   - **Name**: `Test User`
   - **Password**: `password123` (minimum 6 characters)
3. Click **Register**

**Expected result:**
- Success message appears
- You're automatically redirected to the Profile page
- Navigation bar appears at the top

### 4.3 Test Profile Page

1. On the Profile page, you should see a form with:
   - Name field (pre-filled with your registered name)
   - Age, Gender, Height, Weight fields
   - Fitness Goal selector (Weight Loss, Muscle Gain, Maintenance)

2. **Fill in your profile:**
   - Age: `25`
   - Gender: Select `Male` or `Female`
   - Height (cm): `175`
   - Weight (kg): `70`
   - Goal: Select `weight_loss` (or any goal)

3. Click **Save Changes**

**Expected result:**
- Success notification appears
- Profile data is saved

4. Click **Regenerate Plans**

**Expected result:**
- Success message appears
- Workout and meal plans are generated based on your goal

### 4.4 Test Workout Routine Page

1. Click **Workouts** in the navigation bar
2. You should see:
   - Day selector (Mon, Tue, Wed, etc.)
   - Selected day's workout plan
   - List of exercises with checkboxes
   - Progress bar

3. **Test exercise completion:**
   - Click on any exercise checkbox
   - Exercise should be marked as completed (checkmark appears)
   - Progress bar should update
   - If all exercises are completed, a success message appears

4. **Test day navigation:**
   - Click different days in the day selector
   - Each day should show different exercises

### 4.5 Test Meal Planner Page

1. Click **Meals** in the navigation bar
2. You should see:
   - Day selector
   - Nutrition overview (Calories, Protein, Carbs)
   - List of meals for the selected day (Breakfast, Lunch, Dinner, Snacks)

3. **Test meal completion:**
   - Click on any meal checkbox
   - Meal should be marked as consumed
   - Calorie counters should update

4. **Test day navigation:**
   - Switch between different days
   - Each day should show different meal plans

### 4.6 Test Progress Tracker Page

1. Click **Progress** in the navigation bar
2. You should see:
   - Statistics cards (Current Weight, Goal, Exercise Completion, Calorie Completion)
   - Charts showing progress over time

**Note:** Charts may show limited data initially. Data accumulates as you complete exercises and meals.

### 4.7 Test Logout

1. Click **Logout** in the navigation bar
2. You should be redirected to the Login page
3. Try accessing `/profile` directly - you should be redirected back to login (this tests the auth guard)

### 4.8 Test Login

1. Use the credentials you created:
   - Email: `test@example.com`
   - Password: `password123`
2. Click **Login**

**Expected result:**
- Success message appears
- You're redirected to the Profile page
- All your saved data is loaded

---

## Step 5: Testing API Endpoints (Optional)

You can test the backend API directly using a tool like **Postman** or **curl**:

### 5.1 Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user2@example.com","password":"password123","name":"User Two"}'
```

### 5.2 Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Copy the token from the response** for the next requests.

### 5.3 Get Profile (with token)

```bash
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5.4 Get Plans

```bash
curl http://localhost:3000/api/plans \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Troubleshooting

### Backend Issues

**Error: Cannot connect to MySQL**
- Check MySQL is running
- Verify credentials in `.env` file
- Ensure database `smart_fitness` exists

**Error: Port 3000 already in use**
- Change `PORT` in `.env` to another port (e.g., 3001)
- Update frontend API URL in `frontend/src/app/services/auth.service.ts` and `fitness.service.ts`

**Error: Module not found**
- Run `npm install` again in the backend directory
- Delete `node_modules` and `package-lock.json`, then run `npm install`

### Frontend Issues

**Error: Angular CLI not found**
```bash
npm install -g @angular/cli
```

**Error: Port 4200 already in use**
- Angular will prompt you to use a different port, press `Y`
- Or kill the process using port 4200

**Error: Cannot connect to API**
- Ensure backend is running on port 3000
- Check `CORS` is enabled in backend (it should be)
- Verify API URL in services is `http://localhost:3000/api`

**Blank page or errors in browser console**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab to see if API calls are failing

### Database Issues

**Error: Access denied for user**
- Verify MySQL username and password in `.env`
- Ensure MySQL user has proper permissions

**Error: Table doesn't exist**
- Run the database initialization script again
- Check that you're using the correct database: `USE smart_fitness;`

---

## Quick Start Summary

For quick reference, here's the essential command sequence:

```bash
# Terminal 1 - Backend
cd backend
npm install
# Create .env file with MySQL credentials
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm start

# Browser
# Visit http://localhost:4200
# Register → Fill Profile → View Workouts/Meals/Progress
```

---

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can register a new user
- [ ] Can login with registered credentials
- [ ] Can view and update profile
- [ ] Can regenerate plans
- [ ] Can view workout routines
- [ ] Can mark exercises as completed
- [ ] Can view meal plans
- [ ] Can mark meals as consumed
- [ ] Can view progress tracker
- [ ] Can logout
- [ ] Cannot access protected routes without login (auth guard works)

---

## Next Steps

Once everything is working:

1. **Explore the code:**
   - Backend routes in `backend/src/routes/`
   - Frontend components in `frontend/src/app/components/`
   - Services in `frontend/src/app/services/`

2. **Customize:**
   - Modify workout exercises in `backend/src/services/planGenerator.ts`
   - Modify meal plans in the same file
   - Update UI styling in component `.scss` files

3. **Add features:**
   - Additional user fields
   - More exercise types
   - Custom meal plans
   - Enhanced progress tracking

---

## Support

If you encounter issues not covered here:

1. Check browser console (F12) for frontend errors
2. Check backend terminal for server errors
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed
5. Check that MySQL is running and accessible

