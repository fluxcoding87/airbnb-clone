import getCurrentUser from "@/actions/getCurrentUser";
import db from "@/libs/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { reservationId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { reservationId } = params;

    if (!reservationId || typeof reservationId !== "string") {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const reservation = await db.reservation.deleteMany({
      where: {
        id: reservationId,
        OR: [
          { userId: currentUser.id },
          { listing: { userId: currentUser.id } },
        ],
      },
    });
    return NextResponse.json(reservation);
  } catch (e) {
    console.log("CANCEL_RESERVATION", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
