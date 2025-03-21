"use client"
import { useEffect } from "react";
import { useHeaderStore } from "../../../hooks/Header";
import { useAuth } from "../../../hooks/Auth/isLogged";

const useHeaderData = () => {
    const { isLoggedIn } = useAuth();
    const { headerModel, setHeaderModel, setIsModalOpen } = useHeaderStore();

    useEffect(() => {
        const updateHeader = () => {
            if (headerModel === "white") {
                useHeaderStore.setState({ isLight: true });
            } else {
                const scrolled = window.scrollY > 50;
                useHeaderStore.setState({ isLight: scrolled });
            }
        };

        const handleScroll = () => {
            if (headerModel === "transparent") updateHeader();
        };

        if (headerModel === "transparent") {
            window.addEventListener("scroll", handleScroll);
        }

        updateHeader();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [headerModel]);

    useEffect(() => {
        if (isLoggedIn) setIsModalOpen(false);
    }, [isLoggedIn, setIsModalOpen]);

    return useHeaderStore();
};

export default useHeaderData;