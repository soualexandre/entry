'use client';

import {
    CheckCircle2,
    Copy,
    Facebook,
    Linkedin,
    MessageCircle,
    Twitter
} from 'lucide-react';
import { useState } from 'react';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { showToast, TOAST_TYPES } from 'utils/toast/toast';
import { Button } from "../../../components/ui/button";

interface ShareEventProps {
    id: string;
    title: string;
}

export function ShareEvent({ id, title }: ShareEventProps) {
    const [isCopied, setIsCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/events/${id}`
        : `/events/${id}`;

    const shareOptions = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            color: 'bg-green-500',
            textColor: 'text-white',
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${shareUrl}`)}`
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-blue-600',
            textColor: 'text-white',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'Twitter',
            icon: Twitter,
            color: 'bg-sky-500',
            textColor: 'text-white',
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            color: 'bg-blue-700',
            textColor: 'text-white',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        }
    ];

    const handleShare = (option: any) => {
        window.open(option.url, '_blank');
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);

            // toast({
            //     title: "Link copiado!",
            //     description: "O link foi copiado para sua área de transferência.",
            // });

            showToast("Link copiado para a área de transferência", TOAST_TYPES.SUCCESS);

            setTimeout(() => setIsCopied(false), 3000);
        } catch (err) {
            // toast({
            //     title: "Erro ao copiar",
            //     description: "Não foi possível copiar o link.",
            //     variant: "destructive",
            // });
            showToast("Erro ao copiar o link", TOAST_TYPES.ERROR);
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white">
                    Compartilhar
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="sm:max-w-md sm:mx-auto rounded-t-xl">
                <SheetHeader>
                    <SheetTitle>Compartilhar Evento</SheetTitle>
                    <SheetDescription>
                        Compartilhe este evento com seus amigos e redes sociais
                    </SheetDescription>
                </SheetHeader>

                <div className="py-6">
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        {shareOptions.map((option) => (
                            <Button
                                key={option.name}
                                variant="outline"
                                className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                                onClick={() => handleShare(option)}
                            >
                                <div className={`w-10 h-10 rounded-full ${option.color} ${option.textColor} flex items-center justify-center`}>
                                    <option.icon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-medium">{option.name}</span>
                            </Button>
                        ))}
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden">
                                <span className="truncate">{shareUrl}</span>
                            </div>
                        </div>
                        <Button type="submit" size="icon" onClick={copyToClipboard}>
                            {isCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                <SheetFooter>
                    <Button variant="outline" className="w-full sm:w-auto">
                        Fechar
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}