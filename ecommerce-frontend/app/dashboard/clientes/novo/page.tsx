'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clienteService } from '@/services/clienteService';

export default function NovoClientePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [form, setForm] = useState({
        nome: '',
        email: '',
        cpf: '',
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let { name, value } = e.target;
        if (name === 'cpf') {
            value = value.replace(/\D/g, '').slice(0, 11);
            value = value
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        setForm({ ...form, [name]: value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErro('');
        setLoading(true);
        try {
            await clienteService.criar({
                nome: form.nome,
                email: form.email,
                cpf: form.cpf,
            });
            router.push('/dashboard/clientes');
        } catch {
            setErro('Erro ao criar cliente. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => router.back()}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                >
                    ← Voltar
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Novo Cliente</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 max-w-lg">
                {erro && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                        {erro}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome
                        </label>
                        <input
                            type="text"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            CPF
                        </label>
                        <input
                            type="text"
                            name="cpf"
                            value={form.cpf}
                            onChange={handleChange}
                            placeholder="000.000.000-00"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : 'Salvar Cliente'}
                    </button>
                </form>
            </div>
        </div>
    );
}
