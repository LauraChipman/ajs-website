const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/public/logo.png';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

const HeroSection = () => {
    const [galleryPreview, setGalleryPreview] = useState(null);
    const [drinkPreview, setDrinkPreview] = useState(null);
    const [eventPreview, setEventPreview] = useState(null);

    useEffect(() => {
        const fetchPreviews = async () => {
            try {
                const [galleryRes, drinkRes, eventRes] = await Promise.all([
                    axios.get('${API_BASE}/api/gallery'),
                    axios.get('${API_BASE}/api/drinks'),
                    axios.get('${API_BASE}/api/events')
                ]);

                if (galleryRes.data.length > 0) setGalleryPreview(galleryRes.data[0]);
                if (drinkRes.data.length > 0) setDrinkPreview(drinkRes.data[0]);
                if (eventRes.data.length > 0) setEventPreview(eventRes.data[0]);
            } catch (error) {
                console.error("❌ Error fetching previews:", error);
            }
        };

        fetchPreviews();
    }, []);

    const getImageUrl = (id) => `${API_BASE}/api/image/${id}`;

    return (
        <header
            className="relative bg-gradient-to-tr from-slate-950 via-fuchsia-700 to-yellow-400 text-yellow-300 mt-6 p-4 m-4 md:m-8 rounded-lg border-8 border-slate-950 mb-16 min-h-130 pt-16"
            style={{ background: 'linear-gradient(to top right, #0f172a 40%, #a21caf 75%, #facc15 100%)' }}
        >
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                {/* Logo */}
                <div className="relative mb-6 md:mb-0">
                    <Image src={Logo} alt="AJ's Bar Music Hall" width={600} height={300} className="w-full max-w-xs md:max-w-full" />
                </div>

                {/* Circular Upcoming Event Card */}
                <Link href="/events">
                    <div className="relative hover:text-green-500 w-64 h-64 md:w-84 md:h-84 rounded-full bg-gradient-to-br from-slate-800/60 via-slate-900/60 to-black/60 backdrop-blur-md hover:scale-105 transform transition-all duration-300 border border-pink-500 hover:shadow-neon-red p-6 flex flex-col justify-center items-center text-yellow-300 mt-4 md:mt-8 md:mr-32 cursor-pointer shadow-lg">
                        <h3 className="text-xl md:text-2xl pb-5 mb-2 text-center">Upcoming Events</h3>
                        {eventPreview ? (
                            <>
                                <img
                                    src={getImageUrl(eventPreview.imageId)}
                                    alt="Event preview"
                                    className="h-20 object-cover rounded w-full mb-2"
                                />
                                <h4 className="text-sm md:text-lg font-neon">{eventPreview.title}</h4>
                                <p className="text-sm">{new Date(eventPreview.date).toLocaleDateString()}</p>
                                <p className="text-sm">{eventPreview.time}</p>
                            </>
                        ) : (
                            <p>No upcoming events</p>
                        )}
                    </div>
                </Link>

                {/* Nav Cards with Slide-up Previews */}
                <div className="relative w-full md:absolute md:bottom-[-300px] md:w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4 md:px-16">
                    {[
                        {
                            label: "Events",
                            href: "/events",
                            preview: eventPreview && (
                                <>
                                    <img src={getImageUrl(eventPreview.imageId)} className="w-full h-40 object-cover rounded mb-1" alt="event" />
                                    <p className="text-sm">{eventPreview.title}</p>
                                    <p className="text-sm">{new Date(eventPreview.date).toLocaleDateString()}</p>
                                    <p className="text-sm">{eventPreview.time}</p>
                                </>
                            ),
                            hoverStyle: "hover:shadow-neon-pink",
                            bg: "to-pink-600"
                        },
                        {
                            label: "Drinks",
                            href: "/drinks",
                            preview: drinkPreview && (
                                <>
                                    <img src={getImageUrl(drinkPreview.imageId)} className="w-full h-40 object-cover rounded mb-1" alt="drink" />
                                    <p className="text-sm">{drinkPreview.name}</p>
                                    <p className="text-sm">${drinkPreview.price}</p>
                                </>
                            ),
                            hoverStyle: "hover:shadow-neon-yellow",
                            bg: "to-slate-900"
                        },
                        {
                            label: "Gallery",
                            href: "/gallery",
                            preview: galleryPreview && (
                                <>
                                    <img src={getImageUrl(galleryPreview.imageId)} className="w-full h-50 object-cover rounded mb-1" alt="gallery" />
                                    <p className="text-sm">{galleryPreview.title}</p>
                                </>
                            ),
                            hoverStyle: "hover:shadow-neon-red",
                            bg: "to-pink-700"
                        },
                        {
                            label: "Social Media",
                            href: "/social-media",
                            preview: (
                                <div className="flex justify-center bg-transparent h-60 space-x-6 text-8xl py-6">
                                    <FontAwesomeIcon icon={faFacebook} className="hover:text-green-500 transition" />
                                    <FontAwesomeIcon icon={faInstagram} className="hover:text-pink-600 transition" />
                                </div>
                            ),
                            hoverStyle: "hover:shadow-neon-purple",
                            bg: "to-slate-900"
                        }
                    ].map(({ label, href, preview, hoverStyle, bg }) => (
                        <Link key={label} href={href}>
                            <div className={`relative group bg-gradient-to-t from-transparent ${bg} hover:bg-slate-900 hover:scale-105 ${hoverStyle} transform text-center text-yellow-400 hover:text-pink-500 font-neon text-3xl md:text-4xl p-6 rounded-lg shadow-lg transition-all duration-300 h-84 overflow-hidden`}>
                                <span className="relative z-10">{label}</span>
                                {preview && (
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-br from-slate-900 via-fuchsia-800 to-fuchsia-700 p-4 text-yellow-400 translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-in-out z-0 text-sm">
                                        {preview}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default HeroSection;
