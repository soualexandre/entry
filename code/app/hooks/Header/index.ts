import { create } from "zustand";

interface HeaderState {
    isMenuOpen: boolean;
    isModalOpen: boolean;
    isLight: boolean;
    headerModel: "transparent" | "white";
    setIsMenuOpen: (open: boolean) => void;
    setIsModalOpen: (open: boolean) => void;
    setHeaderModel: (model: "transparent" | "white") => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
    isMenuOpen: false,
    isModalOpen: false,
    isLight: false,
    headerModel: "transparent",
    setIsMenuOpen: (open) => set({ isMenuOpen: open }),
    setIsModalOpen: (open) => set({ isModalOpen: open }),
    setHeaderModel: (model) => set({ headerModel: model, isLight: model === "white" }),
}));
