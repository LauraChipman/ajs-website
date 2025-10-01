import React, { useEffect, useState } from 'react';

const InstagramFeed = () => {
    const [photos, setPhotos] = useState([]);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(`${API_BASE}/api/instagram`) // ✅ not relative
            .then((res) => res.json())
            .then((data) => setInstagramPosts(data))
            .catch((err) => console.error("Error fetching Instagram feed:", err));
    }, []);


    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg mt-8">
            <h2 className="text-2xl text-yellow-400 mb-4">Instagram Feed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.length > 0 ? (
                    photos.map((photo, index) => (
                        <div key={index} className="overflow-hidden rounded-lg">
                            <img src={photo.imageUrl} alt={photo.caption} className="w-full h-full object-cover" />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No photos available.</p>
                )}
            </div>
        </div>
    );
};

export {InstagramFeed};
