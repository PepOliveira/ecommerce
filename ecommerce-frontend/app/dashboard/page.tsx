'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';

interface Metricas {
    totalProdutos: number;
    totalClientes: number;
    totalPedidos: number;
    faturamentoTotal: number;
    produtosEstoqueBaixo: number;
    pedidosPorStatus: Record<string, number>;
}

const STATUS_CORES: Record<string, string> = {
    AGUARDANDO_PAGAMENTO: 'bg-yellow-100 text-yellow-700',
    PAGO: 'bg-blue-100 text-blue-700',
    EM_SEPARACAO: 'bg-purple-100 text-purple-700',
    ENVIADO: 'bg-orange-100 text-orange-700',
    ENTREGUE: 'bg-green-100 text-green-700',
    CANCELADO: 'bg-red-100 text-red-700',
};

export default function DashboardPage() {
    const [metricas, setMetricas] = useState<Metricas | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregar() {
            try {
                const response = await api.get('/dashboard/metricas');
                setMetricas(response.data);
            } catch (error) {
                console.error('Erro ao carregar métricas', error);
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, []);

    if (loading) {
        return <div className="text-center py-8 text-gray-500">Carregando...</div>;
    }

    if (!metricas) {
        return <div className="text-center py-8 text-red-500">Erro ao carregar métricas</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

            {/* Cards de métricas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm border p-5">
                    <p className="text-sm text-gray-500 mb-1">Total de produtos</p>
                    <p className="text-3xl font-bold text-gray-800">{metricas.totalProdutos}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-5">
                    <p className="text-sm text-gray-500 mb-1">Total de clientes</p>
                    <p className="text-3xl font-bold text-gray-800">{metricas.totalClientes}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-5">
                    <p className="text-sm text-gray-500 mb-1">Total de pedidos</p>
                    <p className="text-3xl font-bold text-gray-800">{metricas.totalPedidos}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-5">
                    <p className="text-sm text-gray-500 mb-1">Faturamento total</p>
                    <p className="text-3xl font-bold text-green-600">
                        R$ {metricas.faturamentoTotal.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pedidos por status */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="font-medium text-gray-800 mb-4">Pedidos por status</h2>
                    <div className="space-y-3">
                        {Object.entries(metricas.pedidosPorStatus).map(([status, quantidade]) => (
                            <div key={status} className="flex items-center justify-between">
                                <span className={`px-2 py-1 rounded-full text-xs ${STATUS_CORES[status] || 'bg-gray-100 text-gray-700'}`}>
                                    {status.replace(/_/g, ' ')}
                                </span>
                                <span className="font-medium text-gray-800">{quantidade}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alertas */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="font-medium text-gray-800 mb-4">Alertas</h2>
                    <div className="space-y-3">
                        {metricas.produtosEstoqueBaixo > 0 ? (
                            <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-lg p-3">
                                <span className="text-red-500 text-lg">⚠️</span>
                                <div>
                                    <p className="text-sm font-medium text-red-700">
                                        Estoque baixo
                                    </p>
                                    <p className="text-xs text-red-600">
                                        {metricas.produtosEstoqueBaixo} produto(s) com menos de 10 unidades
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-lg p-3">
                                <span className="text-green-500 text-lg">✅</span>
                                <p className="text-sm text-green-700">Todos os produtos com estoque ok</p>
                            </div>
                        )}

                        {metricas.pedidosPorStatus['AGUARDANDO_PAGAMENTO'] > 0 && (
                            <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                                <span className="text-yellow-500 text-lg">⏳</span>
                                <div>
                                    <p className="text-sm font-medium text-yellow-700">
                                        Pedidos aguardando pagamento
                                    </p>
                                    <p className="text-xs text-yellow-600">
                                        {metricas.pedidosPorStatus['AGUARDANDO_PAGAMENTO']} pedido(s) pendentes
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}