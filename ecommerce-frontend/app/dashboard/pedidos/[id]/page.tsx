'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { pedidoService } from '@/services/pedidoService';
import { Pedido } from '@/types';

const STATUS_OPTIONS = [
    { value: 'AGUARDANDO_PAGAMENTO', label: 'Aguardando Pagamento' },
    { value: 'PAGO', label: 'Pago' },
    { value: 'EM_SEPARACAO', label: 'Em Separação' },
    { value: 'ENVIADO', label: 'Enviado' },
    { value: 'ENTREGUE', label: 'Entregue' },
    { value: 'CANCELADO', label: 'Cancelado' },
];

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
    AGUARDANDO_PAGAMENTO: { label: 'Aguardando Pagamento', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
    PAGO: { label: 'Pago', className: 'bg-blue-50 text-blue-700 border border-blue-200' },
    EM_SEPARACAO: { label: 'Em Separação', className: 'bg-purple-50 text-purple-700 border border-purple-200' },
    ENVIADO: { label: 'Enviado', className: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
    ENTREGUE: { label: 'Entregue', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    CANCELADO: { label: 'Cancelado', className: 'bg-red-50 text-red-700 border border-red-200' },
};

export default function DetalhesPedidoPage() {
    const params = useParams();
    const id = Number(params.id);
    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [loading, setLoading] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState('');
    const [novoStatus, setNovoStatus] = useState('');

    useEffect(() => {
        if (isNaN(id)) { setLoading(false); return; }
        async function carregar() {
            try {
                const data = await pedidoService.buscarPorId(id);
                setPedido(data);
                setNovoStatus(data.status);
            } catch {
                setErro('Pedido não encontrado');
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, [id]);

    async function handleAtualizarStatus() {
        if (!pedido || novoStatus === pedido.status) return;
        setAtualizando(true);
        setErro('');
        try {
            const atualizado = await pedidoService.atualizarStatus(id, novoStatus);
            setPedido(atualizado);
        } catch {
            setErro('Erro ao atualizar status');
        } finally {
            setAtualizando(false);
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Carregando...</div>;
    }

    if (!pedido) {
        return (
            <div className="flex items-center justify-center py-20 text-red-500 text-sm">
                {erro || 'Pedido não encontrado'}
            </div>
        );
    }

    const statusInfo = STATUS_LABELS[pedido.status] ?? { label: pedido.status.replace(/_/g, ' '), className: 'bg-slate-50 text-slate-600 border border-slate-200' };

    return (
        <div>
            <div className="flex items-center gap-2 mb-6">
                <Link href="/dashboard/pedidos" className="text-slate-400 hover:text-slate-600 text-sm transition">
                    ← Voltar
                </Link>
                <span className="text-slate-300">/</span>
                <h1 className="text-xl font-bold text-slate-800">Pedido #{pedido.id}</h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
                    {statusInfo.label}
                </span>
            </div>

            {erro && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm">
                    {erro}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">Informações</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Cliente</span>
                            <span className="font-medium text-slate-800">{pedido.cliente.nome}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Email</span>
                            <span className="text-slate-600">{pedido.cliente.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Data</span>
                            <span className="text-slate-600">
                                {new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                        <div className="flex justify-between border-t border-slate-100 pt-3 mt-1">
                            <span className="font-semibold text-slate-700">Total</span>
                            <span className="font-bold text-slate-800">
                                {pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 mt-5 pt-5">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Atualizar status
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={novoStatus}
                                onChange={(e) => setNovoStatus(e.target.value)}
                                className="flex-1 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            >
                                {STATUS_OPTIONS.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleAtualizarStatus}
                                disabled={atualizando || novoStatus === pedido.status}
                                className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {atualizando ? '...' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">Itens do pedido</h2>
                    <div className="space-y-3">
                        {pedido.itens.map((item) => (
                            <div key={item.id} className="flex justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{item.produto.nome}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {item.quantidade}x {item.precoUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </p>
                                </div>
                                <span className="text-sm font-medium text-slate-800">
                                    {item.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                        ))}
                        <div className="flex justify-between pt-2">
                            <span className="text-sm font-semibold text-slate-700">Total</span>
                            <span className="text-sm font-bold text-slate-800">
                                {pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
