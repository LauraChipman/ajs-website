// components/AdminSidebar.js
import Link from 'next/link';

export default function AdminSidebar() {
    return (
        <div className="w-64 h-screen fixed top-0 left-0 text-white z-50
                        bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800
                        backdrop-blur-lg bg-opacity-90 shadow-2xl border-r border-fuchsia-800 flex flex-col">

            {/* Header */}
            <div className="px-6 pt-10 mt-10 pb-6 border-b border-slate-700">
                <h2 className="text-3xl font-bold text-yellow-400 font-neon tracking-wide">Admin Panel</h2>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col mt-30 gap-6 px-6 py-8 text-lg">
                <Link href="/admin/dashboard" className="hover:text-yellow-300">Dashboard</Link>
                <Link href="/admin/events" className="hover:text-yellow-300">Events</Link>
                <Link href="/admin/gallery" className="hover:text-yellow-300">Gallery</Link>
                <Link href="/admin/about" className="hover:text-yellow-300">About</Link>
                <Link href="/admin/drinks" className="hover:text-yellow-300">Drinks</Link>
                <Link href="/admin/settings" className="hover:text-yellow-300">Settings</Link>
                <button
                    className="text-green-500 font-neon hover:text-red-600 mt-12 text-left"
                    onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/admin/login';
                    }}
                >
                    Logout
                </button>
            </nav>
        </div>
    );
}
