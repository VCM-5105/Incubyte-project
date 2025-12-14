import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
 
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate('/');
        } else {
            alert('Invalid credentials');
        }
    };
 
    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-200">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/50">
                <div className="text-center mb-6">
                    <span className="material-symbols-outlined text-5xl text-pink-500 mb-2">cake</span>
                    <h2 className="text-2xl font-bold text-gray-800">Sweet Shop Login</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full py-3 bg-pink-500 text-white rounded-lg font-bold shadow-lg hover:bg-pink-600 transition transform active:scale-95">
                        Sign In
                    </button>
                </form>
                <div className="mt-6 text-center text-xs text-gray-500">
                    <p>Demo Accounts:</p>
                    <p>Admin: admin / admin</p>
                    <p>User: user / user</p>
                </div>
            </div>
        </div>
    );
};
 
export default Login;