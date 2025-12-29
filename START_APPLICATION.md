# Starting the Application

## ✅ Both servers have been started!

### Server Status:
- **Backend API**: Starting on `http://localhost:3000`
- **Frontend App**: Starting on `http://localhost:4200`

## ⏳ Wait Time:
- **Backend**: Should be ready in 2-5 seconds
- **Frontend**: Needs 10-20 seconds to compile Angular (first time may take longer)

## 🌐 Access the Application:

1. **Open your browser** and navigate to:
   ```
   http://localhost:4200
   ```

2. You should see the **Login/Register** page

## 🔍 Verify Servers are Running:

### Check Backend:
```powershell
# Test backend health endpoint
curl http://localhost:3000/health

# Should return: {"status":"ok","message":"Smart Fitness API is running"}
```

### Check Frontend:
- Open browser: `http://localhost:4200`
- Should see the authentication page

## ⚠️ If Backend Doesn't Start:

Common issues:
1. **MySQL not running**: Start MySQL service
2. **Wrong database credentials**: Check `backend/.env` file
3. **Database doesn't exist**: Run `mysql -u root -p < backend/src/config/db-init.sql`
4. **Port 3000 in use**: Kill the process or change port in `.env`

## ⚠️ If Frontend Doesn't Start:

Common issues:
1. **Angular CLI not installed**: Run `npm install -g @angular/cli`
2. **Port 4200 in use**: Angular will prompt to use another port
3. **Compilation errors**: Check terminal for error messages

## 🛑 To Stop Servers:

Press `Ctrl+C` in each terminal window, or:

**Windows:**
```powershell
# Find and kill Node processes
Get-Process node | Stop-Process
```

---

## 📝 Quick Test Steps:

Once both servers are running:

1. **Register**: Go to http://localhost:4200 → Click "Register"
   - Email: `test@example.com`
   - Name: `Test User`
   - Password: `password123`

2. **Profile**: Fill in your profile details → Save → Regenerate Plans

3. **Workouts**: Click "Workouts" → Check exercises

4. **Meals**: Click "Meals" → Check meals

5. **Progress**: Click "Progress" → View charts

---

**Note**: Both servers are running in the background. You can check their status by testing the endpoints above.

