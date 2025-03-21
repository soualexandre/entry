import { ApiResponse, Event } from "eventsList/types/event";
import api from "../../config/axios_config";
import { NextApiResponse } from "next";

class EventService {
    static async get() {
        try {
            const response = await api.get('/events');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao fazer login');
        }
    }
    static async getById(id: string): Promise<Event | undefined> {
        try {
            const response: ApiResponse<Event> = await api.get(`/events/${id}`);
            return response.data;
        } catch (error: any) {
            console.log("error", error);
            // throw new Error(error.response || 'Erro ao buscar evnto pe ID');
        }
    }

}

export default EventService;