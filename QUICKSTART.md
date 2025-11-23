# Quick Start Guide

## Prerequisites

Make sure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas account)

## Step-by-Step Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Backend Environment

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set your MongoDB connection string:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/freelance-invoice-generator
NODE_ENV=development
```

**For MongoDB Atlas**, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freelance-invoice-generator
```

### 3. Start Backend Server

```bash
cd backend
npm run dev
```

The backend should now be running on `http://localhost:5000`

### 4. Install Frontend Dependencies

Open a new terminal and navigate to the project root:

```bash
npm install
```

### 5. Start Frontend Development Server

```bash
npm run dev
```

The frontend should now be running on `http://localhost:3000`

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## First Steps

1. **Add a Client**: 
   - Click on "Clients" in the sidebar
   - Click "Add New Client"
   - Fill in the client details and save

2. **Create an Invoice**:
   - Click on "Invoices" in the sidebar
   - Click "Create New Invoice"
   - Select a client
   - Add line items
   - Set tax and dates
   - Click "Create Invoice"

3. **View and Download Invoice**:
   - Click on an invoice to view details
   - Click "Download PDF" to generate a PDF

## Troubleshooting

### MongoDB Connection Issues

- Make sure MongoDB is running locally, or
- Verify your MongoDB Atlas connection string is correct
- Check that your IP is whitelisted in MongoDB Atlas (if using cloud)

### Port Already in Use

- Backend: Change `PORT` in `backend/.env`
- Frontend: Update `vite.config.ts` server port

### CORS Issues

- The backend is configured to allow CORS from `http://localhost:3000`
- If using a different port, update CORS settings in `backend/src/server.ts`

## Production Build

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
npm run build
```

The production build will be in the `dist` directory.

