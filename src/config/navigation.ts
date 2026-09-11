import type { NavItem } from "@/types";

export const mainNavItems: NavItem[] = [
    { label: "India", labelHi: "देश", href: "/india" },
    { label: "State", labelHi: "राज्य", href: "/state" },
    { label: "Politics", labelHi: "राजनीति", href: "/politics" },
    { label: "World", labelHi: "दुनिया", href: "/world" },
    { label: "Business", labelHi: "बिज़नेस", href: "/business" },
    { label: "Sports", labelHi: "खेल", href: "/sports" },
    { label: "Entertainment", labelHi: "मनोरंजन", href: "/entertainment" },
    { label: "Technology", labelHi: "टेक्नोलॉजी", href: "/technology" },
    { label: "Education", labelHi: "शिक्षा", href: "/education" },
    { label: "Health", labelHi: "स्वास्थ्य", href: "/health" },
    { label: "Opinion", labelHi: "विचार", href: "/opinion" },
    { label: "Videos", labelHi: "वीडियो", href: "/videos" },
    { label: "Special", labelHi: "विशेष", href: "/special" },
];

export const adminNavItems = [
    { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
    { label: "Articles", href: "/admin/articles", icon: "FileText" },
    { label: "Categories", href: "/admin/categories", icon: "FolderOpen" },
    { label: "E-Newspaper", href: "/admin/e-newspaper", icon: "Newspaper" },
    { label: "Users", href: "/admin/users", icon: "Users" },
    { label: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;
