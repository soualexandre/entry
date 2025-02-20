"use client"
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head';
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  Users,
  ChevronDown,
  Copy,
  X,
  Link
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import useEvents from '@/app/eventsList/hooks/context';
import useHeaderData from '../../components/Header/hooks/useHeaderData';
import Layout from '../../default';
import { useAuth } from '../../hooks/Auth/isLogged';
import AuthModal from '../../components/AuthModal';
import EventService from '@/app/utils/services/Events';
import TicketService from '@/app/utils/services/Ticket';
import { showToast, TOAST_TYPES } from '@/app/utils/toast/toast';

type SharePlatform = 'whatsapp' | 'facebook' | 'twitter' | 'telegram' | 'linkedin' | 'copy link';
const EventDetailsPage = () => {
  const { isLoggedIn } = useAuth();
  const { id } = useParams();
  const router = useRouter();
  const [showSharePanel, setShowSharePanel] = useState(false);
  const { isModalOpen, setIsModalOpen } = useHeaderData();
  const { eventById, setEventById } = useEvents();
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [batchId, setBatchId] = useState<number | null>(null);
  const userStorage = localStorage.getItem('user');
  const user = userStorage ? JSON.parse(userStorage) : null;
  const [ticket, setTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showToastFy, setShowToastFy] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 50) {
      setQuantity(newQuantity as number);
    }
  };


  const handleCratePaymentRequest = async (e: React.FormEvent) => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
    }
    e.preventDefault();

    const createData = {
      eventId: eventById?.id,
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
      // setStep(2);
      showToast("Operação bem-sucedida!", TOAST_TYPES.SUCCESS);
    } catch (error) {
      showToast("Erro ao criar Ingresso!", TOAST_TYPES.ERROR);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleShare = (platform: SharePlatform) => {
    const url = `${window.location.origin}/events/${id}`;

    if (platform === 'copy link') {
      navigator.clipboard.writeText(url);
      setShowToastFy(true);
      setTimeout(() => setShowToastFy(false), 3000);
    } else {
      const shareUrl: any = {
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      }[platform];
      window.open(shareUrl, '_blank');
    }
    setShowSharePanel(false);
  };


  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const getEventByid = async (eventId: string) => {
    try {
      const response = await EventService.getById(eventId);
      if (response.data) {
        setEventById(response.data);
        setPrice(response.data.batches[0].price);
        setBatchId(response.data.batches[0].id);
      } else {
        router.push('/');
        console.error("Erro ao buscar evento");
      }
    } catch (error) {
      console.error("Erro ao buscar evento", error);
      router.push('/');
    }
  }

  useEffect(() => {
    if (id) {
      getEventByid(id as string);
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm", { locale: ptBR });
  };

  return (
    <Layout>
      <Head>
        <title>{eventById?.title || 'Event Details'} - Get Your Tickets</title>
        <meta name="description" content={eventById?.description} />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          className="relative h-[60vh] md:h-[70vh] overflow-hidden"
        >
          <div className="absolute inset-0">
            <img
              src="https://www.cnnbrasil.com.br/viagemegastronomia/wp-content/uploads/sites/5/2024/08/festival-tiradentes-minas-gerais.jpg?w=1200&h=900&crop=1"
              alt={eventById?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          </div>

          <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
            <motion.div
              variants={contentVariants}
              className="max-w-3xl space-y-6"
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/90 rounded-full text-lg text-gray-900">
                Featured Event
              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                {eventById?.title}
              </h1>

              <div className="flex flex-wrap gap-6 text-lg text-white">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{eventById?.date ? formatDate(eventById.date) : 'Data não disponível'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{eventById?.date ? formatTime(eventById?.time) : "Hora não disponível"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{eventById?.location}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <main className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2 space-y-8"
            >
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Sobre o evento</h2>
                <p className="text-gray-700 leading-relaxed">
                  {eventById?.description}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Detalhes</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Users className="w-6 h-6 text-gray-700" />
                    <div>
                      <p className="font-medium">Capacidade</p>
                      <p className="text-gray-700">1000 pessoas</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-gray-700" />
                    <div>
                      <p className="font-medium">Localização</p>
                      <p className="text-gray-700">{eventById?.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="lg:sticky lg:top-24 h-fit"
            >
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <Link href={`/checkout/${id}`}>
                  <h2 className="text-2xl font-bold mb-2">Comprar Ingresso</h2>
                </Link>
                <p className="text-gray-600 mb-6">Selecione o seu tipo de ingreço</p>
                <div className="space-y-6">
                  {eventById?.batches?.map((batch: any, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{batch.name}</h3>
                          <p className="text-sm text-gray-600">{batch.description}</p>
                        </div>
                        <p className="text-xl font-bold text-gray-900">R$ {(batch.price * quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}

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
                  <a href={`/checkout/${id}`}>
                    <button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      Comprar ingressos
                    </button>
                  </a>
                  <button
                    className="w-full border border-gray-300 hover:border-gray-400 text-gray-900 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
                    onClick={() => setShowSharePanel(true)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartilhar Evento
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <AnimatePresence>
          {showSharePanel && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed inset-x-0 bottom-0 bg-white/95 border-t border-gray-200 p-6 z-50 shadow-lg"
            >
              <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Compartilhar Evento</h3>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={() => setShowSharePanel(false)}
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {['WhatsApp', 'Facebook', 'Twitter', 'Telegram', 'LinkedIn', 'Copy Link'].map((platform) => (
                    <button
                      key={platform}
                      className="h-auto py-4 border border-gray-200 hover:border-gray-300 rounded-lg transition-colors flex flex-col items-center justify-center"
                      onClick={() => handleShare(platform.toLowerCase() as any)}
                    >
                      <Copy className="w-5 h-5 mb-2 text-gray-700" />
                      <span className="text-gray-900">{platform}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToastFy && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
            >
              Link copiado com sucesso!
            </motion.div>
          )}
        </AnimatePresence>

        <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </Layout>
  );
};

export default EventDetailsPage;