const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import Head from "next/head";

export default function AdminSettings() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (newPassword !== confirmPassword) {
            return setMessage("❌ New passwords do not match.");
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE}/api/admin/update-credentials`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("✅ Password updated successfully.");
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setMessage(`❌ ${data.message}`);
            }
        } catch (err) {
            console.error("Update error:", err);
            setMessage("❌ Something went wrong.");
        }
    };

    return (
        <>
            <Head>
                <title>Admin Settings | AJ's Bar & Music Hall</title>
            </Head>
        <div className="flex">
            <AdminSidebar />
            <div className="flex-grow p-8 bg-gray-900 ml-64  min-h-screen">
                <h1 className="text-3xl text-green-500 mb-6">Update Password</h1>
                <form onSubmit={handleSubmit} className="max-w-md space-y-4">
                    <div>
                        <label className="block text-pink-500 font-neon mb-1">Current Password</label>
                        <input
                            type="password"
                            className="w-full p-2 rounded bg-slate-800"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-pink-500 font-neon mb-1">New Password</label>
                        <input
                            type="password"
                            className="w-full p-2 rounded bg-slate-800"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-pink-500 font-neon mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            className="w-full p-2 rounded bg-slate-800"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="bg-yellow-500 font-neon hover:bg-green-500 text-black py-2 px-4 rounded-lg transition duration-300">
                        Update Password
                    </button>
                    {message && <p className="mt-4">{message}</p>}
                </form>
            </div>
        </div>
      </>
    );
}
