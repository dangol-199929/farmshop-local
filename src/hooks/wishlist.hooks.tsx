import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllWishlistProducts,
  updateProductInWishlist,
} from "@/services/wishlist.service";
import { TOAST_TYPES, showToast } from "@/shared/utils/toast-utils/toast.utils";
import { useState } from "react";
import { getToken } from "@/shared/utils/cookies-utils/cookies.utils";

export const useWishlists = () => {
  const token = getToken();
  const queryClient = useQueryClient();

  const addFavMutation = useMutation({
    mutationFn: updateProductInWishlist,
    onSuccess: (data) => {
      showToast(TOAST_TYPES.success, data?.data?.message);
      queryClient.invalidateQueries(["wishlistProducts"]);
    },
  });

  const removeFavMutation = useMutation({
    mutationFn: updateProductInWishlist,
    onSuccess: (data) => {
      showToast(TOAST_TYPES.success, data?.data?.message);
      queryClient.invalidateQueries(["wishlistProducts"]);
      queryClient.invalidateQueries(["getWishlists"]);
    },
  });

  const { data: favList }: any = useQuery<any>(
    ["wishlistProducts", token, removeFavMutation, addFavMutation],
    async () => {
      const response = await getAllWishlistProducts(token);
      return response;
    },
    {
      enabled: !!token,
    }
  );

  return {
    addFavMutation,
    removeFavMutation,
    addLoading: addFavMutation.isLoading,
    removeLoading: removeFavMutation.isLoading,
    favList,
  };
};
