'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/authService';
import Link from 'next/link';

const navItems = [
    { href: '/dashboard/produtos', label: 'Produtos', icon: '📦' },
    { href: '/dashboard/clientes', label: 'Clientes', icon: '👥' },
    { href: '/dashboard/pedidos', label: 'Pedidos', icon: '🛒' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-60 bg-white border-r border-slate-200 flex flex-col fixed h-full">
                <div className="px-6 py-5 border-b border-slate-100">
                    <span className="text-lg font-bold text-indigo-600 tracking-tight">E-commerce</span>
                    <p className="text-xs text-slate-400 mt-0.5">Painel Admin</p>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const active = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    active
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-3 py-4 border-t border-slate-100">
                    <button
                        onClick={() => authService.logout()}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <span className="text-base">🚪</span>
                        Sair
                    </button>
                </div>
            </aside>

            {/* Conteúdo */}
            <main className="flex-1 ml-60 p-8">
                {children}
            </main>
        </div>
    );
}
