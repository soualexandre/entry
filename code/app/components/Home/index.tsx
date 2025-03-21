import React, { Suspense, useState } from "react";
import { Shield, Zap, Search, Calendar, MapPin, Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import EventService from "utils/services/Events";

interface EventBatch {
    price: string;
    title: string;
}

interface EventCategory {
    id: string;
    title: string;
}

interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    image: string;
    category: EventCategory;
    batches: EventBatch[];
}

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
    ariaLabel: string;
}

interface Testimonial {
    name: string;
    quote: string;
    image: string;
    rating: number;
    role: string;
}

// Server-side data fetching
async function getEvents(): Promise<Event[]> {
    try {
        const res = await EventService.get();
        if (!res.ok) {
            throw new Error('Failed to fetch events');
        }

        return res.json();
    } catch (error) {
        console.error('Error loading events:', error);
        return [];
    }
}

const features: Feature[] = [
    {
        icon: <Shield className="w-12 h-12 text-primary" />,
        title: 'Pagamento Seguro',
        description: 'Segurança de nível bancário para transações sem preocupações',
        ariaLabel: 'Seção de pagamento seguro'
    },
    {
        icon: <Zap className="w-12 h-12 text-primary" />,
        title: 'Entrega Instantânea',
        description: 'Ingressos digitais entregues diretamente no seu dispositivo',
        ariaLabel: 'Seção de entrega instantânea'
    },
    {
        icon: <Search className="w-12 h-12 text-primary" />,
        title: 'Descoberta Inteligente',
        description: 'Encontre eventos perfeitos que combinam com seus interesses',
        ariaLabel: 'Seção de descoberta inteligente'
    }
];

const testimonials: Testimonial[] = [
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

function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
    "use client";

    const [currentTestimonial, setCurrentTestimonial] = useState<any>(0);

    return (
        <div className="max-w-4xl mx-auto relative">
            <div className="flex items-center">
                <Button
                    onClick={() => setCurrentTestimonial((prev: any) => (prev - 1 + testimonials.length) % testimonials.length)}
                    variant="outline"
                    size="icon"
                    className="absolute -left-4 z-10 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 focus:ring-4 focus:ring-primary/20"
                    aria-label="Depoimento anterior"
                >
                    <ChevronLeft className="w-6 h-6 text-primary" aria-hidden="true" />
                </Button>

                <Card className="w-full mx-16 shadow-lg">
                    <CardContent className="pt-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative w-20 h-20 mb-6">
                                <Image
                                    src={testimonials[currentTestimonial].image}
                                    alt={`Foto de ${testimonials[currentTestimonial].name}`}
                                    fill
                                    className="rounded-full border-4 border-primary/10 object-cover"
                                />
                            </div>
                            <div className="flex items-center mb-6" aria-label={`Avaliação: ${testimonials[currentTestimonial].rating} estrelas`}>
                                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" aria-hidden="true" />
                                ))}
                            </div>
                            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">"{testimonials[currentTestimonial].quote}"</p>
                            <p className="font-bold text-xl">{testimonials[currentTestimonial].name}</p>
                            <p className="text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                        </div>
                    </CardContent>
                </Card>

                <Button
                    onClick={() => setCurrentTestimonial((prev: any) => (prev + 1) % testimonials.length)}
                    variant="outline"
                    size="icon"
                    className="absolute -right-4 z-10 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 focus:ring-4 focus:ring-primary/20"
                    aria-label="Próximo depoimento"
                >
                    <ChevronRight className="w-6 h-6 text-primary" aria-hidden="true" />
                </Button>
            </div>
        </div>
    );
}

// Event card skeleton for loading state
function EventCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="aspect-[4/3] relative bg-muted">
                <Skeleton className="h-full w-full" />
            </div>
            <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </CardHeader>
            <CardFooter className="flex justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-10 w-32" />
            </CardFooter>
        </Card>
    );
}

