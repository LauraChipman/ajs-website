const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import Navbar from '../components/Navbar';
import Footer from '@/components/Footer';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Head from "next/head";

export default function GalleryPage() {
    const [galleryItems, setGalleryItems] = useState([]);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await axios.get('${API_BASE}/api/gallery');
                setGalleryItems(res.data);
            } catch (err) {
                console.error('❌ Error fetching gallery:', err);
            }
        };
        fetchGallery();
    }, []);

    const getImageUrl = (imageId) => {
        return `${API_BASE}/api/image/${imageId}`;
    };

    return (
        <>
            <Head>
                <title>Gallery | AJ's Bar & Music Hall</title>
            </Head>
        <div className="pt-20 pb-20 min-h-screen bg-gradient-to-br from-slate-900 via-fuchsia-800 to-fuchsia-700 text-white p-8">
            <div className="container mx-auto">
                <h1 className="text-5xl font-neon text-green-500 mb-10">Gallery</h1>

                {galleryItems.length === 0 ? (
                    <p className="text-gray-300 text-lg">No gallery items available.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {galleryItems.map((item) => (
                            <div key={item._id} className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 p-4 rounded shadow-lg">
                                <img
                                    src={getImageUrl(item.imageId)}
                                    alt={item.title}
                                    className="w-full h-60 object-cover rounded mb-4"
                                />
                                <h2 className="text-xl text-yellow-400 font-neon mb-2">{item.title}</h2>
                                {item.description && (
                                    <p className="text-gray-300 text-sm">{item.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
       </>
    );
}
