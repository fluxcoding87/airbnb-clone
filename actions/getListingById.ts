import db from "@/libs/db";

const getListingById = async (id: string) => {
  try {
    const listing = await db.listing.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
    if (!listing) {
      return null;
    }
    return listing;
  } catch (e) {
    console.log(e);
    return null;
  }
};
export default getListingById;
