"use client";
import { useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    FileText,
    FolderOpen,
    Newspaper,
    Users,
    Settings,
    LogOut,
    Globe,
    Menu,
    X,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
    LayoutDashboard,
    FileText,
    FolderOpen,
    Newspaper,
    Users,
    Settings,
};

interface AdminSidebarProps {
    user: { name?: string | null; email?: string | null; role?: string };
}

const navItems = [
    { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
    { label: "Articles", href: "/admin/articles", icon: "FileText" },
    { label: "Categories", href: "/admin/categories", icon: "FolderOpen" },
    { label: "E-Newspaper", href: "/admin/e-newspaper", icon: "Newspaper" },
    { label: "Users", href: "/admin/users", icon: "Users" },
    { label: "Settings", href: "/admin/settings", icon: "Settings" },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="md:hidden flex items-center justify-between p-3 bg-[#1e293b] text-white sticky top-0 z-40">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-1 hover:bg-white/10 rounded-md transition-colors"
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </button>
                <Link href="/admin" className="flex items-center gap-2">
                    <span className="font-serif font-bold tracking-tight text-lg">Kaalchakra</span>
                </Link>
                <div className="w-8"></div> {/* Spacer for center alignment */}
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 bg-[#1e293b] text-white transform transition-all duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col h-screen ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${isCollapsed ? 'w-20' : 'w-64'}`}>
                {/* Logo */}
                <div className={`admin-sidebar-header flex items-center justify-between ${isCollapsed ? 'px-2 py-4' : 'p-4'} border-b border-white/10 relative`}>
                    {!isCollapsed && (
                        <Link href="/admin" className="flex items-center gap-2 truncate">
                            <Image src="/logo.png" alt="TheKaalchakra Logo" width={40} height={40} className="admin-sidebar-logo-img" />
                            <div className="flex flex-col">
                                <span className="admin-sidebar-logo font-serif -ml-2 text-[1.1rem]">TheKaalchakra</span>
                                <span className="admin-sidebar-badge w-fit ml-[-0.25rem]">Admin</span>
                            </div>
                        </Link>
                    )}
                    {isCollapsed && (
                        <Link href="/admin" className="mx-auto block">
                            <Image src="/logo.png" alt="Logo" width={40} height={40} className="admin-sidebar-logo-img" />
                        </Link>
                    )}
                    <button className="close-sidebar-btn md:hidden" onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </button>
                    {/* Desktop Collapse Toggle */}
                    <button
                        className="hidden md:flex absolute -right-3 top-6 bg-[#1e293b] text-white border border-gray-600 rounded-full p-1 hover:bg-white/10 transition-colors z-10"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="admin-sidebar-nav flex-1 overflow-y-auto px-2 py-4" onClick={() => setIsOpen(false)}>
                    {navItems.map((item) => {
                        const Icon = iconMap[item.icon] || LayoutDashboard;
                        const isActive =
                            item.href === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(item.href);

                        // Hide Users tab for non-Owner/Admin roles
                        if (
                            item.href === "/admin/users" &&
                            user.role !== "OWNER" &&
                            user.role !== "ADMIN"
                        ) {
                            return null;
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors mb-1 
                                    ${isActive ? 'bg-white/15 text-white font-medium' : 'text-gray-300 hover:bg-white/5 hover:text-white'}
                                    ${isCollapsed ? 'justify-center' : ''}`}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <Icon size={20} className="shrink-0" />
                                {!isCollapsed && <span className="truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* View Site Link & User Info */}
                <div className="border-t border-white/10 p-3 mt-auto">
                    <Link
                        href="/english"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-300 hover:bg-white/5 hover:text-white transition-colors mb-2 ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? "View Site" : undefined}
                    >
                        <Globe size={20} className="shrink-0" />
                        {!isCollapsed && <span>View Site</span>}
                    </Link>

                    {/* User Info */}
                    <div className={`flex items-center bg-white/5 rounded-lg p-2 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                        {!isCollapsed ? (
                            <div className="flex flex-col overflow-hidden mr-2">
                                <span className="text-sm font-medium truncate">{user.name}</span>
                                <span className="text-xs text-gray-400 capitalize truncate">{user.role?.toLowerCase()}</span>
                            </div>
                        ) : null}

                        <button
                            onClick={() => signOut({ callbackUrl: "/admin/login" })}
                            className="text-gray-400 hover:text-red-400 p-1.5 rounded-md hover:bg-white/5 transition-colors shrink-0"
                            title="Sign out"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
