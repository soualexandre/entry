"use client";
import { AlertCircle, ArrowLeft, Check, Copy } from 'lucide-react';
import ReactQR from 'react-qr-code';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import EventService from '../../utils/services/Events';
import TicketService from '@/app/utils/services/Ticket';
import { showToast, TOAST_TYPES } from '@/app/utils/toast/toast';
import UserService from '@/app/utils/services/User';
import { QRCodeCanvas } from "qrcode.react";
const CheckoutPage = () => {
    const [step, setStep] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        cpf: '',
        phone: ''
    });
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams<any>();
    const userStorage = localStorage.getItem('user');
    const user = userStorage ? JSON.parse(userStorage) : null;
    const [event, setEvent] = useState<any>({ batches: [] });
    const [price, setPrice] = useState<number | null>(null);
    const [batchId, setBatchId] = useState<number | null>(null);
    const [ticket, setTicket] = useState<any>(null);

    useEffect(() => {
        const getUniqueEvent = async () => {
            try {
                const response = await EventService.getById(id);
                if (response.data) {
                    setEvent(response.data);
                    if (response.data.batches?.length > 0) {
                        setPrice(response.data.batches[0].price);
                        setBatchId(response.data.batches[0].id);
                    }
                } else {
                    console.error("Erro ao buscar evento");
                }
            } catch (error) {
                console.error("Erro ao buscar evento:", error);
            }
        };

        getUniqueEvent();
    }, []);

    if (!price) {
        return (
            <>
                <header className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-4">
                        <Link
                            href={`/events/${event?.id}`}
                            className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium"
                            aria-label="Voltar para eventos"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Voltar para eventos
                        </Link>
                    </div>
                </header>

                <div className="min-h-screen bg-gray-200 flex items-center justify-center">Carregando...</div>
            </>
        );
    }

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= 50) {
            setQuantity(newQuantity);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        // setFormData({
        //     ...formData,
        //     [e.target.name]: e.target.value
        // });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const createData = {
            eventId: event.id,
            batchId: batchId,
            userId: user.id,
            price: price * quantity,
            buyerId: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            phone: user.phoneNumber,
            quantity: quantity,
        };

        try {
            const ticketResponse = await TicketService.create(createData);
            if (!ticketResponse) {
                showToast("Erro ao criar Ingresso!", TOAST_TYPES.ERROR);
                return;
            }
            if (ticketResponse.qr_code_base64 && ticketResponse.qr_code_base64.length > 23648) {
                showToast("QR Code muito grande", TOAST_TYPES.ERROR);
                return;
            }
            setTicket(ticketResponse);
            setStep(2);
            showToast("Operação bem-sucedida!", TOAST_TYPES.SUCCESS);
        } catch (error) {
            showToast("Erro ao criar Ingresso!", TOAST_TYPES.ERROR);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyPix = () => {
        navigator.clipboard.writeText("00020126580014br.gov.bcb.pix0136a629532e-7693-4846-b028-f24e2f0c998952040000530398654040.005802BR5925Test Store6009Sao Paulo62070503***6304BD2E");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href={`/events/${event?.id}`}
                        className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium"
                        aria-label="Voltar para eventos"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Voltar para eventos
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8" role="main">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10"></div>
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-blue-700 text-white' : 'bg-gray-200'} font-semibold`}>
                                1
                            </div>
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-blue-700 text-white' : 'bg-gray-200'} font-semibold`}>
                                2
                            </div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                            <span>Informações</span>
                            <span>Pagamento</span>
                        </div>
                    </div>

                    {step === 1 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-start gap-6 pb-6 border-b border-gray-100">
                                <img
                                    src={event.image}
                                    alt={event?.title}
                                    className="w-24 h-24 rounded-lg object-cover"
                                />
                                <div>
                                    <h1 className="text-2xl font-bold text-blue-900 mb-2">{event?.title}</h1>
                                    <p className="text-gray-600 mb-1">{event?.date}</p>
                                    <p className="text-gray-600">{event?.location}</p>
                                </div>
                            </div>

                            <div className="py-6 border-b border-gray-100">
                                <label className="block text-lg font-semibold text-blue-900 mb-4">
                                    Quantidade de Ingressos
                                </label>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-100 transition-colors"
                                        aria-label="Diminuir quantidade"
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="text-xl font-semibold text-blue-900 w-8 text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-100 transition-colors"
                                        aria-label="Aumentar quantidade"
                                        disabled={quantity >= 10}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-xl">
                                <h2 className="text-lg font-semibold text-blue-900 mb-4">Resumo da Compra</h2>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Ingressos ({quantity}x)</span>
                                        <span>R$ {(price * quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-blue-900 pt-4 border-t border-blue-100">
                                    <span>Total</span>
                                    <span>R$ {(price * quantity).toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="w-full bg-blue-700 text-white py-4 rounded-xl font-semibold hover:bg-blue-800 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Processando...
                                    </span>
                                ) : (
                                    "Continuar para pagamento"
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-blue-900 mb-2">Pagamento via PIX</h2>
                                <p className="text-gray-600">
                                    Escaneie o QR Code ou copie o código PIX para realizar o pagamento
                                </p>
                            </div>

                            <div className="flex flex-col items-center space-y-8">
                                {ticket && ticket.qr_code ? (
                                    <div className="bg-blue-50 p-8 rounded-2xl">
                                        {/* <img src={`data:image/png;base64,${ticket.qr_code_base64}`} width='250' alt="QR Code" /> */}
                                        <QRCodeCanvas value={ticket.qr_code} size={250} />
                                    </div>
                                ) : (
                                    <div>Carregando QR Code...</div>
                                )}

                                <div className="w-full">
                                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                        <div className="flex-1 overflow-x-auto">
                                            <code className="text-blue-900 font-mono text-sm break-words">
                                                {ticket?.qr_code || "Carregando código PIX..."}
                                            </code>
                                        </div>
                                        <button
                                            onClick={handleCopyPix}
                                            className="flex items-center text-blue-700 hover:text-blue-800 font-medium ml-4"
                                            aria-label="Copiar código PIX"
                                        >
                                            {copied ? (
                                                <Check className="w-5 h-5 mr-2" />
                                            ) : (
                                                <Copy className="w-5 h-5 mr-2" />
                                            )}
                                            {copied ? "Copiado!" : "Copiar"}
                                        </button>
                                    </div>
                                </div>


                                <div className="w-full bg-yellow-50 p-6 rounded-xl">
                                    <div className="flex items-start">
                                        <AlertCircle className="w-6 h-6 text-yellow-700 mt-1 flex-shrink-0" />
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                                                Instruções
                                            </h3>
                                            <ul className="text-yellow-700 space-y-2">
                                                <li>1. Abra o app do seu banco</li>
                                                <li>2. Escolha pagar via PIX</li>
                                                <li>3. Escaneie o QR code ou cole o código</li>
                                                <li>4. Confirme os dados e valor</li>
                                                <li>5. Conclua o pagamento</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CheckoutPage;
