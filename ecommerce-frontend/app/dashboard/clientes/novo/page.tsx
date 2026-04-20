'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
            <div className="flex items-center gap-2 mb-6">
                <Link href="/dashboard/clientes" className="text-slate-400 hover:text-slate-600 text-sm transition">
                    ← Voltar
                </Link>
                <span className="text-slate-300">/</span>
                <h1 className="text-xl font-bold text-slate-800">Novo Cliente</h1>
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Salvando...' : 'Salvar Cliente'}
                    </button>
                </form>
            </div>
        </div>
    );
}
