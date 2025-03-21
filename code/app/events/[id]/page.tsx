'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CalendarIcon,
  ClockIcon,
  CopyIcon,
  MapPinIcon,
  MinusIcon,
  PlusIcon,
  Share2Icon,
  UsersIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showToast, TOAST_TYPES } from 'utils/toast/toast';
import { getAuthToken } from 'utils/config/axios_config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  batches: {
    id: string;
    name: string;
    description: string;
    price: number;
  }[];
}

function formatDate(dateString: string) {
  return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

function formatTime(timeString: string) {
  return format(new Date(timeString), "HH:mm", { locale: ptBR });
}

function EventActions({ event, id }: { event: Event; id: string }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedBatch, setSelectedBatch] = useState(event?.batches?.[0] || null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = (platform: string) => {
    if (typeof window === 'undefined') return; // Evita execução no servidor

    const url = `${window.location.origin}/events/${id}`;

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      showToast("Link copiado para a área de transferência", TOAST_TYPES.SUCCESS);
    } else {
      const shareUrls: Record<string, string> = {
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Confira este evento: ${event?.title} - ${url}`)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Confira este evento: ${event?.title}`)}&url=${encodeURIComponent(url)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Confira este evento: ${event?.title}`)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
      };

      if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank');
      }
    }

    setIsShareOpen(false);
  };

  return (
    <Card className="sticky top-6 border-none shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl text-blue-950">Ingressos</CardTitle>
        <CardDescription>Garanta sua presença neste evento</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          {event?.batches?.map((batch, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${selectedBatch?.id === batch.id
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-gray-100 hover:border-gray-300'
                }`}
              onClick={() => setSelectedBatch(batch)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{batch.name}</h3>
                  <p className="text-sm text-gray-500">{batch.description}</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  R$ {batch.price.toFixed(2)}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Quantidade
          </label>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="h-8 w-8 rounded-md"
            >
              <MinusIcon className="h-3 w-3" />
            </Button>
            <span className="text-lg font-medium text-blue-900 w-8 text-center">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 10}
              className="h-8 w-8 rounded-md"
            >
              <PlusIcon className="h-3 w-3" />
            </Button>

            <div className="ml-auto text-xl font-bold text-blue-900">
              R$ {selectedBatch ? (selectedBatch.price * quantity).toFixed(2) : '0.00'}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3">
        <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
          <a href={`/checkout/${id}`}>
            Comprar agora
          </a>
        </Button>

        <Sheet open={isShareOpen} onOpenChange={setIsShareOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Share2Icon className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-xl">
            <SheetHeader className="pb-6">
              <SheetTitle>Compartilhar evento</SheetTitle>
              <SheetDescription>
                Escolha como deseja compartilhar {event?.title}
              </SheetDescription>
            </SheetHeader>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { id: 'whatsapp', name: 'WhatsApp', icon: '/icons/whatsapp.svg' },
                { id: 'facebook', name: 'Facebook', icon: '/icons/facebook.svg' },
                { id: 'twitter', name: 'Twitter', icon: '/icons/twitter.svg' },
                { id: 'telegram', name: 'Telegram', icon: '/icons/telegram.svg' },
                { id: 'linkedin', name: 'LinkedIn', icon: '/icons/linkedin.svg' },
                { id: 'copy', name: 'Copiar Link', icon: '/icons/copy.svg' }
              ].map(platform => (
                <Button
                  key={platform.id}
                  variant="outline"
                  className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-gray-50"
                  onClick={() => handleShare(platform.id)}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <CopyIcon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium">{platform.name}</span>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </CardFooter>
    </Card>
  );
}

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const token = getAuthToken();
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3036/events/${params.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Falha ao buscar os dados do evento');
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-950">Carregando...</h1>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Erro ao carregar o evento</h1>
          <p className="text-gray-600">Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return null; // Evita renderização sem dados
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <section className="relative h-[60vh] md:h-[75vh]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={"https://www.cnnbrasil.com.br/viagemegastronomia/wp-content/uploads/sites/5/2024/08/festival-tiradentes-minas-gerais.jpg"}
              alt={event.title}
              className="w-full h-full object-cover transform scale-105 origin-center"
              style={{
                objectPosition: "center 30%",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-16">
          <div className="max-w-3xl space-y-6 text-white">
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-1.5 text-sm rounded-full">
              {"Featured Event"}
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-y-4 gap-x-6">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-300" />
                <span className="text-lg">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-blue-300" />
                <span className="text-lg">{formatTime(event.time)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-blue-300" />
                <span className="text-lg">{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="bg-transparent border-b w-full justify-start">
                <TabsTrigger
                  value="about"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                >
                  Sobre
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                >
                  Detalhes
                </TabsTrigger>
                <TabsTrigger
                  value="location"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                >
                  Localização
                </TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="pt-6">
                <Card className="border-none shadow-md">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <UsersIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Sobre o Evento</h3>
                            <p className="text-gray-700">
                              A **Festa do Milhão** é um evento cristão tradicional realizado pela **Assembleia de Deus CIADSETA de Paraíso do Tocantins**, que se destaca como um grande encontro de fé, cultura e confraternização. A festa tem como principal objetivo promover a união da comunidade cristã, celebrando com muita alegria e emoção a presença de Deus em nossas vidas.
                            </p>
                            <p className="text-gray-700">
                              A festa é famosa por sua **gastronomia única**, com um cardápio exclusivo que prioriza o uso de produtos derivados do milho. Entre os pratos típicos, você poderá saborear deliciosas iguarias como pamonha, curau, bolo de milho, milho cozido e muitos outros, que são preparados com carinho e dedicação pela comunidade local.
                            </p>
                            <p className="text-gray-700">
                              O evento conta com uma programação diversificada, que inclui apresentações musicais de grupos de louvor, pregações e momentos de oração. É uma oportunidade para fortalecer os laços entre os membros da igreja e também para evangelizar novos participantes, com uma abordagem acolhedora e cheia de amor.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <CalendarIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Data e Hora</h3>
                            <p className="text-gray-700">
                              A **Festa do Milhão** ocorrerá no próximo dia [data], a partir das [hora]. Não perca essa oportunidade de vivenciar um momento de fé e celebração!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="pt-6">
                <Card className="border-none shadow-md">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <UsersIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Capacidade</h3>
                            <p className="text-gray-700">
                              {"1000"} pessoas
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <CalendarIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Data e Hora</h3>
                            <p className="text-gray-700">
                              {formatDate(event.date)} • {formatTime(event.time)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="pt-6">
                <Card className="border-none shadow-md overflow-hidden">
                  <div className="aspect-video w-full bg-gray-200">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(event.location)}`}
                      allowFullScreen
                    ></iframe>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <MapPinIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Endereço completo</h3>
                        <p className="text-gray-700">{event.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <EventActions event={event} id={params.id} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}