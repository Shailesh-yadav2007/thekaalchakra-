"use client";

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

    return (
        <aside className="admin-sidebar">
            {/* Logo */}
            <div className="admin-sidebar-header">
                <Image src="/logo.png" alt="TheKaalchakra Logo" width={56} height={56} className="admin-sidebar-logo-img" />
                <span className="admin-sidebar-badge">Admin</span>
            </div>

            {/* Navigation */}
            <nav className="admin-sidebar-nav">
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
                            className={`admin-nav-link ${isActive ? "active" : ""}`}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* View Site Link */}
            <div className="admin-sidebar-footer">
                <Link href="/english" className="admin-nav-link view-site-link">
                    <Globe size={18} />
                    <span>View Site</span>
                </Link>

                {/* User Info */}
                <div className="admin-user-info">
                    <div className="admin-user-details">
                        <p className="admin-user-name">{user.name}</p>
                        <p className="admin-user-role">{user.role}</p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/admin/login" })}
                        className="admin-logout-btn"
                        title="Sign out"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
