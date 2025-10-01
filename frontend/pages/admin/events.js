const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import axios from 'axios';
import Head from "next/head";

export default function AdminEventsPage() {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        price: '',
        ticketsAvailable: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');

    const fetchEvents = async () => {
        const res = await axios.get(`${API_BASE}/api/events`);
        setEvents(res.data);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const form = new FormData();
            form.append('title', formData.title);
            form.append('description', formData.description);
            form.append('date', formData.date);
            form.append('time', formData.time);
            form.append('price', formData.price);
            form.append('ticketsAvailable', formData.ticketsAvailable);

            if (imageFile) {
                form.append('file', imageFile);
            }

            if (editingId) {
                await axios.put(`${API_BASE}/api/events/${editingId}`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setMessage('✅ Event updated!');
            } else {
                await axios.post(`${API_BASE}/api/events`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setMessage('✅ Event added!');
            }

            // Reset form
            setFormData({ title: '', description: '', date: '', time: '', price: '', ticketsAvailable: '' });
            setImageFile(null);
            setEditingId(null);
            fetchEvents();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('❌ Upload failed:', error);
            if (error.response) console.error("Server responded with:", error.response.data);
            setMessage('❌ Something went wrong.');
        }
    };

    const handleEdit = (event) => {
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date?.split('T')[0],
            time: event.time,
            price: event.price,
            ticketsAvailable: event.ticketsAvailable
        });
        setEditingId(event._id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`${API_BASE}/api/events/${id}`);
        fetchEvents();
    };
    const getImageUrl = (imageId) => {
        return `${API_BASE}/api/image/${imageId}`;
    };


    return (
        <>
            <Head>
                <title>Manage Events | AJ's Bar & Music Hall</title>
            </Head>
        <div className="flex">
            <AdminSidebar />
            <div className="ml-64 pb-20 p-8 w-full bg-slate-800 min-h-screen text-white">
                <h1 className="text-3xl text-yellow-400 mb-6 font-neon">Manage Events</h1>

                {message && <p className="mb-4 text-green-400 font-semibold">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4 bg-slate-700 p-6 rounded shadow mb-10">
                    <h1 className="text-green-400 text-xl mb-4">
                        {editingId ? 'Edit Event' : 'Add Event'}
                    </h1>

                    <input
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full p-2 rounded bg-slate-900"
                        required
                    />

                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full p-2 rounded bg-slate-900"
                        required
                    />

                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        min="2024-01-01"
                        max="2100-12-31"
                        className="w-full p-2 rounded bg-slate-900 text-white"
                        required
                    />

                    <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        step="60" /* Enables arrow/select by minute */
                        className="w-full p-2 rounded bg-slate-900 text-white"
                        required
                    />

                    <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full p-2 rounded bg-slate-900 text-white"
                        required
                    />

                    <div className="w-full">
                        <label className="block mb-1 font-neon text-xl ">Upload Event Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4
                                       file:rounded-full file:border-0 file:text-sm file:font-semibold
                                       file:bg-violet-50 file:text-violet-700
                                       hover:file:bg-violet-100"
                        />
                    </div>

                    <button type="submit" className="bg-green-500 px-4 font-neon py-2 rounded text-black ">
                        {editingId ? 'Update' : 'Add'} Event
                    </button>
                </form>

                <h2 className="text-2xl mb-4">Current Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event._id} className="bg-slate-700 p-4 rounded shadow">
                            <h3 className="text-xl text-pink-400 ">{event.title}</h3>
                            <p>{event.description}</p>
                            <img
                                src={getImageUrl(event.imageId)}                                alt={event.title}
                                className="w-full h-40 object-cover rounded mb-2"
                            />
                            <p>{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                            <p className="font-bold text-green-400">${event.price}</p>
                            <p className="text-sm text-slate-400">{event.ticketsAvailable} tickets</p>

                            <div className="mt-2 space-x-4">
                                <button
                                    onClick={() => handleEdit(event)}
                                    className="text-blue-400 font-neon hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(event._id)}
                                    className="text-red-400 font-neon hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
       </>
    );
}
