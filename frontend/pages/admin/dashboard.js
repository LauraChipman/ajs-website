const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminSidebar from "../../components/AdminSidebar";
import Head from "next/head";

export default function AdminDashboard() {
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchAdminMessage = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                console.warn("🔐 No token found. Redirecting to login.");
                router.push('/admin/login');
                return;
            }

            try {
                const res = await fetch('${API_BASE}/api/admin', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    console.warn("🔐 Token invalid or expired. Redirecting.");
                    router.push('/admin/login');
                    return;
                }

                const data = await res.json();
                setMessage(data.message || 'Welcome!');
            } catch (err) {
                console.error("❌ Failed to fetch admin message:", err);
                router.push('/admin/login');
            }
        };

        fetchAdminMessage();
    }, [router]);

    return (
        <>
            <Head>
                <title>Admin Dashboard | AJ's Bar & Music Hall</title>
            </Head>
        <div className="flex bg-gradient-to-br from-slate-900 via-fuchsia-800 to-fuchsia-700 min-h-screen text-white pb-20">
            <AdminSidebar />

            <div className="ml-64 w-full p-8">
                <h2 className="text-4xl font-neon text-green-500 mb-2">Admin Dashboard</h2>
                <p className="text-pink-200 mb-6">{message}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { title: 'Manage Events', href: '/admin/events', color: 'hover:shadow-neon-red' },
                        { title: 'Manage Gallery', href: '/admin/gallery', color: 'hover:shadow-neon-purple' },
                        { title: 'Manage About Page', href: '/admin/about', color: 'hover:shadow-neon-green' },
                        { title: 'Manage Drinks', href: '/admin/drinks', color: 'hover:shadow-neon-yellow' },
                    ].map(({ title, href, color }) => (
                        <Link key={title} href={href}>
                            <div className={`cursor-pointer bg-slate-800 hover:bg-slate-900 ${color} transition-all duration-300 transform hover:scale-105 rounded-lg p-6 shadow-lg border-2 border-pink-500`}>
                                <h3 className="text-xl text-pink-400 mb-2">{title}</h3>
                                <p className="text-sm text-gray-300">Click to create, edit, or delete {title.toLowerCase()}.</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        router.push('/admin/login');
                    }}
                    className="px-4 py-2 bg-red-500 text-white font-neon rounded shadow-md hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
        </div>
      </>
    );
}
