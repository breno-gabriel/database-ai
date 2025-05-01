import { chat } from "@/db/schemas";
import { db } from "@/drizzle";
import { auth } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(), //some endpoint might require headers
    });

    if (!session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await db
      .select()
      .from(chat)
      .where(eq(chat.userId, session?.user.id))
      .orderBy(desc(chat.createdAt))
      .limit(10);

    return NextResponse.json(chats, { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
