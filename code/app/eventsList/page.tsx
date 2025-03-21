// pages/events/index.tsx
'use client';

import { Book, Calendar, Film, Filter, Footprints, MapPin, Mic, Music, Search, Theater, Users, X } from 'lucide-react';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Layout from '../default';
import { useHeaderStore } from '../hooks/Header';
import EventService from '../utils/services/Events';
import useEvents from './hooks/context';

interface Batch {
    id: string;
    eventId: string;
    price: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
}

interface Category {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string | null;
    startTime: string;
    image: string;
    createdAt: string;
    updatedAt: string;
    batches: Batch[];
    categoryId: string | null;
    category: Category | null;
}

interface Filters {
    priceRange: [number, number];
    date: string;
}

const categories = [
    { id: 'all', name: 'Todos', icon: Users },
    { id: 'music', name: 'Música', icon: Music },
    { id: 'cinema', name: 'Cinema', icon: Film },
    { id: 'theater', name: 'Teatro', icon: Theater },
    { id: 'culture', name: 'Cultura', icon: Book },
    { id: 'sports', name: 'Esportes', icon: Footprints },
    { id: 'comedy', name: 'Comédia', icon: Mic },
];

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} de ${month} de ${year}`;
};

const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const lowestPrice = event.batches.length > 0
        ? Math.min(...event.batches.map(batch => batch.price))
        : 0;

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform hover:scale-[1.02]">
            <img
                src={event.image || 'https://neopix.com.br/wp-content/uploads//2022/10/cobertura-de-evento-corporativo-foto-e-v%C3%ADdeo-2-930x523.jpg'}
                alt={event.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-6">
                {event.category && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {event.category.title}
                    </span>
                )}
                <h3 className="text-xl font-bold text-blue-900 my-4">{event.title}</h3>
                <div className="space-y-3 text-gray-600 mb-6">
                    <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span>{formatDate(event.date)} {event.startTime && `às ${formatTime(event.startTime)}`}</span>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span>{event.description}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    {lowestPrice > 0 && (
                        <div>
                            <span className="text-sm text-gray-600">A partir de</span>
                            <div className="text-xl font-bold text-blue-900">
                                R$ {lowestPrice.toFixed(2)}
                            </div>
                        </div>
                    )}
                    <Link href={`/events/${event.id}`}>
                        <Button variant="primary">Comprar</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
const FilterModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}> = ({ isOpen, onClose, filters, setFilters }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <Button variant="icon">
                    <X className="w-6 h-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg w-full bg-white rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle>Filtros</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Faixa de Preço</label>
                            <Slider
                                value={filters.priceRange[1]}
                                min={0}
                                max={500}
                                onChange={(value) => setFilters({ ...filters, priceRange: [0, value] })}
                            />
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>R$ 0</span>
                                <span>Até R$ {filters.priceRange[1]}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                            <Select value={filters.date} onValueChange={(value) => setFilters({ ...filters, date: value })}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Escolha a data" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as datas</SelectItem>
                                    <SelectItem value="today">Hoje</SelectItem>
                                    <SelectItem value="week">Esta semana</SelectItem>
                                    <SelectItem value="month">Este mês</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex space-x-4">
                            <Button onClick={() => setFilters({ priceRange: [0, 500], date: 'all' })}>Limpar</Button>
                            <Button variant="primary" onClick={onClose}>Aplicar Filtros</Button>
                        </div>
                    </div>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
};

const EventsListingPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState<Filters>({ priceRange: [0, 500], date: 'all' });

    const { events, setLoading, setEvents, setError } = useEvents();

    const fetchEvents = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const response = await EventService.get();
            console.log("response", response);
            if (response?.data) {
                setEvents(response.data);
            } else {
                setError('Nenhum dado retornado');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erro ao buscar eventos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const isDateInRange = (dateStr: string, filterType: string): boolean => {
        const eventDate = new Date(dateStr);
        const today = new Date();

        switch (filterType) {
            case 'today':
                return eventDate.toDateString() === today.toDateString();
            case 'week':
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return eventDate >= weekAgo && eventDate <= today;
            case 'month':
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return eventDate >= monthAgo && eventDate <= today;
            default:
                return true;
        }
    };

    const filteredEvents = events?.filter((event) => {
        console.log("event", event);

        const hasMatchingCategory = selectedCategory === 'all' || event?.category?.title === selectedCategory;
        console.log(hasMatchingCategory)
        const matchesSearch = !searchTerm || event.title.toLowerCase().includes(searchTerm.toLowerCase()) || event.description.toLowerCase().includes(searchTerm.toLowerCase());
        const lowestPrice = event?.batches?.length > 0 ? Math.min(...event?.batches?.map(batch => batch.price)) : 0;
        const matchesPrice = lowestPrice >= filters.priceRange[0] && lowestPrice <= filters.priceRange[1];
        const matchesDate = isDateInRange(event.date, filters.date);

        return hasMatchingCategory && matchesSearch && matchesPrice && matchesDate;
    });

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 pt-24">
                <header className="bg-white shadow-sm sticky top-0 z-10">
                    <div className="container mx-auto px-4 py-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="search"
                                placeholder="Buscar eventos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            />
                            <Button variant="icon" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800" onClick={() => setIsFilterOpen(true)}>
                                <Filter className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </header>

                <div className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4">
                        <div className="flex overflow-x-auto py-4 scrollbar-hide space-x-4">
                            {categories.map(category => (
                                <Button
                                    key={category.id}
                                    variant={selectedCategory === category.id ? 'primary' : 'secondary'}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-full"
                                >
                                    <category.icon className="w-4 h-4" />
                                    <span>{category.name}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <main className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents?.map(event => <EventCard key={event.id} event={event} />)}
                    </div>

                    {filteredEvents?.length === 0 && (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum evento encontrado</h2>
                            <p className="text-gray-600 mb-6">Tente ajustar seus filtros ou buscar por outros termos</p>
                            <Button onClick={() => {
                                setSelectedCategory('all');
                                setSearchTerm('');
                                setFilters({ priceRange: [0, 500], date: 'all' });
                            }}>Limpar filtros</Button>
                        </div>
                    )}
                </main>

                <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} filters={filters} setFilters={setFilters} />
            </div>
        </Layout>
    );
};

export default EventsListingPage;
