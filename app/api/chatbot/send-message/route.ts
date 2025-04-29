"use server";

import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import { NextRequest } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

export async function POST(request: NextRequest) {
  const { content, timestamp } = await request.json();
  console.log(content, timestamp);

  const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });

  const response = await chat.sendMessageStream({
    message: content,
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        console.log(chunk.text); // log the chunk text
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
