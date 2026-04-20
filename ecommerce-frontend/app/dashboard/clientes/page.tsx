'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { clienteService } from '@/services/clienteService';
import { Cliente } from '@/types';

export default function ClientesPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);

    async function carregarClientes(page = 0) {
        try {
            setLoading(true);
            const data = await clienteService.listar(page);
            setClientes(data.content || []);
            setTotalPaginas(data.totalPages || 0);
            setPagina(page);
        } catch (error) {
            console.error('Erro ao carregar clientes', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarClientes();
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
                    <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
                    <p className="text-sm text-slate-400 mt-0.5">{clientes.length} cliente(s) encontrado(s)</p>
                </div>
                <Link
                    href="/dashboard/clientes/novo"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                    + Novo Cliente
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Nome</th>
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">CPF</th>
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {clientes.map((cliente) => (
                            <tr key={cliente.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-5 py-4 text-sm font-medium text-slate-800">{cliente.nome}</td>
                                <td className="px-5 py-4 text-sm text-slate-500">{cliente.email}</td>
                                <td className="px-5 py-4 text-sm text-slate-500">{cliente.cpf}</td>
                                <td className="px-5 py-4">
                                    <Link
                                        href={`/dashboard/clientes/${cliente.id}`}
                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                    >
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {clientes.length === 0 && (
                    <div className="text-center py-16 text-slate-400 text-sm">
                        Nenhum cliente cadastrado
                    </div>
                )}
            </div>

            {totalPaginas > 1 && (
                <div className="flex items-center justify-center gap-2 mt-5">
                    <button
                        onClick={() => carregarClientes(pagina - 1)}
                        disabled={pagina === 0}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        Anterior
                    </button>
                    <span className="px-3 py-1.5 text-sm text-slate-500">
                        {pagina + 1} de {totalPaginas}
                    </span>
                    <button
                        onClick={() => carregarClientes(pagina + 1)}
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