function EventCard({ event }: { event: Event }) {
    return (
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                    src={event.image}
                    alt={`Imagem do evento ${event.title}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute top-4 right-4 bg-white/95 text-primary hover:bg-white/90">
                    {event.category.title}
                </Badge>
            </div>
            <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">
                    {event.title}
                </CardTitle>
                <div className="space-y-2 text-muted-foreground">
                    <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-3" aria-hidden="true" />
                        <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-3" aria-hidden="true" />
                        <span>{event.location}</span>
                    </div>
                </div>
            </CardHeader>
            <CardFooter className="flex items-center justify-between">
                <p className="text-2xl font-bold text-primary">
                    {event.batches[0]?.price}
                </p>
                <Button variant="default" size="lg" className="transition-all duration-300 hover:-translate-y-1">
                    Comprar Ingresso
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function HomePage() {
    // Fetch events data server-side
    // const events = await getEvents();

    return (
        <main>
            {/* <section className="relative py-24 md:py-32 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold text-white mb-8">Entrada facilitada e segura em qualquer evento</h1>
                    <p className="text-lg text-white/90 mb-12">Descubra e reserve ingressos para os melhores eventos.</p>
                    <Button asChild size="lg" variant="secondary">
                        <Link href="/eventsList">Explorar Eventos</Link>
                    </Button>
                </div>
            </section> */}
            <section className="relative py-24 md:py-32 overflow-hidden  bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400" aria-label="Seção principal">
                {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 -z-10"></div> */}

                {/* <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 -z-10"></div> */}

                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 text-white leading-tight">
                            Entrada facilitada e segura em qualquer evento
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl mb-12 text-white/90 leading-relaxed">
                            Descubra e reserve ingressos para os eventos mais emocionantes que acontecem ao seu redor.
                            Sua próxima experiência inesquecível está a apenas um clique de distância.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                asChild
                                size="lg"
                                variant="secondary"
                                className="w-full sm:w-auto text-primary hover:-translate-y-1 transition-transform"
                            >
                                <Link href="/eventsList">Explorar Eventos</Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto border-white text-white hover:bg-white/10 hover:text-white transition-all"
                            >
                                Como trabalhamos
                            </Button>
                        </div>
                    </div>
                </div>
            </section>


            {/* Features Section */}
            <section className="py-24 bg-white" aria-label="Nossos recursos">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="group bg-primary/5 border-none transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                            >
                                <CardHeader>
                                    <div className="mb-4 transform transition-transform duration-500 group-hover:scale-110">
                                        {feature.icon}
                                    </div>
                                    <CardTitle>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground mb-6">{feature.description}</p>
                                    <Button variant="link" className="p-0 text-primary hover:text-primary/80 flex items-center">
                                        Ler mais <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Events Section */}
            {/* <section className="py-24 bg-muted/30" aria-label="Eventos em destaque">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Eventos em Destaque</h2>
                        <p className="text-muted-foreground text-lg">Descubra os eventos mais populares da semana</p>
                    </div>

                    <Suspense fallback={
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => <EventCardSkeleton key={i} />)}
                        </div>
                    }>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </Suspense>

                    <div className="mt-16 text-center">
                        <Button asChild size="lg">
                            <Link href="/eventsList">
                                Ver todos os eventos
                            </Link>
                        </Button>
                    </div>
                </div>
            </section> */}

            {/* Testimonials Section */}
            <section className="py-24 bg-primary/5" aria-label="Depoimentos dos clientes">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">O que Nossos Clientes Dizem</h2>
                        <p className="text-muted-foreground text-lg">Experiências reais de pessoas que confiam em nossos serviços</p>
                    </div>

                    <TestimonialsCarousel testimonials={testimonials} />
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-primary text-white" aria-label="Chamada para ação">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para encontrar seu próximo evento?</h2>
                    <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                        Junte-se a milhares de pessoas que já descobriram os melhores eventos através da nossa plataforma.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        variant="secondary"
                        className="text-primary hover:-translate-y-1 transition-transform"
                    >
                        <Link href="/register">
                            Criar Conta Gratuitamente
                        </Link>
                    </Button>
                </div>
            </section>
        </main>
    );
}