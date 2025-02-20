import { useEventStore } from './enventStore';

const useEvents = () => {
    const { events, setEvents, loading, setLoading, error, setError, eventById, setEventById } = useEventStore();

    return { events, loading, error, setEvents, setLoading, setError, eventById, setEventById };
};

export default useEvents;
