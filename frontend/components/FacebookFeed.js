import React, { useEffect, useState } from 'react';

const FacebookFeed = () => {
    const [posts, setPosts] = useState([]);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(`${API_BASE}/api/facebook`) // ✅ not relative
            .then((res) => res.json())
            .then((data) => setFacebookPosts(data))
            .catch((err) => console.error("Error fetching Facebook feed:", err));
    }, []);


    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl text-yellow-400 mb-4">Facebook Feed</h2>
            {posts.length > 0 ? (
                posts.map((post, index) => (
                    <div key={index} className="bg-slate-900 p-3 mb-4 rounded-md text-white">
                        <h3 className="text-xl font-bold">{post.title}</h3>
                        <p>{post.content}</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-400">No posts available.</p>
            )}
        </div>
    );
};

export {FacebookFeed};