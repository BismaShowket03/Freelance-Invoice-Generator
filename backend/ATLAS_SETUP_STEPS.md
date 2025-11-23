# MongoDB Atlas Setup (Free) - Step by Step

## Step 1: Sign Up
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google account
3. Verify your email

## Step 2: Create Free Cluster
1. Click "Build a Database"
2. Choose **FREE** (M0) tier
3. Select a cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region closest to you
5. Click "Create" (takes 3-5 minutes)

## Step 3: Create Database User
1. Choose "Username and Password" authentication
2. Create a username (e.g., `admin`)
3. Create a password (SAVE THIS - you'll need it!)
4. Click "Create Database User"

## Step 4: Whitelist Your IP
1. Click "Add My Current IP Address" (for development)
   - OR click "Allow Access from Anywhere" (0.0.0.0/0) for easier setup
2. Click "Finish and Close"

## Step 5: Get Connection String
1. Click "Connect" button on your cluster
2. Choose "Connect your application"
3. Select "Node.js" and version "5.5 or later"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Your .env File
1. Open `backend/.env`
2. Replace the connection string:
   ```
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/freelance-invoice-generator?retryWrites=true&w=majority
   ```
   - Replace `YOUR_USERNAME` with your database username
   - Replace `YOUR_PASSWORD` with your database password
   - Replace `cluster0.xxxxx` with your actual cluster address
   - Keep `/freelance-invoice-generator` at the end (this is your database name)

## Step 7: Restart Backend
```bash
cd backend
npm run dev
```

You should see: `✅ Connected to MongoDB`

## Step 8: Test It!
Go to your frontend and try creating a client again.

