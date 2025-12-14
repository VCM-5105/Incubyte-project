import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
 
const Dashboard = () => {
    const [sweets, setSweets] = useState([]);
    const [search, setSearch] = useState('');
    const { user, logout } = useAuth();
 
    useEffect(() => {
        fetchSweets();
    }, [search]);
 
    const fetchSweets = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/sweets?search=${search}`);
            setSweets(res.data);
        } catch (err) {
            console.error("Failed to fetch sweets");
        }
    };
 
    const handlePurchase = async (id) => {
        try {
            await axios.post(`http://localhost:5000/api/sweets/${id}/purchase`);
            fetchSweets(); // Refresh stock
            alert("Sweet treat purchased!");
        } catch (err) {
            alert(err.response?.data?.message || "Purchase failed");
        }
    };
 
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-pink-600 font-serif">Sweet Bliss Shop</h1>
                    <p className="text-gray-500">Welcome, {user.username}</p>
                </div>
                <div className="flex gap-4">
                    {user.role === 'admin' && (
                        <a href="/admin" className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">Inventory</a>
                    )}
                    <button onClick={logout} className="px-4 py-2 border border-pink-300 text-pink-600 rounded-lg hover:bg-pink-50">Logout</button>
                </div>
            </header>
 
            {/* Search */}
            <div className="mb-8 relative">
                <input 
                    type="text" 
                    placeholder="Search for macarons, truffles..." 
                    className="w-full p-4 pl-12 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-pink-400 bg-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-4 top-4 text-gray-400">search</span>
            </div>
 
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sweets.map(sweet => (
                    <div key={sweet.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-4 border border-pink-100 flex flex-col">
                        <div className="h-40 bg-pink-100 rounded-xl mb-4 flex items-center justify-center text-pink-300">
                             {/* Placeholder for real image */}
                            <span className="material-symbols-outlined text-6xl">bakery_dining</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-800">{sweet.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{sweet.category}</p>
                        <div className="flex justify-between items-center mt-auto">
                            <span className="font-bold text-pink-600">${sweet.price}</span>
                            <span className={`text-xs ${sweet.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {sweet.stock} left
                            </span>
                        </div>
                        <button 
                            onClick={() => handlePurchase(sweet.id)}
                            disabled={sweet.stock === 0}
                            className="mt-4 w-full py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
                        >
                            {sweet.stock === 0 ? 'Sold Out' : 'Purchase'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
 
export default Dashboard;