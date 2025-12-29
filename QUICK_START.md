# Quick Start Guide

## Prerequisites Check

1. ✅ Node.js installed? Check with: `node --version` (should be v18+)
2. ✅ MySQL installed and running? Check with: `mysql --version`
3. ✅ npm installed? Check with: `npm --version`

---

## 🚀 Fast Setup (5 Minutes)

### Step 1: Setup Database (2 minutes)

```bash
# 1. Login to MySQL
mysql -u root -p

# 2. Run this in MySQL:
source backend/src/config/db-init.sql

# Or copy-paste the SQL from backend/src/config/db-init.sql
```

### Step 2: Backend Setup (1 minute)

```bash
cd backend
npm install

# Create .env file (copy this exactly, replace YOUR_PASSWORD with your MySQL password):
echo "PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=2026
DB_NAME=smart_fitness
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345" > .env

npm run dev
```

**✅ Success:** You should see "Server is running on port 3000"

### Step 3: Frontend Setup (2 minutes)

**Open a NEW terminal window** (keep backend running!)

```bash
cd frontend
npm install
npm start
```

**✅ Success:** Browser opens automatically to http://localhost:4200

---

## 🧪 Quick Test

1. **Register:** Click "Register" → Fill form → Submit
2. **Profile:** Fill in your details → Click "Save" → Click "Regenerate Plans"
3. **Workouts:** Click "Workouts" → Check some exercises
4. **Meals:** Click "Meals" → Check some meals
5. **Progress:** Click "Progress" → View charts

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Backend won't start | Check MySQL password in `.env` |
| Frontend blank page | Check backend is running on port 3000 |
| Can't connect to MySQL | Start MySQL service |
| Port already in use | Change PORT in `.env` or kill process |

---

## 📝 Full Guide

For detailed instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

