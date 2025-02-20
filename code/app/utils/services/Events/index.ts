import api from "../../config/axios_config";

class EventService {
    static async get() {
        try {
            const response = await api.get('/events');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao fazer login');
        }
    }
    static async getById(id: string) {
        try {
            const response = await api.get(`/events/${id}`);
            return response;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao fazer login');
        }
    }

}

export default EventService;