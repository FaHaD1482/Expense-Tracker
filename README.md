# Personal Finance Tracker

A full-stack personal finance dashboard built with React, Express.js, and Firebase. Track your income and expenses with beautiful charts and real-time data synchronization.

## Architecture

This is a **monorepo** project with two main folders:

- **`/client`** - React frontend (Vite + Tailwind CSS)
- **`/server`** - Express.js backend (Node.js + Firebase Admin)

## Features

- **User Authentication** - Email/Password authentication with Firebase
- **Visual Dashboard** - Beautiful pie charts showing expense breakdown
- **Transaction Management** - Add, view, and delete income/expense transactions
- **Modern UI** - Clean, responsive design with Tailwind CSS
- **Real-time Database** - Cloud Firestore for data persistence
- **Secure API** - Token-based authentication with Firebase Admin SDK

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Firebase project (see setup below)

### Project Setup Guide

### Firebase Setup

Before running the application, you need to set up Firebase:

#### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable **Firestore Database**
4. Enable **Authentication**

#### 2. Get Firebase Configuration for Frontend

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "Finance Tracker Web")
5. Copy the `firebaseConfig` object values

**Create a `.env` file in the `client` folder:**
```bash
cd client
cp .env.example .env
```

**Edit `client/.env` and add your Firebase configuration:**
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_API_BASE_URL=http://127.0.0.1:5000/api
```

⚠️ **IMPORTANT:** The `.env` file is already in `.gitignore` and will not be committed to version control.

#### 3. Get Firebase Admin SDK for Backend

1. In Firebase Console, go to **Project Settings** → **Service Accounts**
2. Click "Generate new private key"
3. Download the JSON file
4. **Rename it to `serviceAccountKey.json`**
5. **Move it to:** `server/src/config/serviceAccountKey.json`

⚠️ **IMPORTANT:** Never commit this file to version control! It's already in `.gitignore`.

#### 4. Set Up Server Environment Variables

The server already has a `.env` file configured. If needed, you can modify:

```bash
cd server
# Edit .env file
```

Default configuration:
```env
PORT=5000
FIREBASE_SERVICE_ACCOUNT_PATH=./src/config/serviceAccountKey.json
```

### Installation

#### Backend Setup

```bash
cd server
npm install
npm run dev
```

The server will start on `http://localhost:5000`

#### Frontend Setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The client will start on `http://localhost:3000`

## Deployment

Ready to deploy your app? Check out the comprehensive deployment guide:

**[DEPLOYMENT.md](./DEPLOYMENT.md)** - Step-by-step guide for deploying to:
- **Vercel** (Frontend) - Free tier with excellent performance
- **Render** (Backend) - Free tier with always-on capability

Both platforms offer free hosting and will keep your app running 24/7!

## Project Structure

```
Expense Tracker/
├── client/                          
│   ├── src/
│   │   ├── config/
│   │   │   └── firebaseConfig.js    
│   │   ├── pages/
│   │   │   ├── Login.jsx            
│   │   │   ├── Dashboard.jsx       
│   │   │   └── AddTransaction.jsx  
│   │   ├── services/
│   │   │   └── api.js           
│   │   ├── App.jsx                  
│   │   ├── main.jsx       
│   │   └── index.css        
│   ├── .env                        
│   ├── .env.example                 
│   ├── package.json
│   ├── tailwind.config.js
│   └── vercel.json                  
│
├── server/                         
│   ├── src/
│   │   ├── config/
│   │   │   ├── firebaseConfig.js    
│   │   │   └── serviceAccountKey.json  
│   │   ├── middleware/
│   │   │   └── authMiddleware.js    
│   │   ├── routes/
│   │   │   └── transactions.js      
│   │   └── app.js                   
│   ├── package.json
│   └── .env                         
│
├── render.yaml                     
├── DEPLOYMENT.md                   
└── README.md
```

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all user transactions |
| POST | `/api/transactions` | Add new transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |

### Request Examples

**Add Transaction:**
```json
POST /api/transactions
{
  "amount": 50.00,
  "description": "Grocery shopping",
  "type": "expense",
  "category": "Food"
}
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "id": "abc123",
    "amount": 50.00,
    "description": "Grocery shopping",
    "type": "expense",
    "category": "Food",
    "userId": "user123",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Recharts** - Charts and visualizations
- **Axios** - HTTP client
- **Firebase Web SDK** - Authentication

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Firebase Admin SDK** - Database and auth
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## Security Features

- ✅ Firebase Authentication with secure token verification
- ✅ Protected API routes with middleware
- ✅ User-specific data isolation (users can only access their own transactions)
- ✅ Environment variables for sensitive data
- ✅ Service account key excluded from version control