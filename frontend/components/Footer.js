import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-center py-6 border-t border-fuchsia-700">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-yellow-400">

                {/* Social Icons Section */}
                <div className="flex flex-col items-center md:items-start space-y-2">
                    <p className="font-neon text-lg">Follow us on social media</p>
                    <div className="flex space-x-4 text-2xl">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition">
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                    </div>
                </div>

                {/* Center Contact Link */}
                <div className="flex justify-center">
                    <Link href="/contact" className="font-neon text-2xl hover:text-pink-600 transition">
                        Contact Us
                    </Link>
                </div>

                {/* Credit Section */}
                <div className="flex flex-col items-center md:items-end font-neon space-y-1">
                    <p>&copy; {new Date().getFullYear()} AJ's Bar & Music Hall</p>
                    <a
                        href="https://laurachipmandesigns.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-400 transition"
                    >
                        Website by Laura Chipman
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
