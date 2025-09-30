const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from "next/head";

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('${API_BASE}/api/login', {
                username,
                password
            });

            const token = response.data.token;
            console.log("✅ Login success, token:", token);

            localStorage.setItem('token', token);

            console.log("🚀 Redirecting to /admin/dashboard");
            await router.push('/admin/dashboard');
            console.log("✅ Redirect done");

        } catch (err) {
            console.error("❌ Login failed:", err.response?.data || err.message);
            const serverMsg = err.response?.data?.message || 'Login failed. Please try again.';
            setError(serverMsg);
        }
    };


    return (
        <>
            <Head>
                <title>Admin Login | AJ's Bar & Music Hall</title>
            </Head>
        <div className="flex items-center bg-gradient-to-br from-slate-900 via-fuchsia-800 to-fuchsia-700 justify-center min-h-screen bg-gray-900 text-white p-6">
            <div className="w-full max-w-md bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-green-500 mb-6 text-center font-neon">Admin Login</h2>

                {error && (
                    <p className="text-red-500 bg-red-900 p-2 mb-4 rounded text-center">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-neon mb-1">Username</label>
                        <input
                            type="text"
                            autoFocus
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-neon mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 font-neon hover:bg-yellow-600 text-black py-2 px-4 rounded-lg transition duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
       </>
    );
}
