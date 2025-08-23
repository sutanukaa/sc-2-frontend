import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import { ID } from "appwrite";
import { orgDB } from "@/collections/organizations";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_ORGANIZATIONS_COLLECTION_ID!;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, college, capacity } = body;

    if (!name || !college || capacity === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      { name, college, capacity }
    );

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orgs = await orgDB.list();
    return NextResponse.json(orgs, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}