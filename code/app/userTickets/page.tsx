"use client";

import { useState, useEffect, useMemo } from "react";
import { BadgeCheck, ChevronDown, ChevronRight, Clock, Download, QrCode, Ticket, TicketX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import UserService from "../utils/services/User";
import { QRCodeCanvas } from "qrcode.react";
import Header from "@/components/Header";

// Definindo os tipos de status do ticket
const TICKET_STATUS = {
    ASSIGNED: "ASSIGNED",
    PENDING: "PENDING",
    USED: "USED",
    CANCELLED: "CANCELLED"
} as const;

type TicketStatus = keyof typeof TICKET_STATUS;

// Tipos para o Ticket e Evento
interface Ticket {
    id: string;
    status: TicketStatus;
}

interface Event {
    id: string;
    title: string;
    date: string;
    location?: string;
    image?: string;
    tickets: Ticket[];
}

// Configuração de status para exibição
type StatusConfig = {
    icon: JSX.Element;
    text: string;
    color: string;
};

const statusConfig: Record<TicketStatus, StatusConfig> = {
    [TICKET_STATUS.ASSIGNED]: {
        icon: <Ticket className="w-4 h-4" />,
        text: "Disponível",
        color: "text-blue-800 bg-blue-50 border-blue-200"
    },
    [TICKET_STATUS.PENDING]: {
        icon: <Clock className="w-4 h-4" />,
        text: "Pendente",
        color: "text-yellow-800 bg-yellow-50 border-yellow-200"
    },
    [TICKET_STATUS.USED]: {
        icon: <TicketX className="w-4 h-4" />,
        text: "Utilizado",
        color: "text-red-800 bg-red-50 border-red-200"
    },
    [TICKET_STATUS.CANCELLED]: {
        icon: <TicketX className="w-4 h-4" />,
        text: "Cancelado",
        color: "text-gray-800 bg-gray-50 border-gray-200"
    }
};

// Componente principal
const UserTicketsPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTicket, setActiveTicket] = useState<{ ticket: Ticket; event: Event } | null>(null);
    const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});

    // Recupera o usuário do localStorage
    const user = useMemo(() => {
        if (typeof window === "undefined") return null;
        const userStorage = localStorage.getItem("user");
        return userStorage ? JSON.parse(userStorage) : null;
    }, []);

    // Carrega os tickets do usuário
    useEffect(() => {
        if (!user) return;

        const loadTickets = async () => {
            try {
                setLoading(true);
                const response = await UserService.getTicketsUser(user.id);

                // Organiza os tickets por evento
                const eventList: Event[] = response.events.map(({ event }: any) => ({
                    id: event.id,
                    title: event.title,
                    date: event.date,
                    location: event.location,
                    image: event.image,
                    tickets: event.tickets.map((ticket: any) => ({
                        id: `TK-${ticket.id}`,
                        status: ticket.status // Garante que o status seja válido
                    }))
                }));

                setEvents(eventList);

                // Inicializa o estado de expansão dos eventos
                const initialExpandState: Record<string, boolean> = {};
                eventList.forEach(event => {
                    initialExpandState[event.id] = false;
                });
                setExpandedEvents(initialExpandState);
            } catch (error) {
                console.error("Error loading tickets:", error);
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, [user]);

    // Alterna a expansão de um evento
    const toggleEvent = (eventId: string) => {
        setExpandedEvents(prev => ({
            ...prev,
            [eventId]: !prev[eventId]
        }));
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="absolute">
                <Header />
            </div>
            <div className="bg-gradient-to-r from-red-950 to-red-900 text-white p-6 ">
                <div className="container mx-auto px-4 pt-16">
                    <h1 className="text-2xl font-bold">Meus Ingressos</h1>
                    <p className="text-red-100">Eventos e ingressos disponíveis</p>
                </div>
            </div>

            <div className="container mx-auto p-4">
                {loading ? (
                    <p>Carregando eventos e ingressos...</p>
                ) : events.length > 0 ? (
                    <div className="space-y-4">
                        {events.map(event => (
                            <EventCard
                                key={event.id}
                                event={event}
                                isExpanded={expandedEvents[event.id]}
                                onToggle={() => toggleEvent(event.id)}
                                onTicketSelect={(ticket) => setActiveTicket({ ticket, event })}
                            />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Ticket className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Nenhum evento encontrado
                            </h2>
                            <p className="text-gray-700">
                                Você ainda não possui ingressos para nenhum evento.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {activeTicket && (
                <TicketDetailsSheet
                    ticket={activeTicket.ticket}
                    event={activeTicket.event}
                    onClose={() => setActiveTicket(null)}
                />
            )}
        </div>
    );
};

// Componente de card de evento
const EventCard = ({ event, isExpanded, onToggle, onTicketSelect }: {
    event: Event;
    isExpanded: boolean;
    onToggle: () => void;
    onTicketSelect: (ticket: Ticket) => void;
}) => {
    const formattedDate = new Date(event.date).toLocaleDateString('pt-BR');

    return (
        <Card className="border-gray-200">
            <CardHeader className="pb-2">
                <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={onToggle}
                >
                    <div>
                        <CardTitle className="text-lg text-gray-900">{event.title}</CardTitle>
                        <div className="text-sm text-gray-700 mt-1">
                            <div>{formattedDate}</div>
                            {event.location && <div>{event.location}</div>}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Badge className="mr-2 bg-gray-100 text-gray-800 border-gray-200">
                            {event.tickets.length} ingresso{event.tickets.length !== 1 ? 's' : ''}
                        </Badge>
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent>
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-800">Ingressos disponíveis</h3>
                        <div className="grid gap-2">
                            {event.tickets.map(ticket => (
                                <TicketRow
                                    key={ticket.id}
                                    ticket={ticket}
                                    onClick={() => onTicketSelect(ticket)}
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
};

const TicketRow = ({ ticket, onClick }: { ticket: Ticket; onClick: () => void }) => {
    const isValidStatus = (status: string): status is TicketStatus => {
        return Object.values(TICKET_STATUS).includes(status as TicketStatus);
    };


    const config = isValidStatus(ticket.status) ? statusConfig[ticket.status] : {
        icon: <TicketX className="w-4 h-4" />,
        text: "Status inválido",
        color: "text-gray-800 bg-gray-50 border-gray-200"
    };

    return (
        <div className="flex justify-between items-center p-3 border rounded-md border-gray-100 hover:bg-gray-50">
            <div className="flex items-center">
                <div className="font-medium text-gray-900 mr-3">{ticket.id}</div>
                <Badge className={`flex items-center`}>
                    {config.icon}
                    <span className="ml-1">{config.text}</span>
                </Badge>
            </div>
            <Button
                size="sm"
                variant="outline"
                className="border-gray-200 text-gray-800"
                onClick={onClick}
            >
                Ver Detalhes
            </Button>
        </div>
    );
};

const TicketDetailsSheet = ({ ticket, event, onClose }: {
    ticket: Ticket;
    event: Event;
    onClose: () => void;
}) => {
    const [showQRCode, setShowQRCode] = useState(false); // Estado para controlar a visibilidade do QR Code

    const config = statusConfig[ticket.status];
    const formattedDate = new Date(event.date).toLocaleDateString('pt-BR');
    const canShowQR = ticket.status === TICKET_STATUS.ASSIGNED;
    const canDownload = ticket.status === TICKET_STATUS.ASSIGNED;

    const handleDownload = () => {
        alert(`Baixando ingresso ${ticket.id} para o evento ${event.title}`);
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-lg w-full mx-auto bg-white rounded-lg p-6 z-[100] sm:max-w-md sm:p-4 flex flex-col items-center">
                <div className="relative w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden flex flex-col items-center border-2 border-red-300">
                    {/* Recorte superior */}
                    <div className="relative w-full bg-red-50 border-b-2 border-red-300">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white w-6 h-6 rounded-full shadow-md border border-red-300"></div>
                        <DialogHeader className="text-center p-4 bg-red-900 text-white rounded-t-lg">
                            <DialogTitle className="text-xl font-bold">🎟️ Seu Ingresso</DialogTitle>
                        </DialogHeader>
                    </div>

                    {/* Corpo do ingresso */}
                    <div className="p-6 flex flex-col gap-4 relative bg-white w-full border-b-2 border-red-300">
                        {/* Informações do Evento */}
                        <div className="p-4 border border-red-300 rounded-md bg-red-50">
                            <h3 className="font-medium text-red-900 text-xl">{event.title}</h3>
                            <p className="text-sm text-red-700">{event.date}</p>
                            {event.location && <p className="text-sm text-red-700">{event.location}</p>}
                        </div>

                        {/* Status do Ingresso */}
                        <div className="p-4 border border-red-300 rounded-md bg-red-50">
                            <div className="flex items-center gap-3 mb-2">
                                {config.icon}
                                <h3 className="font-medium text-red-900 text-xl">{config.text}</h3>
                            </div>
                            <p className="text-sm text-red-700">{config.description}</p>
                        </div>

                        {/* QR Code */}
                        <div className="p-4 border border-red-300 rounded-md bg-white flex flex-col items-center relative">
                            {canShowQR ? (
                                <>
                                    {showQRCode ? (
                                        <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-red-300">
                                            <QRCodeCanvas value={ticket.id} size={200} />
                                        </div>
                                    ) : (
                                        <div className="bg-red-50 p-4 rounded-lg mb-4 border border-red-300">
                                            <p className="text-red-700 text-sm text-center">
                                                Clique no botão abaixo para revelar o QR Code.
                                            </p>
                                        </div>
                                    )}
                                    <Button
                                        className="bg-red-900 text-white hover:bg-red-800"
                                        onClick={() => setShowQRCode(!showQRCode)}
                                    >
                                        {showQRCode ? "Esconder QR Code" : "Mostrar QR Code"}
                                    </Button>
                                </>
                            ) : (
                                <p className="text-sm text-red-700 text-center">
                                    {ticket.status === "PENDING"
                                        ? "O QR Code será disponibilizado após a confirmação do pagamento"
                                        : "Este ingresso não está disponível para uso"}
                                </p>
                            )}
                        </div>

                        {/* Linha pontilhada para separação */}
                        <div className="w-full border-t border-dashed border-red-300 mt-4"></div>
                    </div>

                    {/* Hashtags para divulgação */}
                    <div className="p-4 text-center w-full bg-red-50 border-t-2 border-red-300">
                        <p className="text-red-700 text-sm">
                            Compartilhe sua empolgação! Use as hashtags:
                        </p>
                        <p className="text-red-900 font-bold text-lg">
                            #EuVou #{event.title.replace(/\s+/g, '')}
                        </p>
                    </div>

                    {/* Recorte inferior */}
                    <div className="relative w-full bg-red-50 border-t-2 border-red-300">
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white w-6 h-6 rounded-full shadow-md border border-red-300"></div>
                    </div>
                </div>

                {/* Botões de ação */}
                <div className="flex flex-col gap-3 mt-4 w-full max-w-sm">
                    {canDownload && (
                        <Button
                            className="w-full bg-red-900 text-white hover:bg-red-800 flex items-center justify-center"
                            onClick={handleDownload}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Baixar Ingresso PDF
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        className="w-full border-red-900 text-red-900 hover:bg-red-50"
                        onClick={onClose}
                    >
                        Fechar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UserTicketsPage;