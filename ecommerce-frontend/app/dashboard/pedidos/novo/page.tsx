'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { pedidoService } from '@/services/pedidoService';
import { clienteService } from '@/services/clienteService';
import { produtoService } from '@/services/produtoService';
import { Cliente, Produto } from '@/types';

interface ItemForm {
    produto: Produto;
    quantidade: number;
}

export default function NovoPedidoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [clienteId, setClienteId] = useState('');
    const [itens, setItens] = useState<ItemForm[]>([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState('');
    const [quantidade, setQuantidade] = useState(1);

    useEffect(() => {
        async function carregar() {
            const [c, p] = await Promise.all([
                clienteService.listar(0, 100),
                produtoService.listar(0, 100),
            ]);
            setClientes(c.content);
            setProdutos(p.content);
        }
        carregar();
    }, []);

    function adicionarItem() {
        const produto = produtos.find(p => p.id === Number(produtoSelecionado));
        if (!produto) return;

        const jaExiste = itens.find(i => i.produto.id === produto.id);
        if (jaExiste) {
            setItens(itens.map(i =>
                i.produto.id === produto.id
                    ? { ...i, quantidade: i.quantidade + quantidade }
                    : i
            ));
        } else {
            setItens([...itens, { produto, quantidade }]);
        }
        setProdutoSelecionado('');
        setQuantidade(1);
    }

    function removerItem(produtoId: number) {
        setItens(itens.filter(i => i.produto.id !== produtoId));
    }

    const total = itens.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!clienteId) { setErro('Selecione um cliente'); return; }
        if (itens.length === 0) { setErro('Adicione pelo menos um produto'); return; }

        setErro('');
        setLoading(true);
        try {
            await pedidoService.criar({
                cliente: { id: Number(clienteId) } as Cliente,
                itens: itens.map(i => ({
                    produto: { id: i.produto.id } as Produto,
                    quantidade: i.quantidade,
                    precoUnitario: i.produto.preco,
                    subtotal: i.produto.preco * i.quantidade,
                })),
                total,
            });
            router.push('/dashboard/pedidos');
        } catch {
            setErro('Erro ao criar pedido. Verifique o estoque dos produtos.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="flex items-center gap-2 mb-6">
                <Link href="/dashboard/pedidos" className="text-slate-400 hover:text-slate-600 text-sm transition">
                    ← Voltar
                </Link>
                <span className="text-slate-300">/</span>
                <h1 className="text-xl font-bold text-slate-800">Novo Pedido</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    {erro && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm">
                            {erro}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Cliente</label>
                            <select
                                value={clienteId}
                                onChange={(e) => setClienteId(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            >
                                <option value="">Selecione um cliente</option>
                                {clientes.map(c => (
                                    <option key={c.id} value={c.id}>{c.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="border-t border-slate-100 pt-5">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Adicionar produto
                            </label>
                            <div className="flex gap-2">
                                <select
                                    value={produtoSelecionado}
                                    onChange={(e) => setProdutoSelecionado(e.target.value)}
                                    className="flex-1 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                >
                                    <option value="">Selecione um produto</option>
                                    {produtos.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.nome} — {p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={quantidade}
                                    onChange={(e) => setQuantidade(Number(e.target.value))}
                                    min="1"
                                    className="w-16 border border-slate-300 rounded-lg px-2 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                />
                                <button
                                    type="button"
                                    onClick={adicionarItem}
                                    disabled={!produtoSelecionado}
                                    className="px-3 py-2.5 bg-slate-100 rounded-lg text-sm font-medium hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Criando...' : 'Criar Pedido'}
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">Itens do pedido</h2>

                    {itens.length === 0 ? (
                        <p className="text-slate-400 text-sm">Nenhum item adicionado</p>
                    ) : (
                        <div className="space-y-3">
                            {itens.map((item) => (
                                <div key={item.produto.id} className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">{item.produto.nome}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {item.quantidade}x {item.produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-slate-800">
                                            {(item.produto.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </span>
                                        <button
                                            onClick={() => removerItem(item.produto.id!)}
                                            className="text-slate-300 hover:text-red-500 text-xs transition"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-between pt-2">
                                <span className="text-sm font-semibold text-slate-700">Total</span>
                                <span className="text-sm font-bold text-slate-800">
                                    {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
