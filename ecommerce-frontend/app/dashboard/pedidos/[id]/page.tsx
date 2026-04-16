'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { pedidoService } from '@/services/pedidoService';
import { Pedido } from '@/types';

const STATUS_OPTIONS = [
    'AGUARDANDO_PAGAMENTO',
    'PAGO',
    'EM_SEPARACAO',
    'ENVIADO',
    'ENTREGUE',
    'CANCELADO',
];

const STATUS_CORES: Record<string, string> = {
    AGUARDANDO_PAGAMENTO: 'bg-yellow-100 text-yellow-700',
    PAGO: 'bg-blue-100 text-blue-700',
    EM_SEPARACAO: 'bg-purple-100 text-purple-700',
    ENVIADO: 'bg-orange-100 text-orange-700',
    ENTREGUE: 'bg-green-100 text-green-700',
    CANCELADO: 'bg-red-100 text-red-700',
};

export default function DetalhesPedidoPage() {
    const router = useRouter();
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
        try {
            const atualizado = await pedidoService.atualizarStatus(id, novoStatus);
            setPedido(atualizado);
        } catch {
            setErro('Erro ao atualizar status');
        } finally {
            setAtualizando(false);
        }
    }

    if (loading) return <div className="text-center py-8 text-gray-500">Carregando...</div>;
    if (!pedido) return <div className="text-center py-8 text-red-500">{erro}</div>;

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700 text-sm">
                    ← Voltar
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Pedido #{pedido.id}</h1>
                <span className={`px-2 py-1 rounded-full text-xs ${STATUS_CORES[pedido.status]}`}>
                    {pedido.status.replace(/_/g, ' ')}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="font-medium text-gray-800 mb-4">Informações</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Cliente</span>
                            <span className="text-gray-800">{pedido.cliente.nome}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Email</span>
                            <span className="text-gray-800">{pedido.cliente.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Data</span>
                            <span className="text-gray-800">
                                {new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Total</span>
                            <span className="font-bold text-gray-800">R$ {pedido.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="border-t mt-4 pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Atualizar status
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={novoStatus}
                                onChange={(e) => setNovoStatus(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {STATUS_OPTIONS.map(s => (
                                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleAtualizarStatus}
                                disabled={atualizando || novoStatus === pedido.status}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                            >
                                {atualizando ? '...' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="font-medium text-gray-800 mb-4">Itens</h2>
                    <div className="space-y-3">
                        {pedido.itens.map((item) => (
                            <div key={item.id} className="flex justify-between border-b pb-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{item.produto.nome}</p>
                                    <p className="text-xs text-gray-500">
                                        {item.quantidade}x R$ {item.precoUnitario.toFixed(2)}
                                    </p>
                                </div>
                                <span className="text-sm font-medium text-gray-800">
                                    R$ {item.subtotal.toFixed(2)}
                                </span>
                            </div>
                        ))}
                        <div className="flex justify-between pt-2">
                            <span className="font-medium text-gray-800">Total</span>
                            <span className="font-bold text-gray-800">R$ {pedido.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}