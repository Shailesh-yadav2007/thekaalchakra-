import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function CategoriesPage() {
    const session = await auth();
    const role = (session?.user as any)?.role;
    const isAdmin = role === "OWNER" || role === "ADMIN";

    const categories = await prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { articles: true } } },
    });

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Categories</h1>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Name (English)</th>
                            <th>Name (Hindi)</th>
                            <th>Slug (EN)</th>
                            <th>Slug (HI)</th>
                            <th>Articles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat: typeof categories[number]) => (
                            <tr key={cat.id}>
                                <td>{cat.sortOrder}</td>
                                <td>{cat.nameEn}</td>
                                <td>{cat.nameHi}</td>
                                <td className="text-gray-500">{cat.slugEn}</td>
                                <td className="text-gray-500">{cat.slugHi}</td>
                                <td>{cat._count.articles}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
