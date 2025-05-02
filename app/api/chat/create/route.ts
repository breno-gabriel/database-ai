import { chat } from "@/db/schemas";
import { db } from "@/drizzle";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(), 
    });

    if (!session?.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await db
      .insert(chat)
      .values({
        id: uuidv4(),
        userId: session?.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return NextResponse.json({ chatId: response[0].id }, { status: 200 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
