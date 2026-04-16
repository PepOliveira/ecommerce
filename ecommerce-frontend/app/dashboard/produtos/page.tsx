'use client';

import { useEffect, useState } from 'react';
import { produtoService } from '@/services/produtoService';
import { Produto } from '@/types';

export default function ProdutosPage() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);

    async function carregarProdutos(page = 0) {
        try {
            const data = await produtoService.listar(page);
            setProdutos(data.content);
            setTotalPaginas(data.totalPages);
            setPagina(page);
        } catch (error) {
            console.error('Erro ao carregar produtos', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarProdutos();
    }, []);

    if (loading) {
        return <div className="text-center py-8 text-gray-500">Carregando...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
                
                <a
                    href="/dashboard/produtos/novo"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                    + Novo Produto
                </a>
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
                        {produtos.map((produto) => (
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
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {produto.estoque} un
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    <a
                                        href={`/dashboard/produtos/${produto.id}`}
                                        className="text-blue-600 hover:underline mr-3"
                                    >
                                        Editar
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {produtos.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        Nenhum produto cadastrado
                    </div>
                )}
            </div>

            {totalPaginas > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <button
                        onClick={() => carregarProdutos(pagina - 1)}
                        disabled={pagina === 0}
                        className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-600">
                        {pagina + 1} de {totalPaginas}
                    </span>
                    <button
                        onClick={() => carregarProdutos(pagina + 1)}
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