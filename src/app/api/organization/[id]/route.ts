import { NextResponse } from "next/server";
import { orgDB } from "@/collections/organizations";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const org = await orgDB.get(params.id);
    return NextResponse.json(org, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = await orgDB.update(params.id, body);
    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await orgDB.delete(params.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
