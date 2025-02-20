"use client";
import { useAuth } from "@/app/hooks/Auth/isLogged";
import { getInitials } from "@/app/utils/user/user";
import { LogOut, Menu, Settings, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import AuthModal from "../AuthModal";
import { Avatar } from "./components/Avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./components/profile/proper";
import useHeaderData from "./hooks/useHeaderData";

const menuRoutes = {
    home: "/",
    eventsList: "/eventsList",
    userTickets: "/userTickets",
    login: "/login",
} as const;

const Header: React.FC = () => {
    const { isLoggedIn, logout } = useAuth();
    const router = useRouter();
    const {
        isLight,
        isMenuOpen,
        isModalOpen,
        headerModel,
        setIsMenuOpen,
        setIsModalOpen,
        setHeaderModel,
    } = useHeaderData();

    const menuItems = isLoggedIn ? ["Home", "Events", "Minhas Entradas"] : ["Home", "Events", "Login"];
    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : null;

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${headerModel === "white" ? "bg-white shadow-md" : "bg-transparent"}`}>
            <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/">
                    <span className={`text-2xl font-bold ${isLight ? "text-blue-600" : "text-white"}`}>
                        Entry
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {menuItems.map((item) => {
                        const route =
                            Object.entries(menuRoutes).find(([key]) => key.toLowerCase() === item.toLowerCase().replace(" ", ""))?.[1] || "/";

                        return item === "Login" ? (
                            <button
                                key={item}
                                onClick={() => setIsModalOpen(true)}
                                className={`hover:opacity-75 transition ${isLight ? "text-gray-700" : "text-white"}`}
                            >
                                {item}
                            </button>
                        ) : (
                            <Link
                                key={item}
                                href={route}
                                className={`hover:opacity-75 transition ${isLight ? "text-gray-700" : "text-white"}`}
                            >
                                {item}
                            </Link>
                        );
                    })}
                    {isLoggedIn && (
                        <Popover>
                            <PopoverTrigger>
                                <Avatar className="bg-blue-500 text-white">
                                    {getInitials(user?.name || "")}
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-48">
                                <button className="flex items-center w-full p-2 hover:bg-gray-100">
                                    <Settings className="mr-2" /> Configurações
                                </button>
                                <button onClick={logout} className="flex items-center w-full p-2 hover:bg-gray-100">
                                    <LogOut className="mr-2" /> Sair
                                </button>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>

                <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </nav>

            <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </header>
    );
};

export default Header;