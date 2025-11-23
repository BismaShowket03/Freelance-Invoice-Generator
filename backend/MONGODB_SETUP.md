# MongoDB Setup Guide

## Error: "Operation buffering timed out after 10000ms"

This error means MongoDB is not running or not accessible. Here are solutions:

## Option 1: Install MongoDB Locally (Recommended for Development)

### Windows:
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. MongoDB usually runs as a Windows Service automatically
4. Check if it's running:
   - Open Services (Win + R, type `services.msc`)
   - Look for "MongoDB" service
   - If not running, right-click and select "Start"

### Mac:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian):
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # Start on boot
sudo systemctl status mongod  # Check status
```

## Option 2: Use MongoDB Atlas (Cloud - Free Tier Available)

1. **Sign up for MongoDB Atlas**: https://www.mongodb.com/cloud/atlas/register

2. **Create a Free Cluster**:
   - Choose "Free" tier (M0)
   - Select a cloud provider and region
   - Click "Create Cluster"

3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)

4. **Whitelist Your IP**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your IP

5. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `freelance-invoice-generator` (or keep default)

6. **Update .env file**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/freelance-invoice-generator?retryWrites=true&w=majority
   ```

## Option 3: Use Docker (If you have Docker installed)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Verify MongoDB is Running

### Check if MongoDB is accessible:
```bash
# Windows (PowerShell)
Test-NetConnection localhost -Port 27017

# Mac/Linux
nc -zv localhost 27017
```

### Test MongoDB connection:
```bash
# If MongoDB is installed locally
mongosh
# or
mongo
```

## After Setting Up MongoDB

1. Restart your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. You should see: `✅ Connected to MongoDB`

3. Try creating a client again in the frontend

## Current Connection String

Check your `backend/.env` file:
```
MONGODB_URI=mongodb://localhost:27017/freelance-invoice-generator
```

For MongoDB Atlas, it will look like:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freelance-invoice-generator
```

