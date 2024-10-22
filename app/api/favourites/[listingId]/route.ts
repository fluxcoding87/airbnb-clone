import getCurrentUser from "@/actions/getCurrentUser";
import db from "@/libs/db";
import { NextResponse } from "next/server";

export async function PATCH(
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
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const favouriteIds = [...(currentUser.favouriteIds || [])];
    favouriteIds.push(listingId);

    const user = await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        favouriteIds,
      },
    });
    return NextResponse.json(user);
  } catch (e) {
    console.log("FAVOURITES_PATCH", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

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
      return new NextResponse("Invalid ID", { status: 400 });
    }

    let favouriteIds = [...(currentUser.favouriteIds || [])];
    favouriteIds = favouriteIds.filter((id) => id !== listingId);
    const user = await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        favouriteIds,
      },
    });
    return NextResponse.json(user);
  } catch (e) {
    console.log("LISTING_FAVOURITE_DELETE", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
