import getCurrentUser from "@/actions/getCurrentUser";
import db from "@/libs/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
      return new NextResponse("Invalid Id", { status: 400 });
    }

    const listing = await db.listing.deleteMany({
      where: {
        id: listingId,
        userId: currentUser.id,
      },
    });

    return NextResponse.json(listing);
  } catch (e) {
    console.log("LISTING_DELETE", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
