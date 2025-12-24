import { admin } from '../config/firebaseConfig.js';

/**
 * Middleware to verify Firebase ID tokens
 * Expects Authorization header: Bearer <token>
 */
export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No token provided'
            });
        }

        const token = authHeader.split('Bearer ')[1];

        // Verify the token with Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Attach user info to request
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email
        };

        next();
    } catch (error) {
        console.error('❌ Token verification error:', error.code, error.message);
        return res.status(401).json({
            error: 'Unauthorized',
            message: error.code === 'auth/id-token-expired' ? 'Token expired' : 'Invalid token',
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
