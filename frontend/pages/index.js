const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import HeroSection from "@/components/HeroSection";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import Navbar from "@/components/Navbar";
import Head from "next/head";
import Image from 'next/image';

export default function Home() {
    const [events, setEvents] = useState([]);
    const [instagramPosts, setInstagramPosts] = useState([]);
    const [facebookPosts, setFacebookPosts] = useState([]);

    useEffect(() => {
        fetch('${API_BASE}/api/events')
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.error("Error fetching events:", err));

        fetch('${API_BASE}/api/social')
            .then(res => res.json())
            .then(data => {
                setInstagramPosts(data.instagram || []);
                setFacebookPosts(data.facebook || []);
            })
            .catch(err => console.error("Error fetching social posts:", err));
    }, []);

    const getImageUrl = (imageId) => `${API_BASE}/api/image/${imageId}`;

    return (
        <>
            <Head>
                <title>AJ's Bar & Music Hall</title>
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-fuchsia-800 to-fuchsia-700 text-white">
                <div className="h-16"></div>
                <HeroSection />

                {/* Social Media Highlights */}
                <div className="container mx-auto px-6 mt-80 ml-5 mb-12">
                    <h2 className="text-5xl font-neon text-green-500 mb-6 flex items-center gap-3">
                        <FontAwesomeIcon icon={faInstagram} /> Instagram Highlights
                    </h2>
                    <div className="overflow-x-auto whitespace-nowrap space-x-4 flex">
                        {instagramPosts.map((post, index) => (
                            <a key={index} href={post.link} target="_blank" rel="noopener noreferrer"
                               className="inline-block w-64 h-64 bg-slate-800 hover:scale-105 transition rounded-lg shadow-lg overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt="Instagram post"
                                    width={256}
                                    height={256}
                                    className="w-full h-full object-cover"
                                />
                            </a>
                        ))}
                    </div>

                    <h2 className="text-5xl font-neon text-green-500 mt-12 mb-6 flex items-center gap-3">
                        <FontAwesomeIcon icon={faFacebook} /> Facebook Highlights
                    </h2>
                    <div className="overflow-x-auto whitespace-nowrap space-x-4 flex">
                        {facebookPosts.map((post, index) => (
                            <a key={index} href={post.link} target="_blank" rel="noopener noreferrer"
                               className="inline-block w-64 h-64 bg-slate-800 hover:scale-105 transition rounded-lg shadow-lg overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt="Facebook post"
                                    width={256}
                                    height={256}
                                    className="w-full h-full object-cover"
                                />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events Section */}
                <div className="container mx-auto p-8">
                    <Link href="/events" passHref legacyBehavior>
                        <a className="text-5xl font-neon text-green-500 mb-6 hover:text-yellow-500 block w-fit">
                            Upcoming Events
                        </a>
                    </Link>

                    {events.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <Link href={`/events/${event._id}`} key={event._id} passHref legacyBehavior>
                                    <a className="block bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white shadow-md p-4 rounded-lg hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform">
                                        <Image
                                            src={getImageUrl(event.imageId)}
                                            alt={event.title}
                                            width={600}
                                            height={300}
                                            className="w-full h-48 object-cover rounded"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://dummyimage.com/600x400/000/fff&text=Image+Not+Found';
                                            }}
                                        />
                                        <div className="mt-4">
                                            <h2 className="text-xl font-neon text-pink-500">{event.title}</h2>
                                            <p className="text-gray-400">
                                                {event.date ? new Date(event.date).toLocaleDateString() : "No Date Available"} at {event.time}
                                            </p>
                                            <p className="mt-2 text-gray-300">{event.description}</p>
                                            <p className="text-green-500 font-bold mt-2">${event.price}</p>
                                        </div>
                                    </a>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No events found. Check back soon!</p>
                    )}
                </div>
            </div>
        </>
    );
}
