import getCurrentUser from "@/actions/getCurrentUser";
import getUserFavourites from "@/actions/getUserFavourites";
import EmptyState from "@/components/EmptyState";
import FavouritesClient from "./_components/FavouritesClient";
export const dynamic = "force-dynamic";
const FavouritesPage = async () => {
  const listings = await getUserFavourites();
  const currentUser = await getCurrentUser();

  if (listings.length === 0) {
    return (
      <EmptyState
        title="No favouries found"
        subtitle="Looks like you have no favourite listings."
      />
    );
  }

  return <FavouritesClient listings={listings} currentUser={currentUser} />;
};

export default FavouritesPage;
