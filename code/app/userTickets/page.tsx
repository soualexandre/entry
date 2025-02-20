"use client"
import { Check, ChevronDown, ChevronUp, Share2, Ticket } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../default';
import { useHeaderStore } from '../hooks/Header';

const UserTicketsPage = () => {

    const { setHeaderModel } = useHeaderStore();

    useEffect(() => {
        setHeaderModel("white");
        return () => setHeaderModel("transparent");
    }, []);

    const [events, setEvents] = useState([
        {
            id: 1,
            title: "Festa do Milhão",
            date: "25 de Maio de 2025",
            location: "Parque de Exposição",
            image: "/event-image.jpg",
            isExpanded: false,
            tickets: [
                { id: "TK-001", shareLink: "https://tickets.com/TK-001", copied: false },
                { id: "TK-002", shareLink: "https://tickets.com/TK-002", copied: false },
            ]
        },
        {
            id: 2,
            title: "Show de Verão",
            date: "30 de Junho de 2025",
            location: "Arena Show",
            image: "/event-image-2.jpg",
            isExpanded: false,
            tickets: [
                { id: "TK-003", shareLink: "https://tickets.com/TK-003", copied: false },
            ]
        }
    ]);

    const toggleEventExpansion = (eventId: any) => {
        setEvents(events.map(event =>
            event.id === eventId
                ? { ...event, isExpanded: !event.isExpanded }
                : event
        ));
    };

    const handleCopyLink = (eventId: any, ticketId: any) => {
        setEvents(events.map(event => {
            if (event.id === eventId) {
                return {
                    ...event,
                    tickets: event.tickets.map(ticket => {
                        if (ticket.id === ticketId) {
                            navigator.clipboard.writeText(ticket.shareLink);
                            return { ...ticket, copied: true };
                        }
                        return ticket;
                    })
                };
            }
            return event;
        }));

        setTimeout(() => {
            setEvents(events.map(event => ({
                ...event,
                tickets: event.tickets.map(ticket => ({
                    ...ticket,
                    copied: false
                }))
            })));
        }, 2000);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 pt-12">
                <main className="container mx-auto px-4 py-8" role="main">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-2xl font-bold text-blue-900 mb-6">Meus Ingressos</h1>

                        <div className="space-y-4">
                            {events.map(event => (
                                <div
                                    key={event.id}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                                >
                                    <button
                                        className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                                        onClick={() => toggleEventExpansion(event.id)}
                                        aria-expanded={event.isExpanded}
                                        aria-controls={`tickets-${event.id}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4">
                                                <img
                                                    src={event.image}
                                                    alt={event.title}
                                                    className="w-20 h-20 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <h2 className="text-xl font-semibold text-blue-900 mb-1">
                                                        {event.title}
                                                    </h2>
                                                    <p className="text-gray-600 text-sm mb-1">{event.date}</p>
                                                    <p className="text-gray-600 text-sm">{event.location}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="mr-2 text-sm text-gray-600">
                                                    {event.tickets.length} {event.tickets.length === 1 ? 'ingresso' : 'ingressos'}
                                                </span>
                                                {event.isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-blue-700" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-blue-700" />
                                                )}
                                            </div>
                                        </div>
                                    </button>

                                    {event.isExpanded && (
                                        <div
                                            id={`tickets-${event.id}`}
                                            className="border-t border-gray-100"
                                        >
                                            {event.tickets.map(ticket => (
                                                <div
                                                    key={ticket.id}
                                                    className="p-6 border-b border-gray-100 last:border-b-0"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <Ticket className="w-5 h-5 text-blue-700" />
                                                            <span className="font-medium text-blue-900">
                                                                {ticket.id}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleCopyLink(event.id, ticket.id)}
                                                            className="flex items-center space-x-2 text-blue-700 hover:text-blue-800 font-medium"
                                                            aria-label={`Compartilhar ingresso ${ticket.id}`}
                                                        >
                                                            {ticket.copied ? (
                                                                <>
                                                                    <Check className="w-5 h-5" />
                                                                    <span>Link copiado!</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Share2 className="w-5 h-5" />
                                                                    <span>Compartilhar</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {events.length === 0 && (
                            <div className="text-center py-12">
                                <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    Nenhum ingresso encontrado
                                </h2>
                                <p className="text-gray-600">
                                    Você ainda não possui nenhum ingresso comprado.
                                </p>
                                <Link
                                    href="/events"
                                    className="inline-block mt-6 px-6 py-3 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors"
                                >
                                    Ver eventos disponíveis
                                </Link>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </Layout>
    );
};

export default UserTicketsPage;