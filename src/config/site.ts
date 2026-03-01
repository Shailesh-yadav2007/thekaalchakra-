export const siteConfig = {
    name: "TheKaalchakra",
    nameHi: "द कालचक्र",
    description: "Your trusted source for breaking news, in-depth articles, and editorials in Hindi and English.",
    descriptionHi: "हिंदी और अंग्रेजी में ब्रेकिंग न्यूज, गहन लेख और सम्पादकीय के लिए आपका विश्वसनीय स्रोत।",
    url: "https://kaalchakra.news",
    defaultLanguage: "english" as const,
    languages: ["hindi", "english"] as const,
    social: {
        twitter: "",
        facebook: "",
        instagram: "",
        whatsapp: "",
    },
    seo: {
        titleTemplate: "%s | TheKaalchakra",
        defaultTitle: "TheKaalchakra - Hindi & English News Portal",
        defaultDescription: "Breaking news, articles, and editorials in Hindi and English.",
    },
} as const;
