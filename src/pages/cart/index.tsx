import Link from "next/link";
import React, { useEffect, useState } from "react";
import { NextPageWithLayout } from "../_app";
import MainLayout from "@/shared/main-layout";
import Title from "@/shared/components/title";
import {
  ICartData,
  ICartItem,
  ICouponCartData,
  ICouponCartError,
} from "@/interface/cart.interface";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Head from "next/head";
import CartTableRow from "@/features/Cart/cart-table-row";
import EmptyCart from "../../shared/components/empty-content/empty-cart";
import { useCartsHooks } from "@/hooks/cart.hooks";
import ButtonLoader from "@/shared/components/btn-loading";
import { useCart as useCartStore } from "@/store/cart";
import { useConfig as useConfigStores } from "@/store/config";

import {
  addCouponCode,
  getCartData,
  getCartProduct,
} from "@/services/cart.service";
import { TOAST_TYPES, showToast } from "@/shared/utils/toast-utils/toast.utils";
import { useRouter } from "next/router";
import Breadcrumb from "@/shared/components/breadcrumb";
import { config } from "../../../config";
import axios from "axios";

enum COUPON_METHODS {
  ADD_COUPON = "Apply Coupon",
  DELETE_COUPON = "Remove Coupon",
}

const Cart: NextPageWithLayout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [tempCoupon, setTempCoupon] = useState("");
  const { configData } = useConfigStores();
  const { coupon, setCoupon, setCouponData, couponData } = useCartStore();

  const [couponText, setCouponText] = useState<COUPON_METHODS>(
    COUPON_METHODS.ADD_COUPON
  );
  const { data: cart } = useQuery<ICartItem>(["getCart"], () =>
    getCartData({ coupon })
  );
  const { data: cartData } = useQuery<ICartData>(
    ["getCartList"],
    getCartProduct
  );
  const { bulkCartDelete, bulkDeleteLoading } = useCartsHooks();

  const {
    data: couponCartData,
    isError,
    isSuccess,
    error: couponCartError,
  } = useQuery<ICouponCartData, ICouponCartError[]>(
    ["addCoupon", coupon],
    async () => addCouponCode(coupon),
    {
      onSuccess: (data) => {
        setCouponData(data);
        showToast(TOAST_TYPES.success, "Coupon Added Successfully");
      },
      onError: (error) => {
        setCouponData({});
        if (localStorage.getItem("coupon")) {
          localStorage.removeItem("coupon");
        }
        setCouponText(COUPON_METHODS.ADD_COUPON);
        setCoupon("");
        setTempCoupon("");
        showToast(TOAST_TYPES.error, error[0]?.detail);
        queryClient.invalidateQueries(["getCart"]);
      },
      enabled: !!coupon,
      retry: false,
    }
  );

  const clearCart = () => {
    bulkCartDelete.mutate();
  };

  //checking if there is any item which is out of stock
  const hasOutOfStock = cartData?.cartProducts.find(
    (item) => item?.selectedUnit?.stock === 0
  )
    ? true
    : false;

  const handleApplyCoupon = () => {
    setCoupon(tempCoupon);
    localStorage.setItem("coupon", tempCoupon);
    setCouponText(COUPON_METHODS.DELETE_COUPON);

    queryClient.invalidateQueries(["addCoupon"]);
  };

  const handleRemoveCoupon = () => {
    if (localStorage.getItem("coupon")) {
      localStorage.removeItem("coupon");
    }
    setCouponText(COUPON_METHODS.ADD_COUPON);
    setCoupon("");
    setTempCoupon("");
    setCouponData({});
    queryClient.invalidateQueries(["getCart"]);
    showToast(TOAST_TYPES.success, "Coupon Removed Successfully");
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (couponText === COUPON_METHODS.ADD_COUPON) {
      handleApplyCoupon();
    } else {
      handleRemoveCoupon();
    }
  };

  useEffect(() => {
    if (window && localStorage && localStorage.getItem("coupon")) {
      setTempCoupon(localStorage.getItem("coupon") as any);
      setCoupon(localStorage.getItem("coupon") as any);
      setCouponText(COUPON_METHODS.DELETE_COUPON);
    }
  }, []);
  // }, [localStorage, window]);

  useEffect(() => {
    if (cart?.message != null) {
      showToast(TOAST_TYPES.success, cart?.message);
    }
  }, [cart]);

  /**
   * To show success message when coupon api is success.
   */
  // useEffect(() => {
  //   if (isSuccess) {
  //     showToast(TOAST_TYPES.success, 'Coupon Added Successfully')
  //   }
  // }, [coupon])

  /**
   * when coupon api throws error
   */
  useEffect(() => {
    if (isError && couponCartError) {
      setCouponData({});
    }
  }, [isError, couponCartError]);

  return (
    <>
      <Head>
        <title>Farmshop | Cart</title>
      </Head>
      {cartData?.cartProducts?.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <Breadcrumb />
          <div className="container my-[60px]">
            <Title
              type=""
              className="text-2xl text-slate-850 font-semibold mb-[30px]"
              text="Your cart Items"
            />
            <div className="overflow-x-auto">
              <table className="table border cart-table border-gray-350">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Unit Price</th>
                    <th>QTY</th>
                    <th>Sub Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartData?.cartProducts?.map((item: any, index: number) => (
                    <CartTableRow item={item} key={index} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col sm:flex-row gap-[10px] items-start sm:items-center justify-between mt-[30px] mb-[60px]">
              <Link
                href="/"
                className="block bg-gray-150 font-bold px-[63px] py-[17px] rounded-[50px] text-slate-850 text-sm uppercase leading-[1] hover:bg-primary hover:text-white transition-all"
              >
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                disabled={bulkDeleteLoading}
                className=" bg-gray-150 font-bold px-[63px] flex items-center gap-3 py-[17px] rounded-[50px] text-slate-850 text-sm uppercase leading-[1] hover:bg-primary hover:text-white transition-all"
              >
                Clear Shopping Cart
                {bulkDeleteLoading && (
                  <ButtonLoader className="block !border-primary" />
                )}
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-[40px] items-start justify-between mb-[60px]">
              <div className="checkout-card w-full sm:w-[370px]">
                <div className="checkout-card-header">
                  <h4 className="inline-block text-lg pr-[18px] bg-slate-250 text-slate-850 relative font-bold z-[2] leading-[20px]">
                    Use Coupon Code
                  </h4>
                </div>
                <div className="mt-[20px]">
                  <p className="text-sm mb-4 leading-[24px]">
                    Enter your coupon code if you have one.
                  </p>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      value={tempCoupon}
                      disabled={
                        couponText === COUPON_METHODS.DELETE_COUPON
                          ? true
                          : false
                      }
                      onChange={(e) => setTempCoupon(e.target.value)}
                      className="bg-white border border-gray-350 h-[45px] mb-[30px] pl-2.5 w-full focus:outline-0 disabled:opacity-70 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    />
                    <button
                      type="submit"
                      disabled={tempCoupon === "" || tempCoupon === null}
                      className=" disabled:bg-gray-450 disabled:opacity-50 disabled:cursor-not-allowed bg-primary  text-sm uppercase font-bold px-[42px] py-[13px] rounded-[50px] text-white hover:opacity-80"
                    >
                      {couponText}
                    </button>
                  </form>
                </div>
              </div>
              <div className="checkout-card">
                <div className="checkout-card-header">
                  <h4 className="inline-block text-lg pr-[18px] bg-slate-250 text-slate-850 relative font-bold z-[2] leading-[20px]">
                    Cart Total
                  </h4>
                </div>
                <div className="flex items-center justify-between w-full mt-[36px] mb-[27px]">
                  <p className="text-sm font-semibold">Total products</p>
                  <p className="text-lg font-bold">
                    {configData?.data?.currency}{" "}
                    {couponData?.orderAmount
                      ? couponData?.orderAmount
                      : cart?.orderAmount}
                  </p>
                </div>
                {(couponData?.discountAmount > 0 ||
                  cart?.discountAmount! > 0) && (
                  <div className="flex items-center justify-between w-full mt-[36px] mb-[27px]">
                    <p className="text-sm font-semibold">Discount</p>
                    <p className="text-lg font-bold">
                      {configData?.data?.currency}{" "}
                      {couponData?.discountAmount
                        ? couponData?.discountAmount
                        : cart?.discountAmount}
                    </p>
                  </div>
                )}
                {couponData?.couponDiscount && (
                  <div className="flex items-center justify-between w-full mt-[36px] mb-[27px]">
                    <p className="text-sm font-semibold">Coupon Discount</p>
                    <p className="text-lg font-bold">
                      {configData?.data?.currency} {couponData?.couponDiscount}
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between w-full mt-[36px] mb-[27px]">
                  <p className="text-sm font-semibold">Subtotal</p>
                  <p className="text-lg font-bold">
                    {configData?.data?.currency}{" "}
                    {couponData?.subTotal
                      ? couponData?.subTotal
                      : cart?.subTotal}
                  </p>
                </div>
                {(couponData?.deliveryCharge > 0 ||
                  cart?.deliveryCharge! > 0) && (
                  <div className="flex items-center justify-between w-full mt-[36px] mb-[27px]">
                    <p className="text-sm font-semibold">Delivery Charge</p>
                    <p className="text-lg font-bold">
                      {configData?.data?.currency}{" "}
                      {couponData?.deliveryCharge
                        ? couponData?.deliveryCharge
                        : cart?.deliveryCharge}
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between w-full mb-[20px] text-primary">
                  <p className="text-xl font-bold">Grand Total</p>
                  <p className="text-xl font-bold">
                    {configData?.data?.currency}{" "}
                    {couponData?.total ? couponData?.total : cart?.total}
                  </p>
                </div>
                <button
                  onClick={() => router.push("/checkout")}
                  disabled={hasOutOfStock}
                  className="disabled:bg-gray-450 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-auto bg-primary text-sm uppercase font-bold px-[42px] py-[13px] rounded-[50px] text-white w-full"
                >
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;

Cart.getLayout = (page) => {
  const configData = page?.props;
  return <MainLayout configData={configData}>{page}</MainLayout>;
};

export async function getServerSideProps() {
  const baseUrl = config?.gateway?.apiURL;
  const endPoint1 = config?.gateway?.apiEndPoint1;
  const apiUrl = `${baseUrl}/${endPoint1}/configs`;
  const response: any = await axios.get(apiUrl, {
    headers: {
      Accept: "application/json",
      "Api-Key": config.gateway.apiKey,
    },
  });
  return {
    props: response?.data,
  };
}
