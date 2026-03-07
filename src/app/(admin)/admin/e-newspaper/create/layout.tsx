import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ENewspaperCreateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const role = (session?.user as any)?.role;

    if (role !== "ADMIN" && role !== "OWNER") {
        redirect("/admin/e-newspaper");
    }

    return <>{children}</>;
}
