"use client"
import React, { useEffect, useState } from 'react';
import { Shield, Zap, Search, Calendar, MapPin, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import EventService from '@/app/utils/services/Events';
import Link from 'next/link';

const Home: React.FC = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [events, setEvents] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);

    const listEvents = async () => {
        try {
            setIsLoading(true);
            const eventsData = await EventService.get();
            setEvents(eventsData.data);
        } catch (err: any) {
            console.error('Error fetching events:', err.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        listEvents();
    }, []);

    const features = [
        {
            icon: <Shield className="w-12 h-12 text-blue-700" />,
            title: 'Pagamento Seguro',
            description: 'Segurança de nível bancário para transações sem preocupações',
            ariaLabel: 'Seção de pagamento seguro'
        },
        {
            icon: <Zap className="w-12 h-12 text-blue-700" />,
            title: 'Entrega Instantânea',
            description: 'Ingressos digitais entregues diretamente no seu dispositivo',
            ariaLabel: 'Seção de entrega instantânea'
        },
        {
            icon: <Search className="w-12 h-12 text-blue-700" />,
            title: 'Descoberta Inteligente',
            description: 'Encontre eventos perfeitos que combinam com seus interesses',
            ariaLabel: 'Seção de descoberta inteligente'
        }
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            quote: 'A maneira mais fácil de conseguir ingressos! Adorei como o processo é simples e seguro.',
            image: '/api/placeholder/64/64',
            rating: 5,
            role: 'Entusiasta de Música'
        },
        {
            name: 'Mike Peters',
            quote: 'Ótima seleção de eventos e entrega super rápida. Altamente recomendado!',
            image: '/api/placeholder/64/64',
            rating: 5,
            role: 'Organizador de Eventos'
        },
        {
            name: 'Emily Chen',
            quote: 'Nunca perdi um show graças à plataforma confiável. O atendimento ao cliente é excelente!',
            image: '/api/placeholder/64/64',
            rating: 5,
            role: 'Cliente Regular'
        }
    ];

    return (
        <main role="main">
            <section
                className="min-h-screen relative flex items-center overflow-hidden"
                aria-label="Seção principal"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-600"></div>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight">
                            Entrada facilitada e segura em qualquer evento
                        </h1>
                        <p className="text-xl md:text-2xl mb-12 text-blue-50 leading-relaxed">
                            Descubra e reserve ingressos para os eventos mais emocionantes que acontecem ao seu redor.
                            Sua próxima experiência inesquecível está a apenas um clique de distância.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link
                                href="/eventsList"
                            >
                                <button
                                    className="w-full sm:w-auto bg-white text-blue-800 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/50"
                                    aria-label="Explorar eventos disponíveis"
                                >
                                    Explorar Eventos
                                </button>
                            </Link>
                            <button
                                className="w-full sm:w-auto border-2 border-white/80 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
                                aria-label="Saiba como trabalhamos"
                            >
                                Como trabalhamos
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="py-24 bg-white relative overflow-hidden"
                aria-label="Nossos recursos"
            >
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-10">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group bg-blue-50 p-8 rounded-2xl transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
                                role="article"
                                aria-label={feature.ariaLabel}
                            >
                                <div className="mb-6 transform transition-transform duration-500 group-hover:scale-110">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-blue-900">{feature.title}</h3>
                                <p className="text-blue-800/80 leading-relaxed mb-6">{feature.description}</p>
                                <a
                                    href="#"
                                    className="inline-flex items-center text-blue-700 hover:text-blue-800 transition-colors font-medium"
                                    aria-label={`Saiba mais sobre ${feature.title}`}
                                >
                                    Ler mais <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section
                className="py-24 bg-gray-50"
                aria-label="Eventos em destaque"
            >
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-4 text-blue-900">Eventos em Destaque</h2>
                    <p className="text-blue-800/70 text-center mb-16 text-lg">Descubra os eventos mais populares da semana</p>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-700 border-t-transparent"></div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {events?.map((event: any, index: number) => (
                                <article
                                    key={index}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500"
                                    role="article"
                                >
                                    <div className="relative overflow-hidden aspect-[4/3]">
                                        <img
                                            src={event.image}
                                            alt={`Imagem do evento ${event.title}`}
                                            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <span className="absolute top-4 right-4 bg-white/95 px-4 py-1 rounded-full text-sm font-semibold text-blue-700">
                                            {event?.category?.title}
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-3 text-blue-900 group-hover:text-blue-700 transition-colors">
                                            {event.title}
                                        </h3>
                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center text-blue-800/70">
                                                <Calendar className="w-5 h-5 mr-3" aria-hidden="true" />
                                                <span>{event.date}</span>
                                            </div>
                                            <div className="flex items-center text-blue-800/70">
                                                <MapPin className="w-5 h-5 mr-3" aria-hidden="true" />
                                                <span>{event?.location}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-blue-700">{event?.batches[0]?.price}</span>
                                            <button
                                                className="bg-blue-700 text-white px-6 py-3 rounded-xl hover:bg-blue-800 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-200"
                                                aria-label={`Comprar ingressos para ${event.title}`}
                                            >
                                                Comprar Ingresso
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section
                className="py-24 bg-blue-50"
                aria-label="Depoimentos dos clientes"
            >
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-4 text-blue-900">O que Nossos Clientes Dizem</h2>
                    <p className="text-blue-800/70 text-center mb-16 text-lg">Experiências reais de pessoas que confiam em nossos serviços</p>

                    <div className="max-w-4xl mx-auto relative">
                        <div className="flex items-center">
                            <button
                                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                                className="absolute -left-4 z-10 p-4 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 transform hover:-translate-x-1 focus:outline-none focus:ring-4 focus:ring-blue-200"
                                aria-label="Depoimento anterior"
                            >
                                <ChevronLeft className="w-6 h-6 text-blue-700" aria-hidden="true" />
                            </button>

                            <div className="bg-white rounded-2xl shadow-lg p-10 mx-16">
                                <div className="flex flex-col items-center text-center">
                                    <img
                                        src={testimonials[currentTestimonial].image}
                                        alt={`Foto de ${testimonials[currentTestimonial].name}`}
                                        className="w-20 h-20 rounded-full border-4 border-blue-100 mb-6"
                                    />
                                    <div className="flex items-center mb-6" aria-label={`Avaliação: ${testimonials[currentTestimonial].rating} estrelas`}>
                                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                            <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" aria-hidden="true" />
                                        ))}
                                    </div>
                                    <p className="text-xl text-blue-800/80 mb-6 leading-relaxed">"{testimonials[currentTestimonial].quote}"</p>
                                    <p className="font-bold text-xl text-blue-900">{testimonials[currentTestimonial].name}</p>
                                    <p className="text-blue-800/70">{testimonials[currentTestimonial].role}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                                className="absolute -right-4 z-10 p-4 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 transform hover:translate-x-1 focus:outline-none focus:ring-4 focus:ring-blue-200"
                                aria-label="Próximo depoimento"
                            >
                                <ChevronRight className="w-6 h-6 text-blue-700" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default Home;