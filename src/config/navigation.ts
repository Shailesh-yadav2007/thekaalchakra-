import type { NavItem } from "@/types";

export const mainNavItems: NavItem[] = [
    {
        label: "Politics",
        labelHi: "राजनीति",
        href: "/politics",
    },
    {
        label: "India",
        labelHi: "भारत",
        href: "/india",
    },
    {
        label: "World",
        labelHi: "विश्व",
        href: "/world",
    },
    {
        label: "Business",
        labelHi: "व्यापार",
        href: "/business",
    },
    {
        label: "Technology",
        labelHi: "तकनीक",
        href: "/technology",
    },
    {
        label: "Sports",
        labelHi: "खेल",
        href: "/sports",
    },
    {
        label: "Entertainment",
        labelHi: "मनोरंजन",
        href: "/entertainment",
    },
    {
        label: "Lifestyle",
        labelHi: "जीवनशैली",
        href: "/lifestyle",
    },
    {
        label: "Editorial",
        labelHi: "सम्पादकीय",
        href: "/editorial",
    },
];

export const adminNavItems = [
    { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
    { label: "Articles", href: "/admin/articles", icon: "FileText" },
    { label: "Categories", href: "/admin/categories", icon: "FolderOpen" },
    { label: "E-Newspaper", href: "/admin/e-newspaper", icon: "Newspaper" },
    { label: "Users", href: "/admin/users", icon: "Users" },
    { label: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;
