import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Logo from '/public/logo.png';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-transparent">
            {/* 🧱 Add precise padding to outer wrapper */}
            <div className="w-full px-[30px]">
                <div className="flex items-center justify-between h-20">
                    {/* Logo on left */}
                    <div className="flex items-center">
                        <Link href="/">
                            <Image
                                src={Logo}
                                alt="AJ's Bar & Music Hall"
                                width={140}
                                height={50}
                                className="cursor-pointer"
                            />
                        </Link>
                    </div>

                    {/* Desktop Links on right */}
                    <div className="hidden md:flex items-center space-x-6 text-4xl text-yellow-300 font-heading">
                        <Link href="/" className="hover:text-pink-500 transition">Home</Link>
                        <Link href="/events" className="hover:text-pink-500 transition">Events</Link>
                        <Link href="/gallery" className="hover:text-pink-500 transition">Gallery</Link>
                        <Link href="/drinks" className="hover:text-pink-500 transition">Drinks</Link>
                        <Link href="/about" className="hover:text-pink-500 transition">About</Link>
                    </div>

                    {/* Mobile hamburger menu icon */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-yellow-300 text-4xl focus:outline-none"
                            aria-label="Toggle Menu"
                        >
                            ☰
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-slate-950/95 text-yellow-400 font-heading text-3xl px-6 py-4 space-y-4 text-center">
                    <Link href="/" className="block hover:text-pink-500" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link href="/events" className="block hover:text-pink-500" onClick={() => setMenuOpen(false)}>Events</Link>
                    <Link href="/gallery" className="block hover:text-pink-500" onClick={() => setMenuOpen(false)}>Gallery</Link>
                    <Link href="/drinks" className="block hover:text-pink-500" onClick={() => setMenuOpen(false)}>Drinks</Link>
                    <Link href="/about" className="block hover:text-pink-500" onClick={() => setMenuOpen(false)}>About</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
