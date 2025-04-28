"use server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { message } = await request.json();
  console.log(message);

  return NextResponse.json({
    message: "Message received",
  });
}
