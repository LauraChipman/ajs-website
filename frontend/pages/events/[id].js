const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function EventDetailPage() {
    const router = useRouter();
    const { id } = router.query;

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        fetch(`${API_BASE}/api/events/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Event not found');
                return res.json();
            })
            .then(data => {
                setEvent(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("❌ Error fetching event:", err);
                setLoading(false);
            });
    }, [id]);

    return (
        <div className="min-h-screen pb-20 bg-gradient-to-br from-slate-900 via-fuchsia-800 to-fuchsia-700 text-white">
            <Navbar />

            <div className="container mx-auto p-8 pt-24">
                {loading ? (
                    <p className="text-center text-gray-300">Loading event details...</p>
                ) : event ? (
                    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
                        <h1 className="text-4xl font-neon text-yellow-400 mb-4">{event.title}</h1>
                        {event.imageId && (
                            <img
                                src={`${API_BASE}/api/image/${event.imageId}`}
                                alt={event.title}
                                className="w-full max-h-[400px] object-cover rounded mb-4"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                                }}
                            />
                        )}
                        <p className="text-pink-300 mb-2">
                            {event.date ? new Date(event.date).toLocaleDateString() : 'No Date'} @ {event.time}
                        </p>
                        <p className="text-lg text-white mb-4">{event.description}</p>
                        <p className="text-green-400 font-bold text-xl">${event.price}</p>
                    </div>
                ) : (
                    <p className="text-center text-red-500">Event not found.</p>
                )}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.push('/events')}
                        className="bg-yellow-400 font-neon hover:bg-pink-600 text-slate-900 py-2 px-4 rounded transition duration-300"
                    >
                        ← Back to Events
                    </button>
                </div>
            </div>

        </div>
    );
}