'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { pedidoService } from '@/services/pedidoService';
import { Pedido } from '@/types';

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
    AGUARDANDO_PAGAMENTO: { label: 'Aguardando Pagamento', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
    PAGO: { label: 'Pago', className: 'bg-blue-50 text-blue-700 border border-blue-200' },
    EM_SEPARACAO: { label: 'Em Separação', className: 'bg-purple-50 text-purple-700 border border-purple-200' },
    ENVIADO: { label: 'Enviado', className: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
    ENTREGUE: { label: 'Entregue', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    CANCELADO: { label: 'Cancelado', className: 'bg-red-50 text-red-700 border border-red-200' },
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
        return (
            <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
                Carregando...
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Pedidos</h1>
                    <p className="text-sm text-slate-400 mt-0.5">{pedidos.length} pedido(s) encontrado(s)</p>
                </div>
                <Link
                    href="/dashboard/pedidos/novo"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                    + Novo Pedido
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">#</th>
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Cliente</th>
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Data</th>
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {pedidos.map((pedido) => {
                            const statusInfo = STATUS_LABELS[pedido.status] ?? { label: pedido.status.replace(/_/g, ' '), className: 'bg-slate-50 text-slate-600 border border-slate-200' };
                            return (
                                <tr key={pedido.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4 text-sm font-medium text-slate-800">#{pedido.id}</td>
                                    <td className="px-5 py-4 text-sm text-slate-800">{pedido.cliente?.nome}</td>
                                    <td className="px-5 py-4 text-sm text-slate-500">
                                        {pedido.dataPedido ? new Date(pedido.dataPedido).toLocaleDateString('pt-BR') : '—'}
                                    </td>
                                    <td className="px-5 py-4 text-sm font-medium text-slate-800">
                                        {pedido.total?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
                                            {statusInfo.label}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <Link
                                            href={`/dashboard/pedidos/${pedido.id}`}
                                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                        >
                                            Ver detalhes
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {pedidos.length === 0 && (
                    <div className="text-center py-16 text-slate-400 text-sm">
                        Nenhum pedido cadastrado
                    </div>
                )}
            </div>

            {totalPaginas > 1 && (
                <div className="flex items-center justify-center gap-2 mt-5">
                    <button
                        onClick={() => carregarPedidos(pagina - 1)}
                        disabled={pagina === 0}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        Anterior
                    </button>
                    <span className="px-3 py-1.5 text-sm text-slate-500">
                        {pagina + 1} de {totalPaginas}
                    </span>
                    <button
                        onClick={() => carregarPedidos(pagina + 1)}
                        disabled={pagina === totalPaginas - 1}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
}
