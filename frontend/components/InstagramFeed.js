import React, { useEffect, useState } from 'react';

const InstagramFeed = () => {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        // Placeholder fetch - this will be replaced with Instagram API
        fetch('/api/instagram')
            .then(response => response.json())
            .then(data => setPhotos(data))
            .catch(error => console.error('Error fetching Instagram photos:', error));
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
