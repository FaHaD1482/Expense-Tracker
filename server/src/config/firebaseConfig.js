import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
let db;

const getServiceAccount = () => {
  // 1. Check environment variable path
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    try {
      return JSON.parse(readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, 'utf8'));
    } catch (e) {
      console.warn('⚠️ Could not load service account from FIREBASE_SERVICE_ACCOUNT_PATH');
    }
  }

  // 2. Check multiple possible local paths
  const paths = [
    join(__dirname, 'serviceAccountKey.json'),        // Local path
    join(process.cwd(), 'serviceAccountKey.json'),    // Render project root
    join(process.cwd(), '..', 'serviceAccountKey.json') // Fallback
  ];

  for (const path of paths) {
    try {
      if (existsSync(path)) {
        console.log(`🔍 Found service account at: ${path}`);
        return JSON.parse(readFileSync(path, 'utf8'));
      }
    } catch (e) {
      // Continue to next path
    }
  }
  return null;
};

try {
  const serviceAccount = getServiceAccount();

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log(`✅ Firebase Admin initialized successfully for project: ${serviceAccount.project_id}`);
  } else {
    throw new Error('No service account file found in any expected location.');
  }
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error.message);
  console.error('Deployment Tip: If using Render, ensure serviceAccountKey.json is added as a Secret File.');
}

export { admin, db };
