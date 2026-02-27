import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const defaultCategories = [
    { nameEn: "Politics", nameHi: "राजनीति", slugEn: "politics", slugHi: "rajniti", sortOrder: 1 },
    { nameEn: "India", nameHi: "भारत", slugEn: "india", slugHi: "bharat", sortOrder: 2 },
    { nameEn: "World", nameHi: "विश्व", slugEn: "world", slugHi: "vishwa", sortOrder: 3 },
    { nameEn: "Business", nameHi: "व्यापार", slugEn: "business", slugHi: "vyapar", sortOrder: 4 },
    { nameEn: "Technology", nameHi: "तकनीक", slugEn: "technology", slugHi: "takneek", sortOrder: 5 },
    { nameEn: "Sports", nameHi: "खेल", slugEn: "sports", slugHi: "khel", sortOrder: 6 },
    { nameEn: "Entertainment", nameHi: "मनोरंजन", slugEn: "entertainment", slugHi: "manoranjan", sortOrder: 7 },
    { nameEn: "Lifestyle", nameHi: "जीवनशैली", slugEn: "lifestyle", slugHi: "jeevanshaili", sortOrder: 8 },
    { nameEn: "Editorial", nameHi: "सम्पादकीय", slugEn: "editorial", slugHi: "sampadkiya", sortOrder: 9 },
    { nameEn: "Health", nameHi: "स्वास्थ्य", slugEn: "health", slugHi: "swasthya", sortOrder: 10 },
    { nameEn: "Education", nameHi: "शिक्षा", slugEn: "education", slugHi: "shiksha", sortOrder: 11 },
];

async function main() {
    console.log("🌱 Seeding database...");

    // ─── Create default Owner user ──────────────────────────────────
    const hashedPassword = await bcrypt.hash("admin123", 12);
    const owner = await prisma.user.upsert({
        where: { email: "owner@kaalchakra.news" },
        update: {},
        create: {
            name: "Owner",
            email: "owner@kaalchakra.news",
            hashedPassword,
            role: "OWNER",
        },
    });
    console.log(`✅ Owner user created: ${owner.email}`);

    // ─── Create categories ──────────────────────────────────────────
    for (const cat of defaultCategories) {
        await prisma.category.upsert({
            where: { slugEn: cat.slugEn },
            update: {},
            create: cat,
        });
    }
    console.log(`✅ ${defaultCategories.length} categories created`);

    console.log("🌱 Seeding complete!");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
