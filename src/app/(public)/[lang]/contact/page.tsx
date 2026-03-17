import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface PageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;
    const isHindi = lang === "hindi";
    return {
        title: isHindi ? "संपर्क करें" : "Contact Us",
        description: isHindi
            ? `${siteConfig.nameHi} से संपर्क करें`
            : `Get in touch with ${siteConfig.name}`,
    };
}

export default async function ContactPage({ params }: PageProps) {
    const { lang } = await params;
    const isHindi = lang === "hindi";

    return (
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-10 md:py-16">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                {isHindi ? "संपर्क करें" : "Contact Us"}
            </h1>

            <div className="prose dark:prose-invert max-w-none space-y-8 text-gray-700 dark:text-gray-300">
                {isHindi ? (
                    <>
                        <p>हम आपसे सुनना चाहते हैं! चाहे आपके कोई सवाल हों, सुझाव हों, या समाचार टिप हो — हमसे संपर्क करने में संकोच न करें।</p>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">संपर्क जानकारी</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-gray-200 dark:border-zinc-700 p-5 bg-gray-50 dark:bg-zinc-800/50">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">ईमेल</h3>
                                    <p className="text-sm">
                                        <a href="mailto:editor@thekaalchakra.com" className="text-red-700 hover:underline">editor@thekaalchakra.com</a>
                                    </p>
                                </div>
                                <div className="rounded-xl border border-gray-200 dark:border-zinc-700 p-5 bg-gray-50 dark:bg-zinc-800/50">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">सम्पादकीय विभाग</h3>
                                    <p className="text-sm">
                                        <a href="mailto:editor@thekaalchakra.com" className="text-red-700 hover:underline">editor@thekaalchakra.com</a>
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">समाचार टिप भेजें</h2>
                            <p>यदि आपके पास कोई समाचार टिप या कहानी है जिसे हमें कवर करना चाहिए, तो कृपया हमें <a href="mailto:editor@thekaalchakra.com" className="text-red-700 hover:underline">editor@thekaalchakra.com</a> पर ईमेल करें।</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">विज्ञापन</h2>
                            <p>विज्ञापन और व्यावसायिक पूछताछ के लिए, कृपया हमें <a href="mailto:editor@thekaalchakra.com" className="text-red-700 hover:underline">editor@thekaalchakra.com</a> पर संपर्क करें।</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">सोशल मीडिया</h2>
                            <p>नवीनतम अपडेट के लिए हमें सोशल मीडिया पर फ़ॉलो करें।</p>
                        </section>
                    </>
                ) : (
                    <>
                        <p>We would love to hear from you! Whether you have questions, suggestions, or a news tip — feel free to reach out to us.</p>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">Contact Information</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-gray-200 dark:border-zinc-700 p-5 bg-gray-50 dark:bg-zinc-800/50">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                                    <p className="text-sm">
                                        <a href="mailto:editor@thekaalchakra.com" className="text-red-700 hover:underline">editor@thekaalchakra.com</a>
                                    </p>
                                </div>
                                <div className="rounded-xl border border-gray-200 dark:border-zinc-700 p-5 bg-gray-50 dark:bg-zinc-800/50">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Editorial Department</h3>
                                    <p className="text-sm">
                                        <a href="mailto:editor@thekaalchakra.com" className="text-red-700 hover:underline">editor@thekaalchakra.com</a>
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">Send a News Tip</h2>
                            <p>If you have a news tip or a story we should cover, please email us at <a href="mailto:editor@thekaalchakra.com" className="text-red-700 hover:underline">editor@thekaalchakra.com</a>.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">Advertising</h2>
                            <p>For advertising and business enquiries, please contact us at <a href="mailto:editor@thekaalchakra.com" className="text-red-700 hover:underline">editor@thekaalchakra.com</a>.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">Social Media</h2>
                            <p>Follow us on social media for the latest updates.</p>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}
