"use server";
//  eslint-disable @typescript-eslint/no-explicit-any
import { chat, message } from "@/db/schemas";
import { db } from "@/drizzle";
import { auth } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decideFunction, schema } from "./utils";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

export async function POST(request: NextRequest) {
  const { content, sendAt, id, chatId } = await request.json();

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

  const chatExists = await db
    .select()
    .from(chat)
    .where(and(eq(chat.id, chatId), eq(chat.userId, session.user.id)))
    .limit(1);
  if (chatExists.length === 0) {
    return NextResponse.json("Chat does not exist", { status: 404 });
  }

  await db.insert(message).values({
    id: id,
    chatId: chatId,
    content,
    role: "user",
    sendAt: new Date(sendAt),
  });

  const messages = await db
    .select()
    .from(message)
    .where(eq(message.chatId, chatId));

  const chatHistory = messages.map((message) => ({
    role: message.role,
    parts: [{ text: message.content }],
  }));

  const geminiChat = ai.chats.create({
    model: "gemini-2.0-flash",

    history: chatHistory,
    config: {
      systemInstruction:
        "You're a database expert. You need to format the query results in table. Always asks for further database questions if needed." +
        schema,
    },
  });

  const { result, error } = await decideFunction(geminiChat, content);

  const response = await geminiChat.sendMessageStream({
    message: result
      ? `${content}. Esse é o resultado da query: ${JSON.stringify(
          //  eslint-disable-next-line @typescript-eslint/no-explicit-any
          result.rows.slice(0, 5) as any
        )}`
      : error
      ? `${content}.  Esse é o resultado da query: ${error}`
      : content,
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        // log the chunk text
        if (chunk.text) {
          controller.enqueue(new TextEncoder().encode(chunk.text));
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
    },
  });
}
