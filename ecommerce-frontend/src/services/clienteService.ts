import api from './api';
import { Cliente, PageResponse } from '@/types';

export const clienteService = {
    async listar(page = 0, size = 10): Promise<PageResponse<Cliente>> {
        const response = await api.get(`/clientes?page=${page}&size=${size}`);
        return response.data;
    },

    async buscarPorId(id: number): Promise<Cliente> {
        const response = await api.get(`/clientes/${id}`);
        return response.data;
    },

    async criar(cliente: Cliente): Promise<Cliente> {
        const response = await api.post('/clientes', cliente);
        return response.data;
    },

    async atualizar(id: number, cliente: Cliente): Promise<Cliente> {
        const response = await api.put(`/clientes/${id}`, cliente);
        return response.data;
    },

    async deletar(id: number): Promise<void> {
        await api.delete(`/clientes/${id}`);
    }
};