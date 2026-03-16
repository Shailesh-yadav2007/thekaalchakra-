import { prisma } from "@/lib/prisma";

export async function createNotifications(
    recipientIds: string[],
    message: string,
    type: string,
    articleId?: string
) {
    if (recipientIds.length === 0) return;

    await prisma.notification.createMany({
        data: recipientIds.map((userId) => ({
            userId,
            message,
            type,
            articleId: articleId || null,
        })),
    });
}

export async function notifyAdminsAndOwners(message: string, type: string, articleId?: string) {
    const admins = await prisma.user.findMany({
        where: { role: { in: ["ADMIN", "OWNER"] } },
        select: { id: true },
    });
    await createNotifications(admins.map((u) => u.id), message, type, articleId);
}

export async function notifyEditors(message: string, type: string, articleId?: string) {
    const editors = await prisma.user.findMany({
        where: { role: "EDITOR" },
        select: { id: true },
    });
    await createNotifications(editors.map((u) => u.id), message, type, articleId);
}

export async function notifyUser(userId: string, message: string, type: string, articleId?: string) {
    await createNotifications([userId], message, type, articleId);
}
