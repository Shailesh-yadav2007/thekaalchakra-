import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface PageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;
    const isHindi = lang === "hindi";
    return {
        title: isHindi ? "नियम व शर्तें" : "Terms & Conditions",
        description: isHindi
            ? `${siteConfig.nameHi} के नियम व शर्तें`
            : `Terms & Conditions of ${siteConfig.name}`,
    };
}

export default async function TermsPage({ params }: PageProps) {
    const { lang } = await params;
    const isHindi = lang === "hindi";

    return (
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-10 md:py-16">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                {isHindi ? "नियम व शर्तें" : "Terms & Conditions"}
            </h1>

            <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
                {isHindi ? (
                    <>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            अंतिम अपडेट: मार्च 2026
                        </p>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">1. स्वीकृति</h2>
                            <p>{siteConfig.nameHi} वेबसाइट का उपयोग करके, आप इन नियमों और शर्तों से बाध्य होने के लिए सहमत होते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया वेबसाइट का उपयोग न करें।</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">2. सामग्री का उपयोग</h2>
                            <p>इस वेबसाइट पर प्रकाशित सभी सामग्री {siteConfig.nameHi} की संपत्ति है। बिना पूर्व लिखित अनुमति के सामग्री का पुनरुत्पादन, वितरण या प्रसारण प्रतिबंधित है।</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">3. उपयोगकर्ता आचरण</h2>
                            <p>उपयोगकर्ता सहमत होते हैं कि वे:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>किसी भी अवैध या अनधिकृत उद्देश्य के लिए वेबसाइट का उपयोग नहीं करेंगे।</li>
                                <li>अपमानजनक, आपत्तिजनक या मानहानिकारक टिप्पणियां पोस्ट नहीं करेंगे।</li>
                                <li>किसी अन्य व्यक्ति का प्रतिरूपण नहीं करेंगे।</li>
                                <li>वेबसाइट के सामान्य संचालन में बाधा नहीं डालेंगे।</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">4. टिप्पणी नीति</h2>
                            <p>सभी टिप्पणियां प्रकाशन से पहले मॉडरेशन के अधीन हैं। हम बिना कारण बताए किसी भी टिप्पणी को हटाने का अधिकार सुरक्षित रखते हैं।</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">5. रिपोर्टर जिम्मेदारी</h2>
                            <p>इस प्लेटफ़ॉर्म पर प्रकाशित किसी भी समाचार, लेख, फोटो, वीडियो या अन्य सामग्री के लिए संबंधित रिपोर्टर / योगदानकर्ता स्वयं जिम्मेदार होगा। यदि किसी सामग्री के कारण कानूनी विवाद उत्पन्न होता है, तो उसकी प्राथमिक जिम्मेदारी संबंधित लेखक / रिपोर्टर की होगी।</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">6. बौद्धिक संपदा</h2>
                            <p>वेबसाइट पर सभी सामग्री, लोगो, ट्रेडमार्क और डिज़ाइन {siteConfig.nameHi} की बौद्धिक संपदा है और कॉपीराइट कानूनों द्वारा संरक्षित है।</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">7. दायित्व की सीमा</h2>
                            <p>{siteConfig.nameHi} वेबसाइट पर प्रकाशित जानकारी की सटीकता सुनिश्चित करने का प्रयास करता है, लेकिन किसी भी त्रुटि या चूक के लिए जिम्मेदार नहीं है।</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">8. शर्तों में परिवर्तन</h2>
                            <p>हम किसी भी समय इन शर्तों को संशोधित करने का अधिकार सुरक्षित रखते हैं। परिवर्तन इस पृष्ठ पर प्रकाशित होने के बाद प्रभावी होंगे।</p>
                        </section>
                    </>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Last updated: March 2026
                        </p>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">1. Acceptance</h2>
                            <p>By using the {siteConfig.name} website, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the website.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">2. Use of Content</h2>
                            <p>All content published on this website is the property of {siteConfig.name}. Reproduction, distribution, or transmission of content without prior written permission is prohibited.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">3. User Conduct</h2>
                            <p>Users agree that they will not:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Use the website for any illegal or unauthorized purpose.</li>
                                <li>Post abusive, offensive, or defamatory comments.</li>
                                <li>Impersonate any other person.</li>
                                <li>Interfere with the normal operation of the website.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">4. Comment Policy</h2>
                            <p>All comments are subject to moderation before publication. We reserve the right to remove any comment without providing a reason.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">5. Reporter Responsibility</h2>
                            <p>The respective reporter/contributor shall be solely responsible for any news, article, photo, video, or other content published on this platform. If any legal dispute arises due to any content, the primary responsibility shall lie with the respective author/reporter.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">6. Intellectual Property</h2>
                            <p>All content, logos, trademarks, and designs on the website are the intellectual property of {siteConfig.name} and are protected by copyright laws.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">7. Limitation of Liability</h2>
                            <p>{siteConfig.name} strives to ensure the accuracy of information published on the website but is not responsible for any errors or omissions.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">8. Changes to Terms</h2>
                            <p>We reserve the right to modify these terms at any time. Changes will become effective once published on this page.</p>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}
