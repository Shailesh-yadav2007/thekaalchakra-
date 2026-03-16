import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface PageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;
    const isHindi = lang === "hindi";
    return {
        title: isHindi ? "गोपनीयता नीति" : "Privacy Policy",
        description: isHindi
            ? `${siteConfig.nameHi} की गोपनीयता नीति`
            : `Privacy Policy of ${siteConfig.name}`,
    };
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
    const { lang } = await params;
    const isHindi = lang === "hindi";

    return (
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-10 md:py-16">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                {isHindi ? "गोपनीयता नीति" : "Privacy Policy"}
            </h1>

            <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
                {isHindi ? (
                    <>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            अंतिम अपडेट: मार्च 2026
                        </p>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">1. परिचय</h2>
                            <p>{siteConfig.nameHi} (&quot;हम&quot;, &quot;हमारा&quot;) आपकी गोपनीयता की रक्षा के लिए प्रतिबद्ध है। यह गोपनीयता नीति बताती है कि जब आप हमारी वेबसाइट {siteConfig.url} का उपयोग करते हैं तो हम आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित करते हैं।</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">2. हम कौन सी जानकारी एकत्र करते हैं</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>व्यक्तिगत जानकारी:</strong> जब आप टिप्पणी करते हैं तो आपका नाम और ईमेल पता।</li>
                                <li><strong>उपयोग डेटा:</strong> IP पता, ब्राउज़र प्रकार, देखे गए पृष्ठ और विज़िट का समय।</li>
                                <li><strong>कुकीज़:</strong> हम आपके अनुभव को बेहतर बनाने के लिए कुकीज़ और समान तकनीकों का उपयोग करते हैं।</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">3. जानकारी का उपयोग</h2>
                            <p>हम आपकी जानकारी का उपयोग निम्नलिखित उद्देश्यों के लिए करते हैं:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>वेबसाइट का संचालन और रखरखाव।</li>
                                <li>उपयोगकर्ता अनुभव में सुधार।</li>
                                <li>टिप्पणियों का प्रबंधन और मॉडरेशन।</li>
                                <li>वेबसाइट ट्रैफ़िक और उपयोग पैटर्न का विश्लेषण।</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">4. डेटा सुरक्षा</h2>
                            <p>हम आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए उचित तकनीकी और संगठनात्मक उपाय करते हैं। हालांकि, इंटरनेट पर कोई भी प्रसारण 100% सुरक्षित नहीं है।</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">5. तृतीय पक्ष सेवाएं</h2>
                            <p>हम विश्लेषण और सेवा सुधार के लिए तृतीय पक्ष सेवाओं का उपयोग कर सकते हैं। इन सेवाओं की अपनी गोपनीयता नीतियां हैं।</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">6. आपके अधिकार</h2>
                            <p>आपको अपनी व्यक्तिगत जानकारी तक पहुंचने, सुधारने या हटाने का अधिकार है। किसी भी अनुरोध के लिए हमसे संपर्क करें।</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">7. नीति में परिवर्तन</h2>
                            <p>हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। कोई भी परिवर्तन इस पृष्ठ पर प्रकाशित किया जाएगा।</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">8. संपर्क</h2>
                            <p>गोपनीयता संबंधी किसी भी प्रश्न के लिए, कृपया हमारे <a href={`/${lang}/contact`} className="text-red-700 hover:underline">संपर्क पृष्ठ</a> के माध्यम से हमसे संपर्क करें।</p>
                        </section>
                    </>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Last updated: March 2026
                        </p>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">1. Introduction</h2>
                            <p>{siteConfig.name} (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website at {siteConfig.url}.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">2. Information We Collect</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Personal Information:</strong> Your name and email address when you submit comments.</li>
                                <li><strong>Usage Data:</strong> IP address, browser type, pages viewed, and time of visit.</li>
                                <li><strong>Cookies:</strong> We use cookies and similar technologies to enhance your experience.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">3. How We Use Your Information</h2>
                            <p>We use your information for the following purposes:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>To operate and maintain the website.</li>
                                <li>To improve user experience.</li>
                                <li>To manage and moderate comments.</li>
                                <li>To analyse website traffic and usage patterns.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">4. Data Security</h2>
                            <p>We implement appropriate technical and organizational measures to protect your personal information. However, no transmission over the internet is 100% secure.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">5. Third-Party Services</h2>
                            <p>We may use third-party services for analytics and service improvement. These services have their own privacy policies.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">6. Your Rights</h2>
                            <p>You have the right to access, correct, or delete your personal information. Please contact us for any such requests.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">7. Changes to This Policy</h2>
                            <p>We may update this Privacy Policy from time to time. Any changes will be published on this page.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">8. Contact</h2>
                            <p>For any privacy-related queries, please reach out through our <a href={`/${lang}/contact`} className="text-red-700 hover:underline">Contact page</a>.</p>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}
