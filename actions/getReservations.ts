/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/libs/db";

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

const getReservations = async ({ listingId, userId, authorId }: IParams) => {
  try {
    const query: any = {};
    if (listingId) {
      query.listingId = listingId;
    }
    if (userId) {
      query.userId = userId;
    }
    if (authorId) {
      query.listing = { userId: authorId };
    }

    const reservations = await db.reservation.findMany({
      where: query,
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return reservations;
  } catch (e: any) {
    throw new Error(e);
  }
};

export default getReservations;
