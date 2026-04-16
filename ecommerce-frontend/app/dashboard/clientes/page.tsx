'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link'; // Importe o Link para navegação interna
import { clienteService } from '@/services/clienteService';
import { Cliente } from '@/types';

export default function ClientesPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);

    async function carregarClientes(page = 0) {
        try {
            setLoading(true); // É bom resetar o loading ao mudar de página
            const data = await clienteService.listar(page);
            setClientes(data.content || []); // Fallback para array vazio
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
        return <div className="text-center py-8 text-gray-500">Carregando...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
                
                {/* CORREÇÃO: Tag Link devidamente fechada e estruturada */}
                <Link 
                    href="/dashboard/clientes/novo"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                    + Novo Cliente
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Nome</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Email</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">CPF</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente) => (
                            <tr key={cliente.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-800">{cliente.nome}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{cliente.email}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{cliente.cpf}</td>
                                <td className="px-4 py-3 text-sm">
                                    {/* CORREÇÃO: Link de edição corrigido */}
                                    <Link 
                                        href={`/dashboard/clientes/${cliente.id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {clientes.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        Nenhum cliente cadastrado
                    </div>
                )}
            </div>

            {/* Paginação */}
            {totalPaginas > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <button
                        onClick={() => carregarClientes(pagina - 1)}
                        disabled={pagina === 0}
                        className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-600">
                        {pagina + 1} de {totalPaginas}
                    </span>
                    <button
                        onClick={() => carregarClientes(pagina + 1)}
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
