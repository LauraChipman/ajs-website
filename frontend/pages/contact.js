const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import React, { useState } from 'react';
import Footer from "@/components/Footer";
import Head from "next/head";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API_BASE}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                alert('✅ Message sent successfully!');
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                alert(`❌ Failed to send: ${data.message}`);
            }
        } catch (err) {
            console.error("❌ Error submitting form:", err);
            alert('Something went wrong. Please try again later.');
        }
    };

    return (
        <>
            <Head>
                <title>Contact Us | AJ's Bar & Music Hall</title>
            </Head>
        <div className="min-h-screen pt-20 pb-20 bg-gradient-to-br from-slate-900 via-fuchsia-800 to-fuchsia-700 text-white p-8">
            <h1 className="text-4xl text-yellow-400 mb-6 font-neon">Contact Us</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-lg shadow-lg">
                    <div className="mb-4">
                        <label className="block text-white font-neon mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-slate-900 text-white"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-white font-neon mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-slate-900 text-white"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-neon text-white mb-2">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-slate-900 text-white"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-neon text-white mb-2">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-slate-900 text-white h-32"
                            required
                        />
                    </div>

                    <button type="submit" className="bg-yellow-500 hover:bg-green-500 font-neon text-black py-2 px-4 rounded-lg transition duration-300">
                        Send Message
                    </button>
                </form>

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
};

export default ContactPage;
