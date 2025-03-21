// app/events/[id]/promotional-countdown.tsx
'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function PromotionalCountdown({ event }: any) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // Set promotion end date (for demo purposes, 7 days from now)
    const calculateTimeLeft = () => {
        if (!event.batches || event.batches.length === 0) return;

        // Simulate an end date for the first batch
        const firstBatch = event.batches[0];
        const currentDate = new Date();
        const targetDate = new Date(currentDate);
        targetDate.setDate(targetDate.getDate() + 7);

        const difference = targetDate.getTime() - currentDate.getTime();

        if (difference > 0) {
            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / (1000 * 60)) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            });
        }
    };

    useEffect(() => {
        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    // Hide if no batches or no time left
    if (!event.batches ||
        event.batches.length === 0 ||
        (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0)) {
        return null;
    }

    return (
        <div className="bg-primary-foreground dark:bg-primary-foreground/5 border-b">
            <div className="container mx-auto max-w-screen-xl py-3 px-4">
                <Alert variant="default" className="border-primary/30 bg-primary/5">
                    <Clock className="h-4 w-4 text-primary" />
                    <AlertTitle className="text-primary-foreground font-semibold">
                        Oferta por tempo limitado!
                    </AlertTitle>
                    <AlertDescription className="text-primary-foreground/80">
                        <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                            <span>Preço promocional termina em:</span>
                            <div className="flex gap-2 font-mono">
                                <div className="bg-primary/20 rounded px-2 py-1 text-center min-w-14">
                                    <span className="text-lg font-bold">{timeLeft.days}</span>
                                    <span className="text-xs block">dias</span>
                                </div>
                                <div className="bg-primary/20 rounded px-2 py-1 text-center min-w-14">
                                    <span className="text-lg font-bold">{timeLeft.hours}</span>
                                    <span className="text-xs block">horas</span>
                                </div>
                                <div className="bg-primary/20 rounded px-2 py-1 text-center min-w-14">
                                    <span className="text-lg font-bold">{timeLeft.minutes}</span>
                                    <span className="text-xs block">min</span>
                                </div>
                                <div className="bg-primary/20 rounded px-2 py-1 text-center min-w-14">
                                    <span className="text-lg font-bold">{timeLeft.seconds}</span>
                                    <span className="text-xs block">seg</span>
                                </div>
                            </div>
                        </div>
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    );
}