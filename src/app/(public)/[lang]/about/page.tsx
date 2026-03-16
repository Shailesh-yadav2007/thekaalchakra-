import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface PageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;
    const isHindi = lang === "hindi";
    return {
        title: isHindi ? "हमारे बारे में" : "About Us",
        description: isHindi
            ? `${siteConfig.nameHi} के बारे में जानें`
            : `Learn about ${siteConfig.name}`,
    };
}

export default async function AboutPage({ params }: PageProps) {
    const { lang } = await params;
    const isHindi = lang === "hindi";

    return (
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-10 md:py-16">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                {isHindi ? "हमारे बारे में" : "About Us"}
            </h1>

            <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
                {isHindi ? (
                    <>
                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">हम कौन हैं</h2>
                            <p>{siteConfig.nameHi} एक द्विभाषी (हिंदी और अंग्रेजी) समाचार पोर्टल है जो सटीक, निष्पक्ष और समय पर समाचार प्रदान करने के लिए समर्पित है। हम राजनीति, भारत, विश्व, व्यापार, तकनीक, खेल, मनोरंजन, जीवनशैली और सम्पादकीय जैसे विविध विषयों को कवर करते हैं।</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">हमारा मिशन</h2>
                            <p>हमारा मिशन पाठकों को विश्वसनीय, प्रमाणित और गहन समाचार प्रदान करना है। हम पत्रकारिता के उच्चतम नैतिक मानकों का पालन करते हुए सत्य और तथ्यों पर आधारित रिपोर्टिंग में विश्वास करते हैं।</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">हम क्या करते हैं</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>ब्रेकिंग न्यूज़:</strong> देश और दुनिया की ताज़ा खबरें सबसे पहले।</li>
                                <li><strong>गहन विश्लेषण:</strong> महत्वपूर्ण मुद्दों पर विस्तृत लेख और विश्लेषण।</li>
                                <li><strong>सम्पादकीय:</strong> विभिन्न विषयों पर विचारोत्तेजक सम्पादकीय।</li>
                                <li><strong>ई-अखबार:</strong> डिजिटल समाचार पत्र का अनुभव।</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">हमारे मूल्य</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>सत्यता:</strong> हम तथ्य-आधारित और प्रमाणित समाचार प्रस्तुत करते हैं।</li>
                                <li><strong>निष्पक्षता:</strong> हम किसी भी पक्ष या विचारधारा से बंधे नहीं हैं।</li>
                                <li><strong>पारदर्शिता:</strong> हम अपने पाठकों के प्रति पूर्ण पारदर्शिता बनाए रखते हैं।</li>
                                <li><strong>जिम्मेदारी:</strong> हम सामाजिक जिम्मेदारी के साथ पत्रकारिता करते हैं।</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">संपर्क करें</h2>
                            <p>हमसे जुड़ने या किसी भी सुझाव के लिए, कृपया हमारे <a href={`/${lang}/contact`} className="text-red-700 hover:underline">संपर्क पृष्ठ</a> पर जाएं।</p>
                        </section>
                    </>
                ) : (
                    <>
                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">Who We Are</h2>
                            <p>{siteConfig.name} is a bilingual (Hindi and English) news portal dedicated to delivering accurate, unbiased, and timely news. We cover diverse topics including Politics, India, World, Business, Technology, Sports, Entertainment, Lifestyle, and Editorials.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">Our Mission</h2>
                            <p>Our mission is to provide readers with reliable, verified, and in-depth news coverage. We believe in truth and fact-based reporting while adhering to the highest ethical standards of journalism.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">What We Do</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Breaking News:</strong> The latest news from India and around the world, delivered first.</li>
                                <li><strong>In-depth Analysis:</strong> Detailed articles and analysis on important issues.</li>
                                <li><strong>Editorials:</strong> Thought-provoking editorials on various topics.</li>
                                <li><strong>E-Newspaper:</strong> A digital newspaper experience.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">Our Values</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Truth:</strong> We present fact-based and verified news.</li>
                                <li><strong>Impartiality:</strong> We are not bound to any party or ideology.</li>
                                <li><strong>Transparency:</strong> We maintain complete transparency with our readers.</li>
                                <li><strong>Responsibility:</strong> We practise journalism with social responsibility.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">Get in Touch</h2>
                            <p>To connect with us or share any suggestions, please visit our <a href={`/${lang}/contact`} className="text-red-700 hover:underline">Contact page</a>.</p>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}
