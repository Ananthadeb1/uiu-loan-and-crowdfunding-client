import {
    faFacebookF,
    faInstagram,
    faTwitter,
    faLinkedinIn,
    faYoutube
} from '@fortawesome/free-brands-svg-icons';
import {
    faPhone,
    faEnvelope,
    faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
    return (
        <footer className="bg-[#02211B] text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand Section with Social Links */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">
                            <span className="text-white">Peer</span>
                            <span className="text-[#F9D56E]">Fund</span>
                        </h2>
                        <p className="text-gray-200">
                            Welcome to Peer Fund, your trusted resource for financial loan reviews and comparisons.
                        </p>

                        {/* Social Media Links */}
                        <div className="pt-4">
                            <div className="flex space-x-3">
                                <a href="#" className="text-white hover:text-[#F9D56E] transition-colors p-2 bg-[#35453A] rounded-full hover:bg-[#46584A]">
                                    <FontAwesomeIcon icon={faFacebookF} size="sm" />
                                </a>
                                <a href="#" className="text-white hover:text-[#F9D56E] transition-colors p-2 bg-[#35453A] rounded-full hover:bg-[#46584A]">
                                    <FontAwesomeIcon icon={faTwitter} size="sm" />
                                </a>
                                <a href="#" className="text-white hover:text-[#F9D56E] transition-colors p-2 bg-[#35453A] rounded-full hover:bg-[#46584A]">
                                    <FontAwesomeIcon icon={faInstagram} size="sm" />
                                </a>
                                <a href="#" className="text-white hover:text-[#F9D56E] transition-colors p-2 bg-[#35453A] rounded-full hover:bg-[#46584A]">
                                    <FontAwesomeIcon icon={faLinkedinIn} size="sm" />
                                </a>
                                <a href="#" className="text-white hover:text-[#F9D56E] transition-colors p-2 bg-[#35453A] rounded-full hover:bg-[#46584A]">
                                    <FontAwesomeIcon icon={faYoutube} size="sm" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section with Icons */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contact</h3>
                        <div className="space-y-3 text-gray-200">
                            <div className="flex items-center space-x-3">
                                <FontAwesomeIcon icon={faPhone} className="text-white w-4" />
                                <p>+1 234 567 89</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FontAwesomeIcon icon={faEnvelope} className="text-white w-4" />
                                <p>info@gmail.com</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FontAwesomeIcon icon={faLocationDot} className="text-white w-4" />
                                <p>Dhaka, Bangladesh</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Quick Link</h3>
                        <div className="space-y-2">
                            <a href="#" className="block text-gray-200 hover:text-[#F9D56E] transition-colors">About</a>
                            <a href="#" className="block text-gray-200 hover:text-[#F9D56E] transition-colors">Loan Reviews</a>
                            <a href="#" className="block text-gray-200 hover:text-[#F9D56E] transition-colors">Faq</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="bg-[#35453A] py-4">
                <div className="container mx-auto px-4">
                    <p className="text-center text-gray-200 text-sm">
                        Copyright © 2025 PeerFund. All Rights Reserved
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;