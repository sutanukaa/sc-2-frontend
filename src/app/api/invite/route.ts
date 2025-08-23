// app/api/invite/route.ts
import { createInvite } from "@/collections/invite";
import { NextResponse } from "next/server";
import { userDB } from "@/collections/users";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const INVITES_COLLECTION =
  process.env.NEXT_PUBLIC_APPWRITE_INVITES_COLLECTION_ID!;
const ORGS_COLLECTION =
  process.env.NEXT_PUBLIC_APPWRITE_ORGANIZATIONS_COLLECTION_ID!;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orgId, email, createdBy } = body;

    if (!orgId || !email || !createdBy) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. Check if organization exists
    const org = await databases
      .getDocument(DATABASE_ID, ORGS_COLLECTION, orgId)
      .catch(() => null);
    if (!org) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    // 2. Check if user exists in user collection
    const users = await userDB.list([Query.equal("email", email)]);
    if (users.total === 0) {
      return NextResponse.json(
        { error: "User with this email not found" },
        { status: 404 }
      );
    }
    const userDoc = users.documents[0];

    // 3. Check if user already has an invite for this org
    const existingInvites = await databases.listDocuments(
      DATABASE_ID,
      INVITES_COLLECTION,
      [Query.equal("email", email), Query.equal("org_id", orgId)]
    );

    if (existingInvites.total > 0) {
      return NextResponse.json(
        { error: "User already has an invite for this organization" },
        { status: 409 } // Conflict
      );
    }

    // 4. Create invite using helper
    const invite = await createInvite(orgId, email, createdBy);

    // 5. Update user doc → push invite ID
    const currentInvites = userDoc.invite || [];
    const updatedInvites = [...currentInvites, invite.$id];

    await userDB.update(userDoc.$id, { invite: updatedInvites });

    // 6. Return success with invite link
    return NextResponse.json({
      message: "Invite created successfully",
      invite,
      inviteLink: `${process.env.NEXT_PUBLIC_BASE_URL}/accept-invite?token=${invite.token}`,
    });
  } catch (error: any) {
    console.error("Error creating invite:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
