import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { AlternatePathProvider } from "@/components/layout/AlternatePathContext";
import { PushNotificationPrompt } from "@/components/layout/PushNotificationPrompt";
import { isValidLanguage, type SupportedLanguage } from "@/lib/utils";
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
                <Navbar lang={lang as SupportedLanguage} />
                <main className="flex-1 pb-16 md:pb-0">{children}</main>
                <Footer lang={lang as SupportedLanguage} />
                <MobileBottomNav lang={lang as SupportedLanguage} />
                <PushNotificationPrompt lang={lang as SupportedLanguage} />
            </div>
        </AlternatePathProvider>
    );
}
