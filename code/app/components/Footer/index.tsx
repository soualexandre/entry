"use client"
import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
    // Wine red color from Festa Junina theme
    const wineRed = "#8B0000";

    return (
        <footer className="bg-red-950 text-white py-10">
            <div className="container mx-auto px-4">
                {/* Contact Us section */}
                <div className="bg-white text-[#8B0000] p-6 rounded-lg mb-8 text-center">
                    <h3 className="text-xl font-bold mb-2">Tem alguma dúvida? Fale conosco!</h3>
                    <div className="flex justify-center space-x-4 mt-4">
                        <a href="#" className="flex items-center hover:underline">
                            <Mail className="w-4 h-4 mr-2" />
                            contato@ticketpro.com
                        </a>
                        <a href="#" className="flex items-center hover:underline">
                            <Phone className="w-4 h-4 mr-2" />
                            (11) 9999-9999
                        </a>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Entry</h3>
                        <p className="text-gray-100">Sua plataforma para os melhores eventos.</p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {['Sobre Nós', 'Contato', 'Perguntas', 'Privacidade', 'Termos', 'Reembolsos'].map((link) => (
                                <a
                                    key={link}
                                    href="#"
                                    className="text-gray-100 hover:text-white hover:underline"
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Redes Sociais</h4>
                        <div className="flex space-x-4">
                            {[Facebook, Twitter, Instagram].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="bg-white p-2 rounded-full text-[#8B0000] hover:bg-gray-100 transition-all duration-300"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white border-opacity-20">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-white text-sm">
                            &copy; 2025 TicketPro. Todos os direitos reservados.
                        </p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <a href="#" className="text-gray-100 hover:text-white hover:underline text-sm">
                                Privacidade
                            </a>
                            <span className="text-white">•</span>
                            <a href="#" className="text-gray-100 hover:text-white hover:underline text-sm">
                                Termos
                            </a>
                            <span className="text-white">•</span>
                            <a href="#" className="text-gray-100 hover:text-white hover:underline text-sm">
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;