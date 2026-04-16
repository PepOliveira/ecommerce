'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <span className="font-bold text-gray-800 text-lg">E-commerce</span>
                    <div className="flex gap-6">
                        <Link href="/dashboard/produtos" className="text-gray-600 hover:text-blue-600 text-sm">
                            Produtos
                        </Link>
                        <Link href="/dashboard/clientes" className="text-gray-600 hover:text-blue-600 text-sm">
                            Clientes
                        </Link>
                        <Link href="/dashboard/pedidos" className="text-gray-600 hover:text-blue-600 text-sm">
                            Pedidos
                        </Link>
                        <button
                            onClick={() => authService.logout()}
                            className="text-red-500 hover:text-red-700 text-sm"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}