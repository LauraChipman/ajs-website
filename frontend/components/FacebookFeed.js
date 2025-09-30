import React, { useEffect, useState } from 'react';

const FacebookFeed = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Placeholder fetch - this will be replaced with Facebook Graph API
        fetch('/api/facebook')
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error fetching Facebook posts:', error));
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