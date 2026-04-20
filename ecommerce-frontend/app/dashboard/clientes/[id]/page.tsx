'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
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
        return <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Carregando...</div>;
    }

    return (
        <div>
            <div className="flex items-center gap-2 mb-6">
                <Link href="/dashboard/clientes" className="text-slate-400 hover:text-slate-600 text-sm transition">
                    ← Voltar
                </Link>
                <span className="text-slate-300">/</span>
                <h1 className="text-xl font-bold text-slate-800">Editar Cliente</h1>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg">
                {erro && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm">
                        {erro}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome</label>
                        <input
                            type="text"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">CPF</label>
                        <input
                            type="text"
                            name="cpf"
                            value={form.cpf}
                            onChange={handleChange}
                            placeholder="000.000.000-00"
                            className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            type="submit"
                            disabled={salvando}
                            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {salvando ? 'Salvando...' : 'Salvar'}
                        </button>
                        <button
                            type="button"
                            onClick={handleDeletar}
                            className="px-4 py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition"
                        >
                            Deletar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
