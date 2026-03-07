import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase";

// POST /api/upload - Upload file to Supabase Storage
const ALLOWED_BUCKETS = ["images", "e-newspapers"];

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bucket = (formData.get("bucket") as string) || "images";

    if (!ALLOWED_BUCKETS.includes(bucket)) {
        return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
    }

    const role = session.user.role;
    if (bucket === "e-newspapers" && role !== "ADMIN" && role !== "OWNER") {
        return NextResponse.json({ error: "Unauthorized to upload e-newspapers" }, { status: 403 });
    }

    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Max size: 10MB
    if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
            contentType: file.type,
            upsert: false,
        });

    if (error) {
        console.error("Supabase upload error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return NextResponse.json({
        url: urlData.publicUrl,
        path: data.path,
    });
}
