const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import axios from 'axios';
import Head from "next/head";

export default function AdminAboutPage() {
    const [about, setAbout] = useState(null);
    const [formData, setFormData] = useState('');
    const [newContent, setNewContent] = useState('');
    const [editing, setEditing] = useState(false);
    const [deletedAbout, setDeletedAbout] = useState(null);
    const [message, setMessage] = useState('');

    const fetchAbout = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/about`);
            setAbout(res.data);
            setFormData(res.data.content);
        } catch (error) {
            console.error('❌ Error fetching about:', error.message);
        }
    };

    useEffect(() => {
        fetchAbout();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${API_BASE}/api/about/${about._id}`, {
                content: formData,
            });
            setMessage('✅ About updated!');
            setAbout(res.data);
            setEditing(false);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('❌ Error updating about:', error.message);
            setMessage('❌ Something went wrong.');
        }
    };

    const handleDelete = async () => {
        try {
            setDeletedAbout(about); // Save for undo
            await axios.delete(`${API_BASE}/api/about/${about._id}`);
            setAbout(null);
            setFormData('');
            setMessage('✅ About section deleted. You can undo this below.');
            setTimeout(() => setMessage(''), 4000);
        } catch (error) {
            console.error('❌ Error deleting about:', error.message);
            setMessage('❌ Could not delete.');
        }
    };

    const handleUndoDelete = async () => {
        if (!deletedAbout) return;
        try {
            const res = await axios.post(`${API_BASE}/api/about`, {
                content: deletedAbout.content,
            });
            setAbout(res.data);
            setDeletedAbout(null);
            setMessage('✅ Undo successful!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('❌ Error restoring about:', error.message);
            setMessage('❌ Could not undo delete.');
        }
    };

    const handleCreateNew = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE}/api/about`, {
                content: newContent,
            });
            setAbout(res.data);
            setNewContent('');
            setMessage('✅ New About section created!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('❌ Error creating about:', error.message);
            setMessage('❌ Could not create new section.');
        }
    };

    return (
        <>
            <Head>
                <title>Manage About Us | AJ's Bar & Music Hall</title>
            </Head>
        <div className="flex">
            <AdminSidebar />
            <div className="ml-64 p-8 w-full bg-slate-800 min-h-screen text-white">
                <h1 className="text-3xl text-yellow-400 mb-6 font-neon">Manage About Page</h1>

                <form onSubmit={handleCreateNew} className="space-y-4 bg-slate-700 p-6 rounded shadow">
                    <h2 className="text-green-500 text-xl mb-4">Create New About Section</h2>
                    <textarea
                        rows={8}
                        placeholder="Enter new about content..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="w-full p-4 rounded bg-slate-900 text-white"
                        required
                    />
                    <button type="submit" className="bg-green-500 px-4 py-2 rounded text-black font-neon">
                        Create New
                    </button>
                </form>
                {message && <p className="mb-4 text-green-400 font-semibold">{message}</p>}

                {about && !editing && (
                    <div className="bg-slate-700 p-6 rounded shadow mb-10">
                        <p className="text-gray-300 whitespace-pre-line">{about.content}</p>
                        <div className="flex gap-4 mt-4">
                            <button onClick={() => setEditing(true)}
                                    className="bg-blue-500 px-4 py-2 rounded text-black font-neon">Edit
                            </button>
                            <button onClick={handleDelete}
                                    className="bg-red-500 px-4 py-2 rounded text-black font-neon">Delete
                            </button>
                        </div>
                    </div>
                )}

                {about && editing && (
                    <form onSubmit={handleUpdate} className="space-y-4 bg-slate-700 p-6 rounded shadow mb-10">
                        <h2 className="text-green-400 text-xl mb-4">Edit About Section</h2>
                        <textarea
                            rows={8}
                            value={formData}
                            onChange={(e) => setFormData(e.target.value)}
                            className="w-full p-4 rounded bg-slate-900 text-white"
                            required
                        />
                        <div className="flex gap-4">
                            <button type="submit" className="bg-green-500 px-4 py-2 rounded text-black font-neon">Save
                            </button>
                            <button onClick={() => setEditing(false)} type="button"
                                    className="bg-gray-500 px-4 py-2 rounded font-neon">Cancel
                            </button>
                        </div>
                    </form>
                )}

                {deletedAbout && (
                    <div className="mb-10">
                        <button onClick={handleUndoDelete}
                                className="bg-yellow-500 px-4 py-2 rounded text-black font-neon">
                            Undo Delete
                        </button>
                    </div>
                )}


            </div>
        </div>
      </>
    );
}
