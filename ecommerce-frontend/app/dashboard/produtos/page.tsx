'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { produtoService } from '@/services/produtoService';
import { Produto } from '@/types';

export default function ProdutosPage() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [busca, setBusca] = useState('');
    const [precoMin, setPrecoMin] = useState('');
    const [precoMax, setPrecoMax] = useState('');
    const [modo, setModo] = useState<'todos' | 'nome' | 'preco'>('todos');

    async function carregarProdutos(page = 0) {
        try {
            setLoading(true);
            const data = await produtoService.listar(page);
            setProdutos(data.content || []);
            setTotalPaginas(data.totalPages || 0);
            setPagina(page);
            setModo('todos');
        } catch (error) {
            console.error('Erro ao carregar produtos', error);
        } finally {
            setLoading(false);
        }
    }

    async function buscarPorNome(page = 0) {
        if (!busca.trim()) { carregarProdutos(); return; }
        try {
            setLoading(true);
            const data = await produtoService.buscarPorNome(busca, page);
            setProdutos(data.content || []);
            setTotalPaginas(data.totalPages || 0);
            setPagina(page);
            setModo('nome');
        } catch (error) {
            console.error('Erro ao buscar produtos', error);
        } finally {
            setLoading(false);
        }
    }

    async function buscarPorPreco(page = 0) {
        if (!precoMin || !precoMax) return;
        try {
            setLoading(true);
            const data = await produtoService.buscarPorPreco(
                parseFloat(precoMin),
                parseFloat(precoMax),
                page
            );
            setProdutos(data.content || []);
            setTotalPaginas(data.totalPages || 0);
            setPagina(page);
            setModo('preco');
        } catch (error) {
            console.error('Erro ao filtrar produtos', error);
        } finally {
            setLoading(false);
        }
    }

    function limparFiltros() {
        setBusca('');
        setPrecoMin('');
        setPrecoMax('');
        carregarProdutos();
    }

    function proximaPagina(page: number) {
        if (modo === 'nome') buscarPorNome(page);
        else if (modo === 'preco') buscarPorPreco(page);
        else carregarProdutos(page);
    }

    useEffect(() => {
        carregarProdutos();
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
                <Link
                    href="/dashboard/produtos/novo"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                    + Novo Produto
                </Link>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                <div className="flex flex-wrap gap-3">
                    {/* Busca por nome */}
                    <div className="flex gap-2 flex-1 min-w-48">
                        <input
                            type="text"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && buscarPorNome()}
                            placeholder="Buscar por nome..."
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => buscarPorNome()}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                        >
                            Buscar
                        </button>
                    </div>

                    {/* Filtro por preço */}
                    <div className="flex gap-2 items-center">
                        <input
                            type="number"
                            value={precoMin}
                            onChange={(e) => setPrecoMin(e.target.value)}
                            placeholder="Preço min"
                            className="w-28 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-500 text-sm">até</span>
                        <input
                            type="number"
                            value={precoMax}
                            onChange={(e) => setPrecoMax(e.target.value)}
                            placeholder="Preço max"
                            className="w-28 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => buscarPorPreco()}
                            disabled={!precoMin || !precoMax}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                            Filtrar
                        </button>
                    </div>

                    {/* Limpar filtros */}
                    {modo !== 'todos' && (
                        <button
                            onClick={limparFiltros}
                            className="px-3 py-2 border border-gray-300 text-gray-600 rounded-md text-sm hover:bg-gray-50"
                        >
                            Limpar filtros
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Nome</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Descrição</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Preço</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Estoque</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">
                                    Carregando...
                                </td>
                            </tr>
                        ) : produtos.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">
                                    Nenhum produto encontrado
                                </td>
                            </tr>
                        ) : (
                            produtos.map((produto) => (
                                <tr key={produto.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-800">{produto.nome}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{produto.descricao}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800">
                                        R$ {produto.preco.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            produto.estoque > 10
                                                ? 'bg-green-100 text-green-700'
                                                : produto.estoque > 0
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {produto.estoque} un
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <Link
                                            href={`/dashboard/produtos/${produto.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Editar
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPaginas > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <button
                        onClick={() => proximaPagina(pagina - 1)}
                        disabled={pagina === 0}
                        className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-600">
                        {pagina + 1} de {totalPaginas}
                    </span>
                    <button
                        onClick={() => proximaPagina(pagina + 1)}
                        disabled={pagina === totalPaginas - 1}
                        className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
}