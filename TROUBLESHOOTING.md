# Troubleshooting Guide - Common Terminal Errors

This guide helps diagnose and fix common terminal errors when running the Smart Fitness application.

## 🔍 Quick Diagnostic Steps

### 1. Check What Error You're Seeing

Please share the **complete error message** from your terminal. Common errors are listed below.

---

## Backend Errors

### Error: "Cannot find module 'mysql2'"

**Cause:** Dependencies not installed

**Solution:**
```bash
cd backend
npm install
```

---

### Error: "Cannot find module 'express'"

**Cause:** Dependencies not installed or incorrect directory

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

### Error: "Error: connect ECONNREFUSED 127.0.0.1:3306"

**Cause:** MySQL is not running or wrong credentials

**Solution:**
1. **Start MySQL service:**
   - Windows: Open Services → Start MySQL
   - macOS: `brew services start mysql`
   - Linux: `sudo systemctl start mysql`

2. **Check `.env` file exists and has correct password:**
   ```bash
   cd backend
   cat .env  # Check the file exists
   ```

3. **Verify MySQL credentials:**
   ```bash
   mysql -u root -p
   # Enter your password
   ```

---

### Error: "Unknown database 'smart_fitness'"

**Cause:** Database not created

**Solution:**
```bash
mysql -u root -p
source backend/src/config/db-init.sql
# Or manually run the SQL from backend/src/config/db-init.sql
```

---

### Error: "Port 3000 is already in use"

**Cause:** Another process is using port 3000

**Solution:**
**Windows:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

**OR** Change the port in `backend/.env`:
```env
PORT=3001
```
Then update frontend services to use port 3001.

---

### Error: "ts-node-dev: command not found"

**Cause:** Dependencies not installed

**Solution:**
```bash
cd backend
npm install
```

---

### Error: TypeScript compilation errors

**Common issues:**

1. **"Cannot find name 'require'"**
   - Check `tsconfig.json` has `"module": "commonjs"`

2. **"Property 'userId' does not exist on type 'Request'"**
   - This should be handled by the AuthRequest interface
   - Check middleware/auth.ts is properly imported

**Solution:**
```bash
cd backend
npm run build  # Check for TypeScript errors
```

---

## Frontend Errors

### Error: "Angular CLI not found"

**Cause:** Angular CLI not installed globally

**Solution:**
```bash
npm install -g @angular/cli
```

---

### Error: "ng: command not found"

**Cause:** Angular CLI not in PATH or not installed

**Solution:**
```bash
# Install globally
npm install -g @angular/cli

# OR use npx
npx ng serve
```

---

### Error: "Module not found: Can't resolve '@angular/core'"

**Cause:** Frontend dependencies not installed

**Solution:**
```bash
cd frontend
npm install
```

---

### Error: "Port 4200 is already in use"

**Cause:** Another Angular dev server is running

**Solution:**
- Accept the prompt to use a different port (press Y)
- OR kill the process:
  ```bash
  # Windows
  netstat -ano | findstr :4200
  taskkill /PID <PID> /F
  
  # macOS/Linux
  kill -9 $(lsof -ti:4200)
  ```

---

### Error: "Cannot GET /api/..."

**Cause:** Backend not running or CORS issue

**Solution:**
1. **Check backend is running:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **Check API URL in frontend services:**
   - Open `frontend/src/app/services/auth.service.ts`
   - Verify `apiUrl = 'http://localhost:3000/api'`

3. **Check CORS in backend:**
   - Verify `backend/src/server.ts` has `app.use(cors());`

---

### Error: "TypeError: Cannot read property 'X' of undefined"

**Cause:** Data not loaded or API error

**Solution:**
1. **Check browser console (F12)** for detailed error
2. **Check Network tab** to see if API calls are failing
3. **Verify backend is running** and returning data

---

## Database Errors

### Error: "Access denied for user 'root'@'localhost'"

**Cause:** Wrong MySQL password in `.env`

**Solution:**
1. **Update `.env` file:**
   ```env
   DB_PASSWORD=your_actual_mysql_password
   ```

2. **Test MySQL connection:**
   ```bash
   mysql -u root -p
   # Enter password
   ```

---

### Error: "Table 'users' doesn't exist"

**Cause:** Database not initialized

**Solution:**
```bash
mysql -u root -p
source backend/src/config/db-init.sql
```

---

## General Issues

### Error: "npm ERR! code ENOENT"

**Cause:** File or directory not found

**Solution:**
- Ensure you're in the correct directory
- Check that `package.json` exists in the current directory
- Reinstall dependencies: `rm -rf node_modules && npm install`

---

### Error: "npm ERR! network"

**Cause:** Network connectivity issue

**Solution:**
- Check internet connection
- Try: `npm install --registry https://registry.npmjs.org/`
- Clear npm cache: `npm cache clean --force`

---

### Error: "Permission denied"

**Cause:** Insufficient permissions (macOS/Linux)

**Solution:**
```bash
# For global packages
sudo npm install -g @angular/cli

# OR fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

---

## Step-by-Step Debugging

If you're still stuck, follow these steps:

### Step 1: Verify Prerequisites
```bash
node --version    # Should be v18+
npm --version     # Should be v6+
mysql --version   # Should be v8+
```

### Step 2: Check Directory Structure
```bash
# Should see these directories:
ls backend/src/
ls frontend/src/app/
```

### Step 3: Verify Dependencies
```bash
# Backend
cd backend
npm list --depth=0  # Check if all packages installed

# Frontend  
cd ../frontend
npm list --depth=0  # Check if all packages installed
```

### Step 4: Check Configuration Files
```bash
# Backend .env exists?
ls backend/.env

# Backend tsconfig exists?
ls backend/tsconfig.json

# Frontend angular.json exists?
ls frontend/angular.json
```

### Step 5: Test Backend Alone
```bash
cd backend
npm run dev
# Should see: "Server is running on port 3000"
# Press Ctrl+C to stop
```

### Step 6: Test Database Connection
```bash
mysql -u root -p
USE smart_fitness;
SHOW TABLES;
# Should see: users, workout_meal_plans
```

---

## Need More Help?

Please share:
1. **Complete error message** (copy/paste from terminal)
2. **Which command** you ran
3. **Operating System** (Windows/macOS/Linux)
4. **Node version** (`node --version`)
5. **What step** you're on (backend setup, frontend setup, etc.)

---

## Quick Fixes Checklist

- [ ] Dependencies installed? (`npm install` in both backend and frontend)
- [ ] `.env` file exists in backend with correct MySQL password?
- [ ] MySQL service is running?
- [ ] Database `smart_fitness` exists?
- [ ] Backend runs without errors? (`npm run dev` in backend)
- [ ] Frontend dependencies installed? (`npm install` in frontend)
- [ ] Angular CLI installed? (`npm install -g @angular/cli`)
- [ ] Ports 3000 and 4200 are free?

