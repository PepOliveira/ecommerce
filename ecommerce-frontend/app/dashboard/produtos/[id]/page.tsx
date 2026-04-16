'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { produtoService } from '@/services/produtoService';

export default function EditarProdutoPage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');
    const [form, setForm] = useState({
        nome: '',
        descricao: '',
        preco: '',
        estoque: '',
    });

    useEffect(() => {
        async function carregar() {
            try {
                const produto = await produtoService.buscarPorId(id);
                setForm({
                    nome: produto.nome,
                    descricao: produto.descricao,
                    preco: String(produto.preco),
                    estoque: String(produto.estoque),
                });
            } catch {
                setErro('Produto não encontrado');
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, [id]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErro('');
        setSalvando(true);
        try {
            await produtoService.atualizar(id, {
                nome: form.nome,
                descricao: form.descricao,
                preco: parseFloat(form.preco),
                estoque: parseInt(form.estoque),
            });
            router.push('/dashboard/produtos');
        } catch {
            setErro('Erro ao atualizar produto.');
        } finally {
            setSalvando(false);
        }
    }

    async function handleDeletar() {
        if (!confirm('Tem certeza que deseja deletar este produto?')) return;
        try {
            await produtoService.deletar(id);
            router.push('/dashboard/produtos');
        } catch {
            setErro('Erro ao deletar produto.');
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
                <h1 className="text-2xl font-bold text-gray-800">Editar Produto</h1>
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
                            Descrição
                        </label>
                        <textarea
                            name="descricao"
                            value={form.descricao}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Preço (R$)
                            </label>
                            <input
                                type="number"
                                name="preco"
                                value={form.preco}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estoque
                            </label>
                            <input
                                type="number"
                                name="estoque"
                                value={form.estoque}
                                onChange={handleChange}
                                min="0"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
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