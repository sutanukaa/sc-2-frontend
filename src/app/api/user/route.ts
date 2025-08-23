// app/api/users/route.ts

import { NextResponse } from "next/server";
import { userDB } from "@/collections/users";

export async function GET() {
  try {
    const users = await userDB.list();
    return NextResponse.json(
      { message: "Users fetched successfully", users: users.documents },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}