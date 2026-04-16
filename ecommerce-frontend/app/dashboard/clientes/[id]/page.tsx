'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { clienteService } from '@/services/clienteService';

export default function EditarClientePage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');
    const [form, setForm] = useState({
        nome: '',
        email: '',
        cpf: '',
    });

    useEffect(() => {
        async function carregar() {
            try {
                const cliente = await clienteService.buscarPorId(id);
                setForm({
                    nome: cliente.nome,
                    email: cliente.email,
                    cpf: cliente.cpf,
                });
            } catch {
                setErro('Cliente não encontrado');
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, [id]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErro('');
        setSalvando(true);
        try {
            await clienteService.atualizar(id, form);
            router.push('/dashboard/clientes');
        } catch {
            setErro('Erro ao atualizar cliente.');
        } finally {
            setSalvando(false);
        }
    }

    async function handleDeletar() {
        if (!confirm('Tem certeza que deseja deletar este cliente?')) return;
        try {
            await clienteService.deletar(id);
            router.push('/dashboard/clientes');
        } catch {
            setErro('Erro ao deletar cliente.');
        }
    }

    if (loading) {
        return <div className="text-center py-8 text-gray-500">Carregando...</div>;
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
                <h1 className="text-2xl font-bold text-gray-800">Editar Cliente</h1>
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

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={salvando}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {salvando ? 'Salvando...' : 'Salvar'}
                        </button>
                        <button
                            type="button"
                            onClick={handleDeletar}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition"
                        >
                            Deletar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}