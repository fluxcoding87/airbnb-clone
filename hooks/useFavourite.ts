import axios from "axios";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useLoginModal from "./useLoginModal";
import { User } from "@prisma/client";

interface IUseFavourite {
  listingId: string;
  currentUser?: User | null;
}

const useFavourite = ({ listingId, currentUser }: IUseFavourite) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const hasFavourited = useMemo(() => {
    const list = currentUser?.favouriteIds || [];

    return list.includes(listingId);
  }, [listingId, currentUser]);

  const toggleFavourite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (!currentUser) {
        return loginModal.onOpen();
      }
      try {
        let request;
        if (hasFavourited) {
          request = async () =>
            await axios.delete(`/api/favourites/${listingId}`);
        } else {
          request = async () =>
            await axios.patch(`/api/favourites/${listingId}`);
        }
        await request();
        router.refresh();
        toast.success("Success!");
      } catch {
        toast.error("Something went wrong!");
      }
    },
    [currentUser, hasFavourited, listingId, loginModal, router]
  );

  return {
    hasFavourited,
    toggleFavourite,
  };
};

export default useFavourite;
