import { chat, message } from "@/db/schemas";
import { db } from "@/drizzle";
import { auth } from "@/lib/auth";
import { and, asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const chatId = (await params)?.chatId;

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }
    const session = await auth.api.getSession({
      headers: await headers(), //some endpoint might require headers
    });

    if (!session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatExists = await db
      .select()
      .from(chat)
      .where(and(eq(chat.id, chatId), eq(chat.userId, session.user.id)))
      .limit(1);

    if (chatExists.length === 0) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const messages = await db
      .select({
        id: message.id,
        content: message.content,
        role: message.role,
        sendAt: message.sendAt,
        chatId: message.chatId,
      })
      .from(message)
      .innerJoin(chat, eq(message.chatId, chat.id))
      .where(eq(message.chatId, chatId))
      .orderBy(asc(message.sendAt))
      .limit(10);

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
