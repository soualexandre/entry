"use client"
import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white py-16">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-12">
                    <div>
                        <h3 className="text-2xl font-bold mb-6">Entry</h3>
                        <p className="text-gray-400">Your trusted platform for discovering and booking the best events.</p>
                    </div>
                    {[
                        {
                            title: 'Quick Links',
                            links: ['About Us', 'Contact', 'FAQs']
                        },
                        {
                            title: 'Legal',
                            links: ['Privacy Policy', 'Terms of Service', 'Refund Policy']
                        }
                    ].map((section, index) => (
                        <div key={index}>
                            <h4 className="text-lg font-semibold mb-6">{section.title}</h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Follow Us</h4>
                        <div className="flex space-x-4">
                            {[Facebook, Twitter, Instagram].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="bg-gray-800 p-3 rounded-full text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            &copy; 2025 TicketPro. All rights reserved.
                        </p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 hover:text-white text-sm">
                                Privacy Policy
                            </a>
                            <span className="text-gray-600">•</span>
                            <a href="#" className="text-gray-400 hover:text-white text-sm">
                                Terms of Service
                            </a>
                            <span className="text-gray-600">•</span>
                            <a href="#" className="text-gray-400 hover:text-white text-sm">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;