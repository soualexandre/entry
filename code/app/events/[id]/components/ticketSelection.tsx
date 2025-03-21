'use client';

import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from 'hooks/Auth/isLogged';
import { showToast, TOAST_TYPES } from 'utils/toast/toast';

export default function TicketSelection({ event }: any) {
    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const [selectedBatchId, setSelectedBatchId] = useState(event.batches?.[0]?.id || null);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const selectedBatch = event.batches?.find((batch: any) => batch.id === selectedBatchId) || event.batches?.[0];

    const handleQuantityChange = (newQuantity: any) => {
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    const totalPrice = selectedBatch ? selectedBatch.price * quantity : 0;
    const ticketsLeft = 50;

    const handleBuyTickets = () => {
        if (!isLoggedIn) {
            // toast({
            //     title: "Login necessário",
            //     description: "Por favor, faça login para continuar com a compra",
            //     variant: "destructive",
            // });

            showToast("Login necessário. Por favor, faça login para continuar com a compra", TOAST_TYPES.INFO);

            return;
        }

        router.push(`/checkout/${event.id}?batch=${selectedBatchId}&quantity=${quantity}`);
    };

    return (
        <Card className="overflow-hidden border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
                <div className="flex items-center justify-between">
                    <CardTitle>Ingressos</CardTitle>
                    {ticketsLeft < 30 && (
                        <Badge variant="destructive" className="animate-pulse">
                            Apenas {ticketsLeft} ingressos disponíveis
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-6">
                <div className="space-y-4">
                    {event.batches?.map((batch: any) => (
                        <motion.div
                            key={batch.id}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedBatchId === batch.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/30'
                                }`}
                            onClick={() => setSelectedBatchId(batch.id)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-medium flex items-center gap-2">
                                        <Ticket className="w-4 h-4" />
                                        {batch.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{batch.description}</p>
                                </div>
                                <p className="text-xl font-bold">R$ {batch.price.toFixed(2)}</p>
                            </div>
                        </motion.div>
                    ))}

                    <Separator className="my-4" />

                    <div className="py-4">
                        <label className="block text-sm font-medium mb-2">
                            Quantidade de Ingressos
                        </label>
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleQuantityChange(quantity - 1)}
                                disabled={quantity <= 1}
                                aria-label="Diminuir quantidade"
                            >
                                <ChevronDown className="h-4 w-4" />
                            </Button>

                            <span className="text-xl font-semibold w-8 text-center">
                                {quantity}
                            </span>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleQuantityChange(quantity + 1)}
                                disabled={quantity >= 10}
                                aria-label="Aumentar quantidade"
                            >
                                <ChevronUp className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex-col space-y-4 bg-muted/30 border-t">
                <div className="w-full flex justify-between items-center">
                    <span className="text-sm font-medium">Total:</span>
                    <span className="text-2xl font-bold">R$ {totalPrice.toFixed(2)}</span>
                </div>

                <Button
                    className="w-full h-12 text-lg"
                    onClick={handleBuyTickets}
                    disabled={isLoading || !selectedBatchId}
                >
                    {isLoading ? "Processando..." : "Comprar Agora"}
                </Button>
            </CardFooter>
        </Card>
    );
}