
import api from "../../config/axios_config";

class AuthService {
    static async login(credentials: { email: string; password: string }) {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao fazer login');
        }
    }

    static async register(userData: { email: string; password: string }) {
        try {
            const response = await api.post('/user', userData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao registrar usuário');
        }
    }
}

export default AuthService;