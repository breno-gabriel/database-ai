import { chat, message } from "@/db/schemas";
import { db } from "@/drizzle";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { content, sendAt, id, chatId, role } = await request.json();

    const session = await auth.api.getSession({
      headers: await headers(), //some endpoint might require headers
    });

    if (!session?.user.id) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }
    if (!id) {
      return NextResponse.json("ID is required", { status: 400 });
    }
    if (!chatId) {
      return NextResponse.json("Chat ID is required", { status: 400 });
    }
    if (!sendAt) {
      return NextResponse.json("sendAt is required", { status: 400 });
    }
    if (!content) {
      return NextResponse.json("Content is required", { status: 400 });
    }
    if (!role) {
      return NextResponse.json("Role is required", { status: 400 });
    }
    const chatExists = await db
      .select()
      .from(chat)
      .where(and(eq(chat.id, chatId), eq(chat.userId, session.user.id)))
      .limit(1);

    if (chatExists.length === 0) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    await db.insert(message).values({
      id: id,
      chatId: chatId,
      content,
      role,
      sendAt: new Date(sendAt),
    });

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
