import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import {
  ICartData,
  ICartItem,
  ICouponCartData,
} from "@/interface/cart.interface";
import {
  addCouponCode,
  getCartData,
  getCartProduct,
} from "@/services/cart.service";
import { useCart as useCartStores } from "@/store/cart";
import { useConfig as useConfigStores } from "@/store/config";
import { useQuery } from "@tanstack/react-query";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import CartDropdownProducts from "./cart-products";
import { Badge } from "../ui/badge";

const CartDropdown = () => {
  const router = useRouter();

  const { configData } = useConfigStores();
  const { data: cartList } = useQuery<ICartData>(
    ["getCartList"],
    getCartProduct
  );
  const { coupon, setCoupon, couponData, setCouponData } = useCartStores();

  const enableCouponCall = coupon && cartList?.cartProducts?.length! > 0;

  const { data: couponCartData } = useQuery<ICouponCartData>({
    queryKey: ["addCoupon", coupon],
    queryFn: async () => addCouponCode(coupon),
    enabled: !!enableCouponCall,
    retry: false,
  });
  const { data: cart } = useQuery<ICartItem>({
    queryKey: ["getCart"],
    queryFn: () => getCartData({ coupon: "" }),
    enabled: true,
  });
  // const { data: cart } = useQuery<ICartItem>(['getCart'], () => getCartData({ coupon }));
  //checking if there is any item which is out of stock
  const hasOutOfStock = cartList?.cartProducts.find(
    (item) => item?.selectedUnit?.stock === 0
  )
    ? true
    : false;
  useEffect(() => {
    if (window && localStorage && localStorage.getItem("coupon")) {
      setCoupon(localStorage.getItem("coupon") as string);
    }
  }, [coupon]);
  // }, [window, localStorage, coupon])

  useEffect(() => {
    if (couponCartData) {
      setCouponData(couponCartData);
    }
  }, [couponCartData]);

  useEffect(() => {
    if (cartList?.cartProducts.length === 0) {
      if (localStorage.getItem("coupon")) {
        localStorage.removeItem("coupon");
      }
      setCouponData({});
      setCoupon("");
    }
  }, [cartList]);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="lg"
            className="flex items-center gap-3 justify-center rounded-2xl"
          >
            <div className="relative">
              <ShoppingCart size={22} color="#414042" />
              <Badge
                variant={"secondary"}
                className="absolute -top-1 -right-2 px-1"
              >
                {cartList?.cartProducts?.length || 0}
              </Badge>
            </div>
            <div className="text-left">
              <div className="text-base font-medium text-[#414042] whitespace-nowrap">
                Your Cart
              </div>
              <div className="text-xs font-bold text-gray-500">
                {" "}
                {configData?.data?.currency}{" "}
                {couponData?.orderAmount
                  ? couponData?.orderAmount
                  : cart?.orderAmount || 0}
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[300px] md:w-[350px] rounded-2xl border-none p-[25px]"
        >
          <div
            className={`max-h-42 overflow-auto ${
              cartList?.cartProducts?.length === 0 ? "" : "pb-[10px]"
            }`}
          >
            {!cartList || cartList?.cartProducts?.length === 0 ? (
              <p className="text-sm font-bold text-center text-slate-850">
                No Products in the cart.
              </p>
            ) : (
              <>
                <div className="overflow-y-scroll max-h-[250px]">
                  {cartList &&
                    cartList?.cartProducts?.map((item: any, index: number) => (
                      <CartDropdownProducts item={item} key={index} />
                    ))}
                </div>
                {/* pricing list */}
                <div className="my-[25px]">
                  <p className="flex justify-between mb-1 font-normal text-gray-450">
                    Order Amount :{" "}
                    <span>
                      {configData?.data?.currency}{" "}
                      {couponData?.orderAmount
                        ? couponData?.orderAmount
                        : cart?.orderAmount}
                    </span>
                  </p>
                  {(couponData?.discountAmount > 0 ||
                    cart?.discountAmount! > 0) && (
                    <p className="flex justify-between mb-1 font-normal text-gray-450">
                      Discount :{" "}
                      <span>
                        {configData?.data?.currency}{" "}
                        {couponData?.discountAmount
                          ? couponData?.discountAmount
                          : cart?.discountAmount}
                      </span>
                    </p>
                  )}
                  {couponData?.couponDiscount && (
                    <p className="flex justify-between mb-1 font-normal text-gray-450">
                      Coupon Discount :{" "}
                      <span>
                        {configData?.data?.currency}{" "}
                        {couponData?.couponDiscount}
                      </span>
                    </p>
                  )}
                  <p className="flex justify-between mb-1 font-normal text-gray-450">
                    Subtotal :{" "}
                    <span>
                      {configData?.data?.currency}{" "}
                      {couponData?.subTotal
                        ? couponData?.subTotal
                        : cart?.subTotal}
                    </span>
                  </p>

                  {(couponData?.deliveryCharge > 0 ||
                    cart?.deliveryCharge! > 0) && (
                    <p className="flex justify-between mb-1 font-normal text-gray-450">
                      Delivery charge :{" "}
                      <span>
                        {configData?.data?.currency}{" "}
                        {couponData?.deliveryCharge
                          ? couponData?.deliveryCharge
                          : cart?.deliveryCharge}
                      </span>
                    </p>
                  )}
                  <p className="flex justify-between text-slate-850">
                    Total :{" "}
                    <span>
                      {configData?.data?.currency}{" "}
                      {couponData?.total ? couponData?.total : cart?.total}
                    </span>
                  </p>
                </div>
                <div className="[&>*:first-child]:mb-4">
                  <DropdownMenuItem
                    className={`h-auto py-3.5 cursor-pointer font-normal w-full text-center block bg-gray-150 text-sm transition-all text-slate-850 rounded-3xl hover:bg-primary hover:text-white`}
                    onClick={() => router.push("/cart")}
                    aria-label="cart"
                  >
                    CART
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={hasOutOfStock}
                    className="block w-full h-auto py-3.5 cursor-pointer text-sm font-normal text-center transition-all text-slate-850 bg-gray-150 rounded-3xl hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:pointer-events-auto "
                    onClick={() => router.push("/checkout")}
                  >
                    CHECKOUT
                  </DropdownMenuItem>
                </div>
              </>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CartDropdown;
