const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
import Navbar from '../components/Navbar';
import React, { useEffect, useState } from 'react';
import Head from "next/head";

export default function DrinksPage() {
    const [drinks, setDrinks] = useState([]);

    // 🔄 Fetch Drinks from Backend
    useEffect(() => {
        fetch(`${API_BASE}/api/drinks`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Data fetched from backend:", data); // 🔎 Check this in console
                setDrinks(data);
            })
            .catch((err) => console.error("Error fetching drinks:", err));
    }, []);

    // 🔄 Helper Function to Get Image URL
    const getImageUrl = (imageId) => {
        if (imageId) {
            return `${API_BASE}/api/image/${imageId}?collection=drinks`;
        }
        return 'https://dummyimage.com/600x400/000/fff&text=Image+Not+Found';
    };

    return (
        <>
            <Head>
                <title>Drinks | AJ's Bar & Music Hall</title>
            </Head>
        <div className="pt-20 p-8 min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
            <div className="container mx-auto">
                <h1 className="text-5xl font-neon text-yellow-500 mb-8">Drinks</h1>

                {drinks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {drinks.map((drink) => {
                            console.log("Image URL for drink:", getImageUrl(drink.imageId));

                            return (
                                <div
                                    key={drink._id}
                                    className="bg-gradient-to-br from-slate-900 via-fuchsia-800 to-fuchsia-700 text-white shadow-md p-4 rounded-lg hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform"
                                >
                                    <img
                                        src={getImageUrl(drink.imageId)}
                                        alt={drink.title}
                                        className="w-full h-48 object-cover rounded"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://dummyimage.com/600x400/000/fff&text=Image+Not+Found';
                                        }}
                                    />

                                    <div className="mt-4">
                                        <h2 className="text-xl font-neon text-yellow-500">{drink.name}</h2>
                                        <p className="text-gray-400">
                                            {drink.price ? `$${drink.price}` : "Price Not Available"}
                                        </p>
                                        <p className="mt-2 text-gray-300">{drink.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500">No drinks found. Check back soon!</p>
                )}
            </div>
        </div>
      </>
    );
}
