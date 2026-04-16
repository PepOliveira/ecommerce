import api from './api';
import Cookies from 'js-cookie';

export const authService = {
    async login(email: string, senha: string): Promise<string> {
        const response = await api.post('/auth/login', { email, senha });
        const token = response.data;
        Cookies.set('token', token, { expires: 1 });
        return token;
    },

    async registro(nome: string, email: string, senha: string): Promise<string> {
        const response = await api.post('/auth/registro', { nome, email, senha });
        const token = response.data;
        Cookies.set('token', token, { expires: 1 });
        return token;
    },

    logout() {
        Cookies.remove('token');
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    },

    isAuthenticated(): boolean {
        return !!Cookies.get('token');
    }
};