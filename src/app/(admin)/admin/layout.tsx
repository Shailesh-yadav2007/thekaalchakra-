import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/admin/login");
    }

    return (
        <div className="admin-layout">
            <AdminSidebar user={session.user as any} />
            <main className="admin-main">
                <div className="admin-content">{children}</div>
            </main>
        </div>
    );
}
