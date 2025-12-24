import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { transactionAPI } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Only fetch when user is available or auth has initialized
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchTransactions();
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data = await transactionAPI.getTransactions();
            setTransactions(data.transactions || []);
        } catch (err) {
            setError('Failed to load transactions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) {
            return;
        }

        try {
            await transactionAPI.deleteTransaction(id);
            setTransactions(transactions.filter(t => t.id !== id));
        } catch (err) {
            alert('Failed to delete transaction');
            console.error(err);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    // Calculate totals
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // Prepare chart data - group expenses by category
    const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            const category = t.category || 'Other';
            acc[category] = (acc[category] || 0) + t.amount;
            return acc;
        }, {});

    const chartData = Object.entries(expensesByCategory).map(([name, value]) => ({
        name,
        value
    }));

    const COLORS = ['#ff7f0fff', '#8b5cf6', '#f82424ff', '#f59e0b', '#10b981', '#d53df7ff'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-white-100 via-blue-50 to-blue-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/add')}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                        >
                            + Add Transaction
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <p className="text-gray-600 text-sm font-medium mb-2">Total Balance</p>
                        <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${balance.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <p className="text-gray-600 text-sm font-medium mb-2">Total Income</p>
                        <p className="text-3xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <p className="text-gray-600 text-sm font-medium mb-2">Total Expenses</p>
                        <p className="text-3xl font-bold text-red-600">${totalExpense.toFixed(2)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pie Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Expenses by Category</h2>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-500 text-center py-12">No expense data yet</p>
                        )}
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
                        {loading ? (
                            <p className="text-gray-500 text-center py-12">Loading...</p>
                        ) : error ? (
                            <p className="text-red-500 text-center py-12">{error}</p>
                        ) : transactions.length === 0 ? (
                            <p className="text-gray-500 text-center py-12">No transactions yet</p>
                        ) : (
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {transactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800">{transaction.description}</p>
                                            <p className="text-sm text-gray-500">{transaction.category}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p
                                                className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                                    }`}
                                            >
                                                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                            </p>
                                            <button
                                                onClick={() => handleDelete(transaction.id)}
                                                className="text-red-500 hover:text-red-700 font-medium text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
