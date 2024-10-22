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
    const { listingId, startDate, endDate, totalPrice } = body;

    if (!listingId || !startDate || !endDate || !totalPrice) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    const listingAndReservation = await db.listing.update({
      where: {
        id: listingId,
      },
      data: {
        reservations: {
          create: {
            userId: currentUser.id,
            startDate,
            endDate,
            totalPrice,
          },
        },
      },
    });

    return NextResponse.json(listingAndReservation);
  } catch (e) {
    console.log("RESERVATIONS_POST", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
