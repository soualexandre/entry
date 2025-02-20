import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';

interface AuthState {
    isLoggedIn: boolean;
    user: {
        email: string;
        name: string;
        phoneNumber: string;
    } | null;
    token: string | null;
    login: (user: AuthState['user'], token: string) => void;
    logout: () => void;
}

const storage: PersistStorage<AuthState> = {
    getItem: (name) => {
        const item = localStorage.getItem(name);
        if (item) {
            return JSON.parse(item);
        }
        return null;
    },
    setItem: (name, value) => {
        localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => {
        localStorage.removeItem(name);
    },
};

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,
            token: null,
            login: (user: AuthState['user'], token: string) => {
                set(() => ({
                    isLoggedIn: true,
                    user,
                    token,
                }));
            },
            logout: () => {
                set(() => ({
                    isLoggedIn: false,
                    user: null,
                    token: null,
                }));
            },
        }),
        {
            name: 'auth-store',
            storage,
        }
    )
);