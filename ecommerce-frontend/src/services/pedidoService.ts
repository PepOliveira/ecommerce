import api from './api';
import { Pedido, PageResponse } from '@/types';

export const pedidoService = {
    async listar(page = 0, size = 10): Promise<PageResponse<Pedido>> {
        const response = await api.get(`/pedidos?page=${page}&size=${size}`);
        return response.data;
    },

    async buscarPorId(id: number): Promise<Pedido> {
        const response = await api.get(`/pedidos/${id}`);
        return response.data;
    },

    async criar(pedido: Partial<Pedido>): Promise<Pedido> {
        const response = await api.post('/pedidos', pedido);
        return response.data;
    },

    async atualizarStatus(id: number, status: string): Promise<Pedido> {
        const response = await api.patch(`/pedidos/${id}/status`, status, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    },

    async buscarPorStatus(status: string, page = 0): Promise<PageResponse<Pedido>> {
        const response = await api.get(`/pedidos/status/${status}?page=${page}`);
        return response.data;
    }
};