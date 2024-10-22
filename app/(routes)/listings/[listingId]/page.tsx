import getCurrentUser from "@/actions/getCurrentUser";
import getListingById from "@/actions/getListingById";
import EmptyState from "@/components/EmptyState";
import ListingClient from "./_components/ListingClient";
import getReservations from "@/actions/getReservations";

const ListingIdPage = async ({ params }: { params: { listingId: string } }) => {
  const { listingId } = params;
  const listing = await getListingById(listingId);
  const currentUser = await getCurrentUser();
  const reservations = await getReservations(params);
  if (!listing) {
    return <EmptyState />;
  }
  return (
    <div>
      <ListingClient
        listing={listing}
        currentUser={currentUser}
        reservations={reservations}
      />
    </div>
  );
};

export default ListingIdPage;
