'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { pedidoService } from '@/services/pedidoService';
import { Pedido } from '@/types';

const STATUS_CORES: Record<string, string> = {
    AGUARDANDO_PAGAMENTO: 'bg-yellow-100 text-yellow-700',
    PAGO: 'bg-blue-100 text-blue-700',
    EM_SEPARACAO: 'bg-purple-100 text-purple-700',
    ENVIADO: 'bg-orange-100 text-orange-700',
    ENTREGUE: 'bg-green-100 text-green-700',
    CANCELADO: 'bg-red-100 text-red-700',
};

export default function PedidosPage() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);

    async function carregarPedidos(page = 0) {
        try {
            setLoading(true);
            const data = await pedidoService.listar(page);
            setPedidos(data.content || []);
            setTotalPaginas(data.totalPages || 0);
            setPagina(page);
        } catch (error) {
            console.error('Erro ao carregar pedidos', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarPedidos();
    }, []);

    if (loading) {
        return <div className="text-center py-8 text-gray-500">Carregando...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
                <Link
                    href="/dashboard/pedidos/novo"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                    + Novo Pedido
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">#</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Cliente</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Total</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Data</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map((pedido) => (
                            <tr key={pedido.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-800">#{pedido.id}</td>
                                <td className="px-4 py-3 text-sm text-gray-800">
                                    {pedido.cliente.nome}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-800">
                                    R$ {pedido.total.toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs ${STATUS_CORES[pedido.status] || 'bg-gray-100 text-gray-700'}`}>
                                        {pedido.status.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    <Link
                                        href={`/dashboard/pedidos/${pedido.id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Ver
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {pedidos.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        Nenhum pedido encontrado
                    </div>
                )}
            </div>

            {totalPaginas > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <button
                        onClick={() => carregarPedidos(pagina - 1)}
                        disabled={pagina === 0}
                        className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-600">
                        {pagina + 1} de {totalPaginas}
                    </span>
                    <button
                        onClick={() => carregarPedidos(pagina + 1)}
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