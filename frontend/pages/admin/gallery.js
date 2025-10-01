const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import axios from 'axios';
import Head from "next/head";

export default function AdminGalleryPage() {
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [imageFile, setImageFile] = useState(null);
    const [galleryItems, setGalleryItems] = useState([]);
    const [message, setMessage] = useState('');
    const [editingId, setEditingId] = useState(null);

    const fetchGallery = async () => {
        const res = await axios.get(`${API_BASE}/api/gallery`);
        setGalleryItems(res.data);
    };

    useEffect(() => { fetchGallery(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const form = new FormData();
            form.append('title', formData.title);
            form.append('description', formData.description);
            if (imageFile) form.append('file', imageFile);

            if (editingId) {
                await axios.put(`${API_BASE}/api/gallery/${editingId}`, form);
                setMessage('✅ Gallery item updated!');
            } else {
                await axios.post(`${API_BASE}/api/gallery/uploa`, form);
                setMessage('✅ Gallery item added!');
            }

            fetchGallery();
            setFormData({ title: '', description: '' });
            setImageFile(null);
            setEditingId(null);
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error("❌ Upload error:", err);
            setMessage('❌ Something went wrong.');
        }
    };

    const handleEdit = (item) => {
        setFormData({ title: item.title, description: item.description });
        setEditingId(item._id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`${API_BASE}/api/gallery/${id}`);
        fetchGallery();
    };

    const getImageUrl = (imageId) => {
        return `${API_BASE}/api/image/${imageId}`;
    };

    return (
        <>
            <Head>
                <title>Manage Gallery | AJ's Bar & Music Hall</title>
            </Head>
        <div className="flex">
            <AdminSidebar />
            <div className="ml-64 pb-20 p-8 w-full bg-slate-800 min-h-screen text-white">
                <h1 className="text-3xl text-yellow-400 mb-6 font-neon">Manage Gallery</h1>

                {message && <p className="mb-4 text-green-400 font-semibold">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4 bg-slate-700 p-6 rounded shadow mb-10">
                    <h1 className="text-green-400 text-xl mb-4">
                        {editingId ? 'Edit Gallery Item' : 'Add Gallery Item'}
                    </h1>

                    <input
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full p-2 rounded bg-slate-900"
                        required
                    />

                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-2 rounded bg-slate-900"
                        required
                    />

                    <div className="w-full">
                        <label className="block mb-1 font-neon text-xl">Upload Gallery Image</label>
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

                    <button type="submit" className="bg-green-500 px-4 mt-8 font-neon py-2 rounded text-black">
                        {editingId ? 'Update' : 'Add'} Gallery Item
                    </button>
                </form>

                <h2 className="text-2xl mb-4">Current Gallery Items</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryItems.map((item) => (
                        <div key={item._id} className="bg-slate-700 p-4 rounded shadow">
                            <h3 className="text-xl text-pink-400">{item.title}</h3>
                            <p className="text-gray-300">{item.description}</p>
                            <img
                                src={getImageUrl(item.imageId)}
                                alt={item.title}
                                className="w-full h-40 object-cover rounded my-2"
                            />
                            <div className="mt-2 space-x-4">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="text-blue-400 font-neon hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
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
