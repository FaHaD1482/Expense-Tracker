import express from 'express';
import { db } from '../config/firebaseConfig.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * GET /api/transactions
 * Fetch all transactions for a user
 */
router.get('/', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;

        const transactionsRef = db.collection('transactions');
        const snapshot = await transactionsRef
            .where('userId', '==', uid)
            .get();

        const transactions = [];
        snapshot.forEach(doc => {
            transactions.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Sort by createdAt in JavaScript instead of Firestore
        transactions.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.json({ success: true, transactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({
            error: 'Failed to fetch transactions',
            message: error.message
        });
    }
});

/**
 * POST /api/transactions
 * Add a new transaction
 */
router.post('/', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;
        const { amount, description, type, category } = req.body;

        // Validation
        if (!amount || !description || !type) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Amount, description, and type are required'
            });
        }

        if (!['income', 'expense'].includes(type.toLowerCase())) {
            return res.status(400).json({
                error: 'Invalid type',
                message: 'Type must be either "income" or "expense"'
            });
        }

        const transaction = {
            userId: uid,
            amount: parseFloat(amount),
            description,
            type: type.toLowerCase(),
            category: category || 'Other',
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('transactions').add(transaction);

        res.status(201).json({
            success: true,
            transaction: { id: docRef.id, ...transaction }
        });
    } catch (error) {
        console.error('Error adding transaction:', error);
        res.status(500).json({
            error: 'Failed to add transaction',
            message: error.message
        });
    }
});

/**
 * DELETE /api/transactions/:id
 * Delete a transaction
 */
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;
        const { id } = req.params;

        const docRef = db.collection('transactions').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({
                error: 'Transaction not found'
            });
        }

        // Verify ownership
        if (doc.data().userId !== uid) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only delete your own transactions'
            });
        }

        await docRef.delete();

        res.json({
            success: true,
            message: 'Transaction deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({
            error: 'Failed to delete transaction',
            message: error.message
        });
    }
});

export default router;
