'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700 text-sm">
                    ← Voltar
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Novo Pedido</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    {erro && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{erro}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                            <select
                                value={clienteId}
                                onChange={(e) => setClienteId(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecione um cliente</option>
                                {clientes.map(c => (
                                    <option key={c.id} value={c.id}>{c.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="border-t pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Adicionar produto
                            </label>
                            <div className="flex gap-2">
                                <select
                                    value={produtoSelecionado}
                                    onChange={(e) => setProdutoSelecionado(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Selecione um produto</option>
                                    {produtos.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.nome} — R$ {p.preco.toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={quantidade}
                                    onChange={(e) => setQuantidade(Number(e.target.value))}
                                    min="1"
                                    className="w-16 border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={adicionarItem}
                                    disabled={!produtoSelecionado}
                                    className="px-3 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200 disabled:opacity-50"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Criando...' : 'Criar Pedido'}
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="font-medium text-gray-800 mb-4">Itens do pedido</h2>

                    {itens.length === 0 ? (
                        <p className="text-gray-500 text-sm">Nenhum item adicionado</p>
                    ) : (
                        <div className="space-y-3">
                            {itens.map((item) => (
                                <div key={item.produto.id} className="flex items-center justify-between border-b pb-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{item.produto.nome}</p>
                                        <p className="text-xs text-gray-500">
                                            {item.quantidade}x R$ {item.produto.preco.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-gray-800">
                                            R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => removerItem(item.produto.id!)}
                                            className="text-red-400 hover:text-red-600 text-xs"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-between pt-2">
                                <span className="font-medium text-gray-800">Total</span>
                                <span className="font-bold text-gray-800">R$ {total.toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}