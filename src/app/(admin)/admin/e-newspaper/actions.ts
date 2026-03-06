"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createENewspaper(data: {
    titleEn: string;
    titleHi: string;
    language: "HINDI" | "ENGLISH";
    publishDate: Date;
    pdfUrl: string;
}) {
    // Validate inputs
    if (!data.titleEn || !data.titleHi || !data.pdfUrl || !data.publishDate) {
        throw new Error("Missing required fields");
    }

    try {
        const newspaper = await prisma.eNewspaper.create({
            data: {
                titleEn: data.titleEn,
                titleHi: data.titleHi,
                language: data.language,
                publishDate: data.publishDate,
                pdfUrl: data.pdfUrl,
            },
        });

        revalidatePath("/admin/e-newspaper");
        revalidatePath("/english/e-newspaper");
        revalidatePath("/hindi/e-newspaper");

        return { success: true, newspaper };
    } catch (error: any) {
        console.error("Error creating e-newspaper:", error);
        return { success: false, error: error.message || "Failed to create e-newspaper" };
    }
}
