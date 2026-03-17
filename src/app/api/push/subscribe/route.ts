import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { endpoint, keys } = body;

    const ep = typeof endpoint === "string" ? endpoint.trim() : "";
    const p256dh = typeof keys?.p256dh === "string" ? keys.p256dh.trim() : "";
    const authKey = typeof keys?.auth === "string" ? keys.auth.trim() : "";

    if (!ep || !p256dh || !authKey) {
      return NextResponse.json(
        { error: "Invalid subscription data" },
        { status: 400 }
      );
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint: ep },
      update: { p256dh, auth: authKey },
      create: { endpoint: ep, p256dh, auth: authKey },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
