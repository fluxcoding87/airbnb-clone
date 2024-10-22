import getCurrentUser from "@/actions/getCurrentUser";
import db from "@/libs/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      location,
      price,
    } = body;

    Object.keys(body).forEach((value) => {
      if (!body[value]) {
        return new NextResponse("Fields missing", { status: 400 });
      }
    });
    const listing = await db.listing.create({
      data: {
        title,
        description,
        imageSrc,
        category,
        roomCount,
        bathroomCount,
        guestCount,
        locationValue: location.value,
        price: parseInt(price, 10),
        userId: currentUser.id,
      },
    });
    return NextResponse.json(listing);
  } catch (e) {
    console.log("LISTINGS_POST", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
