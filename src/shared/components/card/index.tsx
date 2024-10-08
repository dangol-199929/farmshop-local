import { getCookie } from "cookies-next";
import { debounce } from "lodash";
import { Heart, Loader2, Trash } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

import CustomImage from "@/features/custom-image";
import { useCartsHooks } from "@/hooks/cart.hooks";
import { useWishlists } from "@/hooks/wishlist.hooks";
import { ICartData, ICreateCartItem } from "@/interface/cart.interface";
import CartIconSVG from "@/shared/icons/cart";
import { useConfig as useConfigStores } from "@/store/config";
import { useQuery } from "@tanstack/react-query";

import { Button } from "../ui/button";
import { Props } from "./card.props";

const Card: React.FC<Props> = ({ product, cartItem }) => {
  const [logIn, setLogin] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  const loggedIn = getCookie("isLoggedIn");

  const stock: any = cartItem?.selectedUnit?.stock;

  // Store
  const { configData } = useConfigStores();

  // Hooks
  const { addFavMutation, removeFavMutation, addLoading, removeLoading } =
    useWishlists();
  const { updateCartMutation, handleRemoveFromCart, cartDeleteLoading } =
    useCartsHooks();

  // Query
  const { data: cart } = useQuery<ICartData>(["getCartList"]);

  const handleAddToCart = () => {
    const payload: ICreateCartItem = {
      note: "",
      variant_id: product?.id,
      quantity: quantity,
    };
    updateCartMutation.mutate(payload);
  };

  const handleUpdateCart = (newQuantity: number, itemId: number) => {
    if (newQuantity <= stock) {
      const payload: ICreateCartItem = {
        note: "",
        quantity: newQuantity,
        variant_id: itemId,
      };
      updateCartMutation.mutate(payload);
    }
  };

  const debouncedHandleUpdateCart = useCallback(
    debounce((newQuantity) => {
      handleUpdateCart(newQuantity, product?.id);
    }, 300),
    [cartItem]
  );

  const updateCartCall = (newQuantity: number) => {
    setQuantity(newQuantity);
    debouncedHandleUpdateCart(newQuantity);
  };

  const addToFav = (id: number) => {
    addFavMutation.mutate(id);
  };

  const removeFromFav = (id: number) => {
    removeFavMutation.mutate(id);
  };

  useEffect(() => {
    if (cartItem?.quantity) {
      setQuantity(cartItem?.quantity);
    }
  }, []);

  useEffect(() => {
    setLogin(loggedIn !== undefined);
  }, [loggedIn]);

  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl overflow-hidden group p-1">
      <div className="relative group-hover:scale-[1.01] transition-all duration-300">
        <Link href={`/products/${product?.slug}`}>
          <CustomImage
            src={
              product?.webpImages?.[0]?.imageName ||
              product?.images?.[0]?.imageName
            }
            alt={product?.name}
            width={260}
            height={260}
            className="w-full h-auto rounded-2xl aspect-square"
          />
        </Link>
        {logIn && (
          <Button
            variant="outlineSecondary"
            className="absolute top-2 right-2 p-0 z-[2] border-0 bg-white rounded-full aspect-square opacity-0 group-hover:opacity-100"
            onClick={() =>
              product?.isFav
                ? removeFromFav(product?.id!)
                : addToFav(product?.id)
            }
            disabled={addLoading || removeLoading}
          >
            {addLoading || removeLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Heart
                strokeWidth={1}
                className={`h-[1.8rem] w-[1.8rem] ${
                  product?.isFav
                    ? "fill-[#da1c5c] text-[#da1c5c]"
                    : "text-[#da1c5c]"
                }`}
              />
            )}
          </Button>
        )}
        {product?.hasOffer && (
          <p className="absolute px-2 py-1 text-xs font-medium text-white bg-orange-500 rounded-md bottom-2 left-2">
            Offer
          </p>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-base font-bold mb-0 text-slate-900 truncate">
          {product?.title}
        </h2>
        <Link
          href={`/categories/${product?.categorySlug}`}
          className="text-sm uppercase font-light text-primary hover:text-primary mb-0 -mt-1"
        >
          {product?.restaurantName}
        </Link>
        <div className="flex justify-between items-center mb-0 -mt-2">
          {product?.variants[0]?.hasOffer ? (
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900">
                {configData?.data?.currency} {product?.variants[0]?.newPrice}
              </span>
              <span className="text-sm line-through text-gray-500">
                {configData?.data?.currency} {product?.variants[0]?.oldPrice}
              </span>
            </div>
          ) : (
            <span className="text-base font-bold text-slate-900">
              {configData?.data?.currency} {product?.variants[0]?.sellingPrice}
            </span>
          )}
          {!cart?.cartProducts?.some(
            (item: any) => item?.product.id === product?.id
          ) ? (
            <Button
              variant="cart"
              onClick={handleAddToCart}
              disabled={updateCartMutation.isLoading}
            >
              {updateCartMutation.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CartIconSVG className="text-primary" />
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-2 border rounded-lg border-primary p-1">
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
                onClick={() =>
                  quantity === 1
                    ? handleRemoveFromCart(cartItem?.id!)
                    : updateCartCall(quantity - 1)
                }
                disabled={cartDeleteLoading}
              >
                {quantity === 1 ? (
                  cartDeleteLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash strokeWidth={3} className="h-3 w-3" />
                  )
                ) : (
                  <FaMinus className="h-3 w-3" />
                )}
              </Button>
              <span className="text-sm font-semibold min-w-[20px] text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
                onClick={() => updateCartCall(quantity + 1)}
                disabled={quantity === stock}
              >
                <FaPlus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
