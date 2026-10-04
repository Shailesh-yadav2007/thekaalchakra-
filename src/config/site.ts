export const siteConfig = {
    name: "TheKaalchakra",
    nameHi: "द कालचक्र",
    description: "Your trusted source for breaking news, in-depth articles, and editorials in Hindi and English.",
    descriptionHi: "हिंदी और अंग्रेजी में ब्रेकिंग न्यूज, गहन लेख और सम्पादकीय के लिए आपका विश्वसनीय स्रोत।",
    url: "https://www.thekaalchakra.com",
    defaultLanguage: "english" as const,
    languages: ["hindi", "english"] as const,
    social: {
        youtube: "https://youtube.com/@the_kaalchakranews?si=7vEbkY5upnSKewvi",
        instagram: "https://www.instagram.com/the_kaalchakra?stkn=MWxsaXVmMGtqNmtueg==",
        facebook: "https://www.facebook.com/share/1K1fsJBKLH/",
        twitter: "https://x.com",
        whatsapp: "",
    },
    seo: {
        titleTemplate: "%s | TheKaalchakra",
        defaultTitle: "TheKaalchakra - Hindi & English News Portal",
        defaultDescription: "Breaking news, articles, and editorials in Hindi and English.",
    },
} as const;
