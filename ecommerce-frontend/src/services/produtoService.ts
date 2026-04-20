import api from './api';
import { Produto, PageResponse } from '@/types';

export const produtoService = {
    async listar(page = 0, size = 10): Promise<PageResponse<Produto>> {
        const response = await api.get(`/produtos?page=${page}&size=${size}`);
        return response.data;
    },

    async buscarPorId(id: number): Promise<Produto> {
        const response = await api.get(`/produtos/${id}`);
        return response.data;
    },

    async criar(produto: Produto): Promise<Produto> {
        const response = await api.post('/produtos', produto);
        return response.data;
    },

    async atualizar(id: number, produto: Produto): Promise<Produto> {
        const response = await api.put(`/produtos/${id}`, produto);
        return response.data;
    },

    async deletar(id: number): Promise<void> {
        await api.delete(`/produtos/${id}`);
    },

    async buscarPorNome(nome: string, page = 0): Promise<PageResponse<Produto>> {
        const response = await api.get(`/produtos/buscar?nome=${nome}&page=${page}`);
        return response.data;
    },

    async buscarPorPreco(precoMin: number, precoMax: number, page = 0): Promise<PageResponse<Produto>> {
    const response = await api.get(`/produtos/preco?precoMin=${precoMin}&precoMax=${precoMax}&page=${page}`);
    return response.data;
    }
};