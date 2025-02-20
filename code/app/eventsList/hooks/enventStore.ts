import { create } from 'zustand';
import { Event } from '../types/event';

interface EventStore {
    eventById: Event | null;
    events: Event[] | null;
    loading: boolean;
    error: string | null;
    setEvents: (events: Event[]) => void;
    setEventById: (event: Event) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useEventStore = create<EventStore>((set) => ({
    eventById: null,
    events: null,
    loading: false,
    error: null,
    setEventById: (eventById) => set({ eventById }),
    setEvents: (events) => set({ events }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}));
