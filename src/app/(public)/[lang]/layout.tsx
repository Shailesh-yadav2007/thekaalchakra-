import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { AlternatePathProvider } from "@/components/layout/AlternatePathContext";
import { isValidLanguage } from "@/lib/utils";
import { notFound } from "next/navigation";

interface LangLayoutProps {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
    const { lang } = await params;

    if (!isValidLanguage(lang)) {
        notFound();
    }

    return (
        <AlternatePathProvider>
            <div className="min-h-screen flex flex-col">
                <Navbar lang={lang} />
                <main className="flex-1">{children}</main>
                <Footer lang={lang} />
            </div>
        </AlternatePathProvider>
    );
}
