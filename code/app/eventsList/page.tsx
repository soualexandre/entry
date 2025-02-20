"use client"
import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Filter, X, ChevronRight, Users, Music, Film, Theater, Book, Mic, Footprints } from 'lucide-react';
import Layout from '../default';
import useEvents from './hooks/context';
import EventService from '../utils/services/Events';
import Link from 'next/link';
import useHeaderData from '../components/Header/hooks/useHeaderData';
import { useHeaderStore } from '../hooks/Header';

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

interface ApiResponse {
    data: Event[];
    pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    };
}

interface Category {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
}

interface Filters {
    priceRange: [number, number];
    date: string;
}

const categories: any[] = [
    { id: 'all', name: 'Todos', icon: Users },
    { id: 'Minha categoria', name: 'Música', icon: Music },
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

interface EventCardProps {
    event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const lowestPrice = event.batches.length > 0
        ? Math.min(...event.batches.map(batch => batch.price))
        : 0;

    const { setHeaderModel } = useHeaderStore();

    useEffect(() => {
        setHeaderModel("white");
        return () => setHeaderModel("transparent");
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform hover:scale-[1.02]">
            <img
                src={"https://neopix.com.br/wp-content/uploads//2022/10/cobertura-de-evento-corporativo-foto-e-v%C3%ADdeo-2-930x523.jpg"}
                alt={event.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-6">
                {event.category && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {event.category.title}
                    </span>
                )}
                <h3 className="text-xl font-bold text-blue-900 my-4">
                    {event.title}
                </h3>
                <div className="space-y-3 text-gray-600 mb-6">
                    <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span>
                            {formatDate(event.date)}
                            {event.startTime && ` às ${formatTime(event.startTime)}`}
                        </span>
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
                        <button className="bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-800 transition-colors">
                            Comprar
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, filters, setFilters }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end min-h-screen justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <div className="inline-block align-bottom bg-white rounded-t-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-blue-900">Filtros</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Faixa de Preço
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="500"
                                value={filters.priceRange[1]}
                                onChange={(e) => setFilters({
                                    ...filters,
                                    priceRange: [0, parseInt(e.target.value)]
                                })}
                                className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>R$ 0</span>
                                <span>Até R$ {filters.priceRange[1]}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Data
                            </label>
                            <select
                                value={filters.date}
                                onChange={(e) => setFilters({
                                    ...filters,
                                    date: e.target.value
                                })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Todas as datas</option>
                                <option value="today">Hoje</option>
                                <option value="week">Esta semana</option>
                                <option value="month">Este mês</option>
                            </select>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => {
                                    setFilters({
                                        priceRange: [0, 500],
                                        date: 'all'
                                    });
                                }}
                                className="w-1/2 px-4 py-3 text-blue-700 bg-blue-50 rounded-xl font-medium hover:bg-blue-100 transition-colors"
                            >
                                Limpar
                            </button>
                            <button
                                onClick={onClose}
                                className="w-1/2 px-4 py-3 bg-blue-700 text-white rounded-xl font-medium hover:bg-blue-800 transition-colors"
                            >
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EventsListingPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState<Filters>({
        priceRange: [0, 500],
        date: 'all',
    });

    const { events, setLoading, setEvents, setError } = useEvents();

    const fetchEvents = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const response = await EventService.get();
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
            case 'week': {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return eventDate >= weekAgo && eventDate <= today;
            }
            case 'month': {
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return eventDate >= monthAgo && eventDate <= today;
            }
            default:
                return true;
        }
    };

    const filteredEvents = events?.filter((event: any) => {
        console.log(event?.category?.title);
        const hasMatchingCategory = selectedCategory === 'all' ||
            (event?.category?.title === selectedCategory);

        const matchesSearch = !searchTerm ||
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase());

        const lowestPrice = event?.batches?.length > 0
            ? Math.min(...event?.batches?.map((batch: any) => batch.price))
            : 0;

        const matchesPrice = lowestPrice >= filters.priceRange[0] &&
            lowestPrice <= filters.priceRange[1];

        const matchesDate = isDateInRange(event.date, filters.date);

        return hasMatchingCategory && matchesSearch && matchesPrice && matchesDate;
    });

    useEffect(() => {
        console.log('Matching ', events)
    }, [events]);

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 pt-24">
                <header className="bg-white shadow-sm sticky top-0 z-10">
                    <div className="container mx-auto px-4 py-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="search"
                                placeholder="Buscar eventos..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                            >
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4">
                        <div className="flex overflow-x-auto py-4 scrollbar-hide space-x-4">
                            {categories.map(category => {
                                const Icon = category.icon;
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === category.id
                                            ? 'bg-blue-700 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{category.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <main className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents?.map((event: any) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>

                    {filteredEvents?.length === 0 && (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Nenhum evento encontrado
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Tente ajustar seus filtros ou buscar por outros termos
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedCategory('all');
                                    setSearchTerm('');
                                    setFilters({
                                        priceRange: [0, 500],
                                        date: 'all'
                                    });
                                }}
                                className="inline-flex items-center px-6 py-3 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors"
                            >
                                <X className="w-5 h-5 mr-2" />
                                Limpar filtros
                            </button>
                        </div>
                    )}
                </main>

                <FilterModal
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    filters={filters}
                    setFilters={setFilters}
                />
            </div>
        </Layout>
    );
};

export default EventsListingPage;