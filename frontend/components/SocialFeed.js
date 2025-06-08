import { useEffect, useState } from 'react';

export default function SocialFeed() {
    const [data, setData] = useState({ instagram: [], facebook: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/social')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("❌ Social fetch failed:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-yellow-300">Loading social feed...</p>;

    return (
        <div className="text-white">
            <h2 className="text-3xl font-neon mb-4">Social Media Feed</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Facebook */}
                <div className="bg-slate-800 p-4 rounded shadow">
                    <h3 className="text-xl mb-2 text-blue-400">Facebook</h3>
                    {data.facebook.map((post, i) => (
                        <div key={i} className="mb-4 border-b border-slate-600 pb-2">
                            <p className="text-sm text-gray-300">{post.message || 'No content'}</p>
                            <a href={post.permalink_url} target="_blank" className="text-blue-500 text-sm underline">View on Facebook</a>
                        </div>
                    ))}
                </div>

                {/* Instagram */}
                <div className="bg-slate-800 p-4 rounded shadow">
                    <h3 className="text-xl mb-2 text-pink-400">Instagram</h3>
                    {data.instagram.map((post, i) => (
                        <div key={i} className="mb-4 border-b border-slate-600 pb-2">
                            <img src={post.media_url} alt="Instagram post" className="w-full h-64 object-cover rounded mb-2" />
                            <p className="text-sm text-gray-300">{post.caption || 'No caption'}</p>
                            <a href={post.permalink} target="_blank" className="text-pink-500 text-sm underline">View on Instagram</a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
