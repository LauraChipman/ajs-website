const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import Navbar from '../components/Navbar';
import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import axios from "axios";
import Head from 'next/head';

export default function AboutPage() {
    const [aboutContent, setAboutContent] = useState('');

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/about`);
                if (res.data?.content) {
                    setAboutContent(res.data.content); // Updated to expect a single object
                }
            } catch (err) {
                console.error('❌ Error fetching About content:', err);
            }
        };
        fetchAbout();
    }, []);

    return (
        <>
        <Head>
            <title>About Us | AJ's Bar & Music Hall</title>
        </Head>
        <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-900 via-fuchsia-800 to-fuchsia-700 text-white p-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="container mx-auto">
                    <h1 className="text-5xl font-neon text-green-500 mb-8">About Us</h1>
                    {aboutContent ? (
                        <p className="text-gray-300 text-lg whitespace-pre-line">
                            {aboutContent}
                        </p>
                    ) : (
                        <p className="text-gray-500 italic">Content is coming soon.</p>
                    )}
                </div>

                <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
                    <h1 className="text-xl text-yellow-400 mb-4">Located at</h1>
                    <p className="text-white mb-2">143 Christina St N, Sarnia, ON N7T 5T8</p>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2919.297016786552!2d-82.41021852438053!3d42.9720165962216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88259d2237469fc3%3A0xe9dd041ea025c659!2sAJS%20Bar%20%26%20Music%20Hall!5e0!3m2!1sen!2sca!4v1747188428506!5m2!1sen!2sca"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </div>
        </>
    );
}
