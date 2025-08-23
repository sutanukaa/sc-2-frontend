// app/api/user/[id]/route.ts

import { NextResponse } from "next/server";
import { userDB } from "@/collections/users";

interface Params {
  params: Promise<{ id: string }>; // ✅ make params async
}

// GET single user
export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params; // ✅ await here
    const user = await userDB.get(id);

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}

// UPDATE user
export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params; // ✅ await here
    const body = await req.json();
    const updatedUser = await userDB.update(id, body);

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE user
export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id } = await params; // ✅ await here
    await userDB.delete(id);

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
