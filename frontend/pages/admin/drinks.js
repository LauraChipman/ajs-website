const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import axios from 'axios';
import Head from "next/head";

export default function AdminDrinksPage() {
    const [formData, setFormData] = useState({ name: '', description: '', price: '', alcoholic: false });
    const [imageFile, setImageFile] = useState(null);
    const [drinks, setDrinks] = useState([]);
    const [message, setMessage] = useState('');
    const [editingId, setEditingId] = useState(null);

    const fetchDrinks = async () => {
        const res = await axios.get('${API_BASE}/api/drinks');
        setDrinks(res.data);
    };

    useEffect(() => { fetchDrinks(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                // Update logic (no image update in this route)
                await axios.put(`${API_BASE}/api/drinks/${editingId}`, {
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    alcoholic: formData.alcoholic,
                });
                setMessage('✅ Drink updated!');
            } else {
                const form = new FormData();
                form.append('name', formData.name);
                form.append('description', formData.description);
                form.append('price', formData.price);
                form.append('alcoholic', formData.alcoholic);
                if (imageFile) form.append('file', imageFile);

                await axios.post('${API_BASE}/api/drinks/upload', form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setMessage('✅ Drink added!');
            }

            setFormData({ name: '', description: '', price: '', alcoholic: false });
            setImageFile(null);
            setEditingId(null);
            fetchDrinks();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error("❌ Upload error:", err);
            setMessage('❌ Something went wrong.');
        }
    };

    const handleEdit = (drink) => {
        setFormData({
            name: drink.name,
            description: drink.description,
            price: drink.price,
            alcoholic: drink.alcoholic
        });
        setEditingId(drink._id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`${API_BASE}/api/drinks/${id}`);
        fetchDrinks();
    };

    const getImageUrl = (imageId) => {
        return `${API_BASE}/api/image/${imageId}`;
    };

    return (
        <>
            <Head>
                <title>Manage Drinks | AJ's Bar & Music Hall</title>
            </Head>
        <div className="flex">
            <AdminSidebar />
            <div className="ml-64 pb-20 p-8 w-full bg-slate-800 min-h-screen text-white">
                <h1 className="text-3xl text-yellow-400 mb-6 font-neon">Manage Drinks</h1>

                {message && <p className="mb-4 text-green-400 font-semibold">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4 bg-slate-700 p-6 rounded shadow mb-10">
                    <h1 className="text-green-400 text-xl mb-4">{editingId ? 'Edit Drink' : 'Add Drink'}</h1>

                    <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-2 rounded bg-slate-900 text-white"
                        required
                    />

                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-2 rounded bg-slate-900 text-white"
                        required
                    />

                    <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full p-2 rounded bg-slate-900 text-white"
                        required
                    />

                    <label className="block text-sm">
                        <input
                            type="checkbox"
                            checked={formData.alcoholic}
                            onChange={(e) => setFormData({ ...formData, alcoholic: e.target.checked })}
                            className="mr-2"
                        />
                        Alcoholic
                    </label>

                    <div className="w-full">
                        <label className="block mb-1 font-neon text-xl">Upload Drink Image</label>
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

                    <button type="submit" className="bg-green-500 px-4 font-neon py-2 rounded text-black">
                        {editingId ? 'Update' : 'Add'} Drink
                    </button>
                </form>

                <h2 className="text-2xl mb-4">Current Drinks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drinks.map((drink) => (
                        <div key={drink._id} className="bg-slate-700 p-4 rounded shadow">
                            <h3 className="text-xl text-pink-400">{drink.name}</h3>
                            <p>{drink.description}</p>
                            <img
                                src={getImageUrl(drink.imageId)}
                                alt={drink.name}
                                className="w-full h-40 object-cover rounded mb-2"
                            />
                            <p className="font-bold text-green-400">${drink.price}</p>
                            <p className="text-sm text-slate-400">{drink.alcoholic ? 'Alcoholic' : 'Non-Alcoholic'}</p>

                            <div className="mt-2 space-x-4">
                                <button onClick={() => handleEdit(drink)} className="text-blue-400 font-neon hover:underline">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(drink._id)} className="text-red-400 font-neon hover:underline">
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
