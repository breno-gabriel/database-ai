"use server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const { content, timestamp } = await request.json();
  console.log(content, timestamp);

  return NextResponse.json({
    id: uuidv4(),
    content: content,
    sender: "chatbot",
    timestamp: timestamp,
  });
}
