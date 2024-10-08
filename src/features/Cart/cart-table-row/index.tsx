import { useCartsHooks } from "@/hooks/cart.hooks";
import { useDebounce } from "@/hooks/useDebounce.hooks";
import { ICreateCartItem, IUpdateCartItem } from "@/interface/cart.interface";
import { addToCart } from "@/services/cart.service";
import ButtonLoader from "@/shared/components/btn-loading";
import { TOAST_TYPES, showToast } from "@/shared/utils/toast-utils/toast.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useCart as useCartStore } from "@/store/cart";
import { useConfig as useConfigStores } from "@/store/config";
import { Input } from "@/shared/components/ui/input";
import CustomImage from "@/features/custom-image";
import { FallBackImg } from "@/shared/lib/image-config";

const CartTableRow = ({ item }: any) => {
  const { coupon } = useCartStore();
  const [quantity, setQuantity] = useState<number>(item?.quantity || 1);
  const stock: any = item?.selectedUnit?.stock;
  const queryClient = useQueryClient();
  const { configData } = useConfigStores();
  const { updateCartMutation, handleRemoveFromCart, cartDeleteLoading } =
    useCartsHooks(); //customHook

  const mutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      showToast(TOAST_TYPES.success, "Product Updated Successfully");
      queryClient.invalidateQueries(["getCartList"]);
      queryClient.invalidateQueries(["getCart"]);
      if (coupon) {
        queryClient.invalidateQueries(["addCoupon"]);
      }
    },
    onError: (error: any) => {
      showToast(TOAST_TYPES.error, error?.response?.data?.errors[0]?.detail);
    },
  });

  /*
   ** Provides payload to the update api when the value is being increased or decreased.
   */
  const handleUpdateCart = (newQuantity: number, itemId: number) => {
    if (newQuantity <= stock) {
      // const payload: IUpdateCartItem = {
      //     note: '',
      //     quantity: newQuantity,
      //     product_number: itemId,
      // }
      const payload: ICreateCartItem = {
        note: "",
        // variant_id: selectedPrice?.id,
        variant_id: itemId,
        quantity: newQuantity,
      };
      mutation.mutate(payload);
    }
  };

  /**
   * Used in order to debounce the value(quantity) that is being updated.
   */
  const debouncedHandleUpdateCart = useCallback(
    //debounce callback to call when value changes
    debounce((newQuantity) => {
      handleUpdateCart(newQuantity, item?.selectedUnit?.id!);
    }, 300),
    [item]
  );

  /**
   * For btn onClick function to pass the new value either being increased or decreased.
   */
  const updateCartCall = (newQuantity: number) => {
    setQuantity(newQuantity); //set the updated value
    debouncedHandleUpdateCart(newQuantity); //debounce callback added the updated value
  };

  // useEffect(() => {
  //     handleUpdateCart(debounceSearchValue);
  // }, [debounceSearchValue])
  const selectedUnit = item?.selectedUnit;
  const selectedImg = item?.product?.images.find(
    (img: any) => img?.unit_price_id === JSON.parse(selectedUnit?.id)
  );

  /**
   * To display toast if stock limit reached
   */
  // useEffect(() => {
  //     if (quantity === stock) {
  //         showToast(TOAST_TYPES.warning, 'Stock limit reached')
  //     }
  // }, [quantity])

  return (
    <tr className="border-b-gray-350">
      <td className="w-[150px] text-gray-650 text-center py-[30px] font-medium">
        <CustomImage
          src={
            selectedImg
              ? selectedImg?.imageName
              : item?.product?.images[0]?.imageName
          }
          height={80}
          width={80}
          quality={100}
          alt={item?.product?.name}
          className="m-auto aspect-square"
          fallback={FallBackImg}
        />
      </td>
      <td className="w-[435px] text-gray-650 text-center py-[30px] font-medium">
        <Link
          href={`/products/${item?.product?.slug}`}
          className="text-[15px] hover:text-primary"
          aria-label="indoor-plants"
        >
          {item?.product?.name}
          {/* <span className="block capitalize text-orange-4500">({item?.selectedUnit?.title})</span> */}
        </Link>
        {selectedUnit?.stock === 0 && (
          <p className="px-2 m-auto mt-2 text-xs text-orange-100 border border-orange-100 w-fit">
            Out Of Stock
          </p>
        )}
      </td>
      <td className="w-[435px] text-gray-650 text-center py-[30px] font-medium text-[15px]">
        {selectedUnit?.hasOffer && (
          <>
            <div className="flex flex-col">
              <span className="text-primary">
                {configData?.data?.currency} {item?.selectedUnit?.newPrice}
              </span>
              <span className="line-through">
                {configData?.data?.currency} {item?.selectedUnit?.oldPrice}
              </span>
            </div>
          </>
        )}
        {!selectedUnit?.hasOffer && (
          <>
            <span>
              {configData?.data?.currency} {item?.selectedUnit?.sellingPrice}
            </span>
          </>
        )}
      </td>
      <td className="w-[435px] text-gray-650 text-center py-[30px] font-medium">
        <div className="flex justify-center m-auto h-[40px] max-w-[115px]">
          <button
            className=" text-base text-gray-650 p-[5px]  border border-gray-350 transition-all delay-100 duration-150 hover:bg-slate-850 hover:text-primary disabled:cursor-not-allowed disabled:hover:opacity-50"
            onClick={() => {
              updateCartCall(quantity - 1);
            }}
            disabled={quantity === 1 ? true : false}
          >
            -
          </button>
          <Input
            type="text"
            className="w-full text-sm text-center min-w-[50px] bg-transparent rounded-none border-y border-x-0 border-y-gray-350 focus:outline-0"
            readOnly
            value={item?.quantity}
            maxLength={3}
          />
          <button
            className="text-base text-gray-650 p-[5px] border border-gray-350 transition-all delay-100 duration-150 hover:bg-slate-850 hover:text-primary disabled:cursor-not-allowed disabled:hover:opacity-50"
            onClick={() => {
              updateCartCall(quantity + 1);
            }}
            disabled={quantity === stock ? true : false}
          >
            +
          </button>
        </div>
      </td>
      <td className="text-gray-650 text-center py-[30px] font-medium text-[15px]">
        {selectedUnit?.hasOffer && (
          <>
            {configData?.data?.currency}{" "}
            {item?.selectedUnit?.newPrice * item?.quantity}
          </>
        )}
        {!selectedUnit?.hasOffer && (
          <>
            <span>
              {configData?.data?.currency}{" "}
              {item?.selectedUnit?.sellingPrice * item?.quantity}
            </span>
          </>
        )}
      </td>
      <td className="w-[100px] text-center py-[30px]">
        <button
          disabled={cartDeleteLoading}
          className="disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-0 border border-gray-350 flex items-center justify-center m-auto transition-all delay-100 duration-150 w-[40px] h-[36px] hover:bg-slate-850 hover:text-primary"
          onClick={() => handleRemoveFromCart(item?.id)}
        >
          {cartDeleteLoading ? (
            <ButtonLoader className="!border-primary" />
          ) : (
            <FaTimes className="w-[15px]" />
          )}
        </button>
      </td>
    </tr>
  );
};

export default CartTableRow;
