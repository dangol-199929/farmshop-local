import { ICartData, ICartItem } from '@/interface/cart.interface';
import { IPaymentMethod, PaymentFormProps } from '@/interface/home.interface';
import { useCart } from '@/store/cart';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useConfig as useConfigStores } from '@/store/config';
import { getToken } from '@/shared/utils/cookies-utils/cookies.utils';
import { IDeliveryAddress } from '@/interface/delivery-address.interface';

interface CheckoutDetailProps {
  selectedPayment: IPaymentMethod | null;
  deliveryAddress: IDeliveryAddress //Need to change according to the response.
  isHomeDelivery: boolean
}

const CheckoutDetail: React.FC<CheckoutDetailProps> = ({ selectedPayment, deliveryAddress, isHomeDelivery }) => {
  // Selected payment method
  const token = getToken()

  const { configData } = useConfigStores();
  //Get cart Data
  const { data: cart } = useQuery<ICartItem>(["getCart"])
  const { data: cartData } = useQuery<ICartData>(['getCartList'])
  const { couponData } = useCart();
  return (
    <>
      <div className="py-[38px] px-[45px] bg-slate-150">
        <ul className="flex justify-between font-bold text-[16px] text-slate-850">
          <li>Product</li>
          <li>Total</li>
        </ul>
        <div className="my-[29px] py-[18px] border-t-[1px]  border-b-[1px] border-light-gray border-solid">
          <ul className="">
            {cartData?.cartProducts.map((productData: any, index: any) => (
              <li className="flex justify-between" key={index}>
                <span className='text-sm'> {productData?.product?.name} X {productData?.quantity} </span>
                {
                  productData?.product?.hasOffer ? (
                    <span className='min-w-[90px] text-end text-sm'>{configData?.data?.currency} {productData.selectedUnit.newPrice *
                      productData.quantity} </span>
                  ) : (
                    <span className='min-w-[90px] text-end text-sm'>{configData?.data?.currency} {productData.selectedUnit.sellingPrice *
                      productData.quantity} </span>
                  )
                }
              </li>

            ))}
          </ul>
        </div>
        <ul className="flex justify-between">
          <li className="font-semibold text-[16px] text-slate-850">
            Order Amount
          </li>
          <li className="text-[14px]">{configData?.data?.currency} {couponData?.orderAmount ? couponData?.orderAmount : cart?.orderAmount}</li>
        </ul>
        {
          (couponData?.discountAmount > 0 || cart?.discountAmount! > 0) &&
          <ul className="flex justify-between">
            <li className="font-semibold text-[16px] text-slate-850">
              Discount
            </li>
            <li className="text-[14px]">{configData?.data?.currency} {couponData?.discountAmount ? couponData?.discountAmount : cart?.discountAmount}</li>
          </ul>
        }
        {
          couponData?.couponDiscount &&
          <ul className="flex justify-between">
            <li className="font-semibold text-[16px] text-slate-850">
              Coupon Discount
            </li>
            <li className="text-[14px]">{configData?.data?.currency} {couponData?.couponDiscount}</li>
          </ul>
        }
        <ul className="flex justify-between">
          <li className="font-semibold text-[16px] text-slate-850">
            Cart Subtotal
          </li>
          <li className="text-[14px]">{configData?.data?.currency} {couponData?.subTotal ? couponData?.subTotal : cart?.subTotal}</li>
        </ul>


        {isHomeDelivery &&
          (couponData?.deliveryCharge > 0 || cart?.deliveryCharge! > 0) &&
          <ul className="flex justify-between">
            <li className="font-semibold text-[16px] text-slate-850">
              Delivery Charge
            </li>
            <li className="text-[14px]">{configData?.data?.currency} {couponData?.deliveryCharge ? couponData?.deliveryCharge : cart?.deliveryCharge}</li>
          </ul>
        }
        <div className="mt-[18px] mb-[33px] py-[18px] border-t-[1px]  border-b-[1px] border-light-gray border-solid">
          <ul className=" flex justify-between mb-[20px]">
            <li className="font-bold text-[18px]">Total</li>
            <li className="font-bold text-primary">{configData?.data?.currency}{' '}
              {
                !isHomeDelivery ? (
                  couponData && couponData?.total ? (couponData?.total - couponData?.deliveryCharge) : cart && (cart?.total - cart?.deliveryCharge)
                ) : (
                  couponData?.total ? couponData?.total : cart?.total
                )
              }
            </li>
          </ul>
          {
            token && isHomeDelivery && deliveryAddress && (
              <ul className=" flex justify-between mb-[20px]">
                <li className="font-bold text-[18px] min-w-[150px]">Delivery Address</li>
                <li className="font-bold text-normal text-gray-650">{deliveryAddress?.shortAddress ? deliveryAddress?.shortAddress : deliveryAddress?.address}</li>
              </ul>
            )
          }
          <ul className="flex justify-between">
            <li className="font-bold text-[18px]">Payment method</li>
            {selectedPayment && (
              <li className="font-bold text-[16px] text-gray-650">
                {selectedPayment.title}
              </li>
            )}
          </ul>
        </div>
      </div>
    </>

  )
}

export default CheckoutDetail