import api from "../../config/axios_config";
import { showToast, TOAST_TYPES } from "../../toast/toast";

class TicketService {
    static async create(createData: any): Promise<any> {
        try {
            const response = await api.post('/ticket', createData);
            if (!response) {
                showToast("Operação com Erro!", TOAST_TYPES.ERROR);
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao fazer login');
        }
    }


}

export default TicketService;