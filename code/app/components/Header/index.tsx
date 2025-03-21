"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
    LogOut,
    Settings,
    Menu,
    X,
    ChevronDown,
    User,
    Ticket,
    Home,
    Calendar
} from "lucide-react";

import { useAuth } from "../../hooks/Auth/isLogged";
import { getInitials } from '../../utils/user/user';
import AuthModal from "../../components/AuthModal";

import { cn } from "../../../lib/utils";
import { Button } from "../../components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
    SheetFooter
} from "../ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useHeaderData from "./hooks/useHeaderData";

interface NavItem {
    name: string;
    href: string;
    icon: React.ReactNode;
    description?: string;
}

const Header: React.FC = () => {
    const { isLoggedIn, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isModalOpen, setIsModalOpen } = useHeaderData()

    const user = typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "{}")
        : null;

    // Navigation items
    const navItems: NavItem[] = [
        {
            name: "Home",
            href: "/",
            icon: <Home className="h-4 w-4 mr-2" />,
            description: "Voltar para a página inicial"
        },
        {
            name: "Eventos",
            href: "/eventsList",
            icon: <Calendar className="h-4 w-4 mr-2" />,
            description: "Descubra os melhores eventos"
        }
    ];

    const authenticatedItems: NavItem[] = [
        {
            name: "Meus Ingressos",
            href: "/userTickets",
            icon: <Ticket className="h-4 w-4 mr-2" />,
            description: "Gerencie seus ingressos adquiridos"
        }
    ];

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Handle logout
    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <header
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-sm",
                isScrolled
                    ? "bg-white/95 shadow-sm border-b"
                    : "bg-transparent"
            )}
        >
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className={cn(
                            "text-2xl font-bold transition-colors",
                            isScrolled
                                ? "text-red-950"
                                : "text-white"
                        )}>
                            Entry
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:gap-4">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {navItems.map((item) => (
                                    <NavigationMenuItem key={item.name}>
                                        <Link href={item.href} legacyBehavior passHref>
                                            <NavigationMenuLink
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    "bg-transparent hover:bg-transparent",
                                                    pathname === item.href && (isScrolled ? "text-red-950" : "text-white font-bold"),
                                                    !isScrolled && "text-white hover:text-white/80",
                                                    isScrolled && "text-red-950 hover:text-red-800"
                                                )}
                                            >
                                                {item.name}
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                ))}

                                {isLoggedIn && authenticatedItems.map((item) => (
                                    <NavigationMenuItem key={item.name}>
                                        <Link href={item.href} legacyBehavior passHref>
                                            <NavigationMenuLink
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    "bg-transparent hover:bg-transparent",
                                                    pathname === item.href && (isScrolled ? "text-red-950" : "text-white font-bold"),
                                                    !isScrolled && "text-white hover:text-white/80",
                                                    isScrolled && "text-red-950 hover:text-red-800"
                                                )}
                                            >
                                                {item.name}
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>

                        {/* Auth buttons */}
                        {isLoggedIn ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "gap-2 p-0 hover:bg-transparent",
                                            !isScrolled && "text-white hover:text-white/80",
                                            isScrolled && "text-red-950 hover:text-red-800"
                                        )}
                                    >
                                        <Avatar className="h-8 w-8 border-2 border-red-950">
                                            <AvatarFallback className="bg-red-950 text-white">
                                                {getInitials(user?.name || "")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="hidden lg:inline">{user?.name?.split(' ')[0]}</span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="cursor-pointer w-full">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Perfil</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/userTickets" className="cursor-pointer w-full">
                                            <Ticket className="mr-2 h-4 w-4" />
                                            <span>Meus Ingressos</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings" className="cursor-pointer w-full">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Configurações</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Sair</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        !isScrolled && "text-white hover:text-white/80",
                                        isScrolled && "text-red-950 hover:text-red-800"
                                    )}
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Entrar
                                </Button>
                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-red-950 hover:bg-red-900 text-white"
                                >
                                    Cadastrar-se
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "md:hidden",
                                    !isScrolled && "text-white hover:text-white/80",
                                    isScrolled && "text-red-950 hover:text-red-800"
                                )}
                                aria-label="Menu"
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="flex flex-col px-0">
                            <SheetHeader className="px-4 pb-6 border-b">
                                <SheetTitle className="text-left">Menu</SheetTitle>
                            </SheetHeader>
                            <div className="flex-1 overflow-auto py-4">
                                <div className="space-y-2 px-2">
                                    {navItems.map((item) => (
                                        <SheetClose asChild key={item.name}>
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    "w-full justify-start pl-6",
                                                    pathname === item.href && "text-red-950 bg-red-50"
                                                )}
                                                onClick={() => router.push(item.href)}
                                            >
                                                {item.icon}
                                                {item.name}
                                            </Button>
                                        </SheetClose>
                                    ))}

                                    {isLoggedIn ? (
                                        <>
                                            {authenticatedItems.map((item) => (
                                                <SheetClose asChild key={item.name}>
                                                    <Button
                                                        variant="ghost"
                                                        className={cn(
                                                            "w-full justify-start pl-6",
                                                            pathname === item.href && "text-red-950 bg-red-50"
                                                        )}
                                                        onClick={() => router.push(item.href)}
                                                    >
                                                        {item.icon}
                                                        {item.name}
                                                    </Button>
                                                </SheetClose>
                                            ))}
                                            <div className="px-2 pt-4 pb-2">
                                                <div className="h-px bg-gray-200 dark:bg-gray-800" />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start pl-6"
                                                onClick={() => router.push('/profile')}
                                            >
                                                <User className="h-4 w-4 mr-2" />
                                                Perfil
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start pl-6"
                                                onClick={() => router.push('/settings')}
                                            >
                                                <Settings className="h-4 w-4 mr-2" />
                                                Configurações
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="px-4 pt-4">
                                            <Button
                                                className="w-full mb-2 bg-red-950 hover:bg-red-900 text-white"
                                                onClick={() => {
                                                    setIsMobileMenuOpen(false);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                Entrar
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full border-red-950 text-red-950"
                                                onClick={() => {
                                                    setIsMobileMenuOpen(false);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                Cadastrar-se
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {isLoggedIn && (
                                <SheetFooter className="px-4 py-4 border-t">
                                    <Button
                                        variant="destructive"
                                        className="w-full bg-red-950 hover:bg-red-900"
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sair
                                    </Button>
                                </SheetFooter>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Auth Modal */}
            <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </header>
    );
};

export default Header;