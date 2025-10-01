const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from "next/head"; // ✅ Import Link

export default function EventsPage() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE}/api/events`)
            .then((response) => response.json())
            .then((data) => {
                setEvents(data);
            })
            .catch((err) => console.error("Error fetching events:", err));
    }, []);

    const getImageUrl = (imageId) => {
        if (imageId) {
            return `${API_BASE}/api/image/${imageId}`;
        }
        return 'https://via.placeholder.com/600x400?text=No+Image+Available';
    };

    return (
        <>
            <Head>
                <title>Events | AJ's Bar & Music Hall</title>
            </Head>
        <div className="pt-20 pb-20 min-h-screen bg-gradient-to-br from-slate-900 via-fuchsia-800 to-fuchsia-700 text-white p-8">
            <h1 className="text-5xl mb-6 text-green-500 font-neon">Upcoming Events</h1>

            {events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <Link key={event._id} href={`/events/${event._id}`}>
                            <div className="cursor-pointer bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 shadow-md p-4 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                <h1 className="text-xl font-neon text-pink-500">{event.title}</h1>
                                <img
                                    src={getImageUrl(event.imageId)}
                                    alt={event.title}
                                    className="w-full h-48 object-cover rounded mt-2"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://dummyimage.com/600x400/000/fff&text=Image+Not+Found';
                                    }}
                                />
                                <div className="mt-4">
                                    <p className="text-gray-400">
                                        {event.date ? new Date(event.date).toLocaleDateString() : "No Date"} at {event.time}
                                    </p>
                                    <p className="mt-2 text-white">{event.description}</p>
                                    <p className="text-green-400 font-bold mt-2">${event.price}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-gray-300">No events found. Check back soon!</p>
            )}
        </div>
        </>
    );
}
