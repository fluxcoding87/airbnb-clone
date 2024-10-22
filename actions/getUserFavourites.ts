/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/libs/db";
import getCurrentUser from "./getCurrentUser";

const getUserFavourites = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return [];
    }

    const favourites = await db.listing.findMany({
      where: {
        id: {
          in: [...(currentUser?.favouriteIds || [])],
        },
      },
    });
    return favourites;
  } catch (e: any) {
    console.log(e);
    throw new Error(e);
  }
};
export default getUserFavourites;
