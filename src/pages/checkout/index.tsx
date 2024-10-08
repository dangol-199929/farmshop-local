import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/shared/components/ui/dialog";
import { AccordionNormal, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/components/ui/accordion-normal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { TiTick } from "react-icons/ti";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { NextPageWithLayout } from "../_app";

import MainLayout from "@/shared/main-layout";

import { IDeliveryAddress } from "@/interface/delivery-address.interface";
import { IPaymentMethod } from "@/interface/home.interface";
import { IRegister } from "@/interface/register.interface";
import { ICartData } from "@/interface/cart.interface";

import { getDeliverAddress } from "@/services/delivery-address.service";
import { registerGuestUser } from "@/services/auth.service";
import { associateCart, getCartProduct } from "@/services/cart.service";
import { checkout } from "@/services/checkout.service";

import { getToken } from "@/shared/utils/cookies-utils/cookies.utils";
import { showToast, TOAST_TYPES } from "@/shared/utils/toast-utils/toast.utils";
import { useConfig as useConfigStores } from '@/store/config';
import { useCart as useCartStores } from '@/store/cart';

import { PaymentMethod } from "@/shared/enum";
import ButtonLoader from "@/shared/components/btn-loading";
import Breadcrumb from "@/shared/components/breadcrumb";
import ConfirmationModal from "@/shared/components/confirmation-modal";

import Address from "@/features/Address";
import GuestLoginModal from "@/features/Checkout/deliver/guestlogin-form-modal";
import PersonalInformation from "@/features/Checkout/deliver/personal-information";
import OrderNote from "@/features/Checkout/deliver/order-note";
import CheckoutDetail from "@/features/Checkout/deliver/checkout-detail";
import CheckoutPayment from "@/features/Checkout/checkout-payment";
import GuestUserAddress from "@/features/Checkout/deliver/checkout-address/guest-user-address";
import GuestContent from "@/features/Checkout/guest";
import Image from "next/image";
import { checkoutImg } from "@/shared/lib/image-config";
import DeliveryIcon from "@/shared/icons/common/DeliveryIcon";
import PickupIcon from "@/shared/icons/common/PickupIcon";
import PickupAddress from "@/features/Checkout/pickup/pickup-address";
import PickupOption from "@/features/Checkout/pickup/pickup-option";
import { format, parse } from "date-fns";
import { config } from "../../../config";
import axios from "axios";

const Checkout: NextPageWithLayout = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showLoginConfirmModal, setShowLoginConfirmModal] = useState<boolean>(false);
  const [checkoutGuestUserData, setCheckoutGuestUserData] = useState<IRegister | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [personalOpen, setPersonalOpen] = useState<boolean>(true);
  const [addressOpen, setAddressOpen] = useState<boolean>(false);
  const [paymentOpen, setPaymentOpen] = useState<boolean>(false);
  const [placeBtnDisable, setPlaceBtnDisable] = useState<boolean>(false);
  const [placeOrdered, setPlaceOrdered] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");

  const token = getToken()
  //Get Config Data
  const { configData } = useConfigStores();

  //Get Coupon Data
  const { couponData } = useCartStores()

  const setGuestUserData = (data: IRegister | null) => {
    setCheckoutGuestUserData(data);
  };

  const { data: cartData } = useQuery<ICartData>(['getCartList'], getCartProduct);
  const { data: deliveryAddressData, refetch: getDeliveryAddress } = useQuery({
    queryKey: ["getDeliverAddress", token],
    queryFn: getDeliverAddress,
    enabled: !!token
  });

  const queryClient = useQueryClient();

  const [personalInfoSubmitted, setPersonalInfoSubmitted] = useState<boolean>(false);
  const [showAssociateCartModal, setAssociateCartModal] = useState<boolean>(false);
  const [addressFilled, setAddressFilled] = useState<boolean>(false)
  const [addressCollapseDisabled, setAddressCollapseDisabled] = useState<boolean>(true);
  const [addressFormValidated, setAddressFormValidated] = useState<boolean>(false);
  const [addressFormData, setAddressFormData] = useState<boolean>(false);
  const [paymentCollapseOpen, setPaymentCollapseOpen] = useState<boolean>(false);

  const [accordionItem, setAccordionItem] = useState<string>("item-1")
  const [pickupAccordion, setPickupAccordion] = useState<string>("item-1")

  /**
   * Displaying the delivery address if in tab homeDelivery
   */
  const [isHomeDelivery, setIsHomeDelivery] = useState<boolean>(true)
  const deliveryAddress = deliveryAddressData?.find((address: any) => address.isDefault);


  /**
   * Outlet states
   */
  const [outletId, setOutletId] = useState<number>(0)
  const [outletChecked, setOutletChecked] = useState<boolean>(false)

  /**
 * Pickup option states
 */
  const [pickupSelected, setPickupSelected] = useState<string>("self")
  const [pickupData, setPickupData] = useState<any>({})
  const [pickupFilled, setPickupFilled] = useState<boolean>(false)

  /**
   * Next button functions accordionItems in tab 'pickup'
   */
  const handleOutletNext = () => {
    setOutletChecked(true)
    setPickupAccordion("item-2")
  }

  const handlePickupNext = () => {
    setPickupFilled(true)
    setPickupAccordion("item-3")
  }

  const handleAddressSubmitGuest = (e: any) => {
    e.preventDefault();
    if (guestformData.lat === 0 || guestformData.lng === 0) {
      showToast(TOAST_TYPES.error, 'Please select a location');
      return;
    }
    setAddressFormValidated(true);
    if (guestformData.lat && guestformData.lng && guestformData.title) {
      setAddressFormValidated(false);
    } else {

      setAddressFormValidated(false);
    }

  };

  const handleNextButtonClick = () => {
    setPaymentCollapseOpen(true);
    setAddressFilled(true)
    setAddressOpen(false)
    setPaymentOpen(true)
    setAccordionItem("item-2")
    if (formData?.lat === 0 || formData?.lng === 0) {
      setAddressFormData(true);
    }
  };

  const [selectedPayment, setSelectedPayment] = useState<IPaymentMethod | null>(null);
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState(null);
  const [formData, setFormData] = useState<IDeliveryAddress>({
    address: '',
    mobile_number: '',
    name: '',
    default: false,
    lat: 0,
    lng: 0,
    title: ''
  });

  const [guestformData, setGuestFormData] = useState<IDeliveryAddress>({
    address: '',
    mobile_number: '',
    name: '',
    default: false,
    lat: 0,
    lng: 0,
    title: '',
    id: 0
  });

  // //Open Login Modal
  // const openLoginModal = () => {
  //   setShowLoginConfirmModal(true);
  // };

  const openLoginFormModal = () => {
    setShowLoginModal(true);
    setShowLoginConfirmModal(false);
  };

  const associateCartModal = async (value: string) => {
    const associateCartResponse: any = await associateCart(token, value);
    if (associateCartResponse) {
      queryClient.invalidateQueries(['getCart'])
      queryClient.invalidateQueries(['getCartList'])
      queryClient.invalidateQueries(['getProfile'])
      router.push('/checkout');
      setAssociateCartModal(false);
    } else {
      setAssociateCartModal(false);
    }
  };

  // Checkout Place order
  const handlePlaceOrder = async () => {
    setPlaceBtnDisable(true)
    if (token) {
      const couponCode = couponData?.code
      const selectedPaymentMethodId = selectedPayment?.id;

      if (isHomeDelivery) {
        const selectedDeliveryAddressId = selectedDeliveryAddress;

        const payload = {
          delivery_address_id: selectedDeliveryAddressId,
          payment_method_id: selectedPaymentMethodId,
          note: note,
          // coupon: coupon,
        }
        checkout(payload, couponCode)
          .then((res) => {
            switch (selectedPayment?.title) {
              case PaymentMethod.CASH_ON_DELIVERY:
                checkoutSuccessfulRedirect();
                break;
              case PaymentMethod.ESEWA:
                redirectPaymentPortal(res?.data?.data)
                break;
              case PaymentMethod.KHALTI:
                redirectPaymentPortal(res?.data?.data)
                break;
            }
            queryClient.invalidateQueries(['getCart']);
            queryClient.invalidateQueries(['getCartList']);
            setPlaceBtnDisable(false)
          })

          .catch((error) => {
            setPlaceBtnDisable(false)
            const errors = error?.response?.data?.errors
            errors.map((err: any) => {
              showToast(TOAST_TYPES.error, err.detail);
            })
          });
      } else {
        // Parse the input value as a Date
        const parsedTime = parse(pickupData?.time, 'HH:mm', new Date());
        // Format the Date as "HH:mm:ss"
        const formattedTime = format(parsedTime, 'HH:mm:ss');

        const payload = {
          outlet_id: outletId,
          contact_number: pickupData?.phoneNumber,
          name: pickupData?.name,
          pickup_schedule_time: `${format(pickupData?.date, "yyyy-MM-dd")} ${formattedTime}`,
          payment_method_id: selectedPaymentMethodId,
          note: note,
          // coupon: coupon,
        }
        checkout(payload, couponCode)
          .then((res) => {
            switch (selectedPayment?.title) {
              case PaymentMethod.CASH_ON_DELIVERY:
                checkoutSuccessfulRedirect();
                break;
              case PaymentMethod.ESEWA:
                redirectPaymentPortal(res?.data?.data)
                break;
              case PaymentMethod.KHALTI:
                redirectPaymentPortal(res?.data?.data)
                break;
            }
            queryClient.invalidateQueries(['getCart']);
            queryClient.invalidateQueries(['getCartList']);
            setPlaceBtnDisable(false)
          })

          .catch((error) => {
            setPlaceBtnDisable(false)
            const errors = error?.response?.data?.errors
            errors.map((err: any) => {
              showToast(TOAST_TYPES.error, err.detail);
            })
          });
      }
    } else {
      setPlaceBtnDisable(false)
      showToast(TOAST_TYPES.error, 'Please Add Personal Detail and click on the Next button');
    }
  };

  const checkoutSuccessfulRedirect = () => {
    goToCheckoutReviewPage(true);
    setPlaceOrdered(true);
    showToast(TOAST_TYPES.success, 'Checkout Successful.');
  };

  const goToCheckoutReviewPage = (success: any) => {
    router.push({
      pathname: '/checkout/review',
      query: { success: success.toString() },
    });
  };

  /**
    * Redirect to payment portal
    */
  const redirectPaymentPortal = (data: any) => {
    if (data?.url) {
      window.open(data?.url, '_self')
    } else {
      goToCheckoutReviewPage(false)
    }
  }

  useEffect(() => {
    const defaultPayment = configData?.data?.paymentMethods?.find((payment: IPaymentMethod) => payment.isDefault);
    if (defaultPayment) {
      setSelectedPayment(defaultPayment);
    }

    const defaultAddress = deliveryAddressData?.find((address: any) => address.isDefault);
    if (defaultAddress) {
      setSelectedDeliveryAddress(defaultAddress.id);
    }

    if (cartData?.cartProducts.length === 0 && !placeOrdered) {
      router.push('/');
    }

  }, [configData?.data?.paymentMethods, deliveryAddressData, cartData]);


  useEffect(() => {
    if (token) {
      setAddressOpen(true);
    }
  }, [token])

  return (
    <div>
      <Breadcrumb />
      <div className="mt-[60px] mb-[40px]">
        <div className="container">
          <h3 className="mb-12 text-3xl font-bold">Your Order</h3>
          {
            !token &&
            <p>
              Already have an account?
              <Dialog open={showLoginConfirmModal} onOpenChange={setShowLoginConfirmModal}>
                <DialogTrigger>
                  <p className="ml-3 cursor-pointer text-primary">Log in</p>
                </DialogTrigger>
                <DialogContent>
                  <ConfirmationModal
                    confirmHeading="Are you sure you want to login?"
                    modalType="delete_account_modal"
                    btnName="Continue"
                    showModal={showLoginConfirmModal}
                    btnFunction={openLoginFormModal}
                    cancelFuntion={() => setShowLoginConfirmModal(false)}
                    isLoading={false}
                  />
                </DialogContent>
              </Dialog>
            </p>
          }

          {/* Guest Login Modal */}
          <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
            <DialogContent className="modal-content">
              <GuestLoginModal setAssociateCartModal={setAssociateCartModal} setShowLoginModal={setShowLoginModal} />
            </DialogContent>
          </Dialog>

          {/* Associate Cart Modal */}
          <Dialog open={showAssociateCartModal} onOpenChange={setAssociateCartModal}>
            <DialogContent className="modal-content">
              <ConfirmationModal
                confirmHeading="You already have items. Do you want to delete your previous items?"
                modalType="delete_account_modal"
                btnName="Merge"
                cancelBtnName="Remove"
                showModal={showAssociateCartModal}
                btnFunction={() => associateCartModal('false')}
                cancelFuntion={() => associateCartModal('true')}
                isLoading={false}
              />
            </DialogContent>
          </Dialog>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-7">
              {
                !token ? (
                  <GuestContent
                    accordionItem={accordionItem}
                    setAccordionItem={setAccordionItem}
                    personalInfoSubmitted={personalInfoSubmitted}
                    addressCollapseDisabled={addressCollapseDisabled}
                    setAddressCollapseDisabled={setAddressCollapseDisabled}
                    setPersonalInfoSubmitted={setPersonalInfoSubmitted}
                    checkoutGuestUserData={checkoutGuestUserData}
                    setGuestUserData={setGuestUserData}
                    setPersonalOpen={setPersonalOpen}
                    setAddressOpen={setAddressOpen}
                    paymentCollapseOpen={paymentCollapseOpen}
                    addressFilled={addressFilled}
                  />
                ) : (
                  <Tabs defaultValue="delivery" className="w-full">
                    <TabsList className="flex-wrap h-auto gap-4 ">
                      <TabsTrigger value="delivery"
                        onClick={() => { setIsHomeDelivery(true) }}
                        className="flex items-center flex-col xs:flex-row h-auto xs:h-[60px] xs:gap-3 py-1.5 px-4 border text-xs xs:text-normal border-gray-550 text-gray-550"
                      >
                        <DeliveryIcon className="" />
                        Home Delivery
                      </TabsTrigger>
                      <TabsTrigger value="pickup"
                        onClick={() => { setIsHomeDelivery(false) }}
                        className="flex items-center flex-col xs:flex-row h-auto xs:h-[60px] xs:gap-3 py-1.5 px-4 border text-xs xs:text-normal border-gray-550 text-gray-550"
                      >
                        <PickupIcon />
                        Pick Up
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="delivery">
                      {/* Accordion Start */}
                      <AccordionNormal defaultValue={accordionItem} value={accordionItem} type="single" collapsible className="w-full">

                        {/* Address Accordion */}
                        <AccordionItem
                          value={'item-1'}
                          className="p-4 border-solid border-[1px] border-gray-1200 mt-6">
                          <AccordionTrigger onClick={() => setAccordionItem("item-1")} className={` w-full no-underline hover:no-underline`}>
                            <div className="flex items-center justify-between flex-grow text-xl font-medium border-none collapse-title">
                              <div className="text-left col-10">
                                <h5 className="text-[16px] font-semibold">
                                  {" "}
                                  1. Address{" "}
                                </h5>
                              </div>
                              <div className="text-right col-2">
                                <span className="text-white text">
                                  <TiTick
                                    size={20}
                                    className={`rounded-full ${addressFilled ? 'bg-primary' : 'bg-gray-650'}`}
                                  />
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-12 gap-5 p-4">
                              <Address
                                formData={formData}
                                setFormData={setFormData}
                                setShowModal={setShowModal}
                                showCreateModal={showCreateModal}
                                setShowCreateModal={setShowCreateModal}
                                showModal={showModal}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing} />

                            </div>
                            <div className="text-right">
                              <button
                                type="submit"
                                disabled={deliveryAddressData?.length === 0}
                                className="disabled:opacity-50 bg-primary text-white disabled:cursor-not-allowed disabled:pointer-events-auto font-bold py-[10px] px-[22px] uppercase rounded-full hover:bg-slate-850"
                                onClick={handleNextButtonClick}
                              >
                                Next
                              </button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {/* Payment accordion */}
                        <AccordionItem
                          value={(personalInfoSubmitted || token) ? "item-2" : "item-3"}
                          className="p-4 border-solid border-[1px] border-gray-1200 mt-6"
                        >
                          <AccordionTrigger onClick={() => setAccordionItem("item-2")}
                            className={`${paymentCollapseOpen ? '' : 'pointer-events-none'} no-underline hover:no-underline`}>
                            <div className="flex items-center justify-between flex-grow text-xl font-medium border-none collapse-title">
                              <div className="text-left col-10">
                                <h5 className="text-[16px] font-semibold">
                                  {" "}
                                  2. Payment Method{" "}
                                </h5>
                              </div>
                              <div className="text-right col-2">
                                <span className="text-white text">
                                  <TiTick
                                    size={20}
                                    className="rounded-full bg-gray-650"
                                  />
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <CheckoutPayment selectedPayment={selectedPayment} handlePaymentChange={setSelectedPayment} />
                          </AccordionContent>
                        </AccordionItem>
                      </AccordionNormal>

                    </TabsContent>
                    <TabsContent value="pickup">
                      <AccordionNormal defaultValue={pickupAccordion} value={pickupAccordion} type="single">

                        {/* Outlet select */}
                        <AccordionItem value={'item-1'}
                          className="p-4 border-solid border-[1px] border-gray-1200 mt-6">
                          <AccordionTrigger onClick={() => setPickupAccordion("item-1")} className={` w-full no-underline hover:no-underline`}>
                            <div className="flex items-center justify-between flex-grow text-xl font-medium border-none collapse-title">
                              <div className="text-left col-10">
                                <h5 className="text-[16px] font-semibold">
                                  1. Address
                                </h5>
                              </div>
                              <div className="text-right col-2">
                                <span className="text-white text">
                                  <TiTick
                                    size={20}
                                    className={`rounded-full ${outletChecked ? 'bg-primary' : 'bg-gray-650'}`}
                                  />
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <PickupAddress
                              outletId={outletId}
                              setOutletId={setOutletId}
                              handleOutletNext={handleOutletNext}
                            />
                          </AccordionContent>
                        </AccordionItem>

                        {/* Pickup Accordion */}
                        <AccordionItem value={'item-2'}
                          className="p-4 border-solid border-[1px] border-gray-1200 mt-6">
                          <AccordionTrigger
                            disabled={!outletChecked}
                            onClick={() => setPickupAccordion("item-2")}
                            className={` w-full no-underline hover:no-underline`}>
                            <div className="flex items-center justify-between flex-grow text-xl font-medium border-none collapse-title">
                              <div className="text-left col-10">
                                <h5 className="text-[16px] font-semibold">
                                  2. Pickup
                                </h5>
                              </div>
                              <div className="text-right col-2">
                                <span className="text-white text">
                                  <TiTick
                                    size={20}
                                    className={`rounded-full ${pickupFilled ? 'bg-primary' : 'bg-gray-650'}`}
                                  />
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>

                          {/* Content */}
                          <AccordionContent>
                            <PickupOption
                              pickupSelected={pickupSelected}
                              setPickupSelected={setPickupSelected}
                              pickupData={pickupData}
                              setPickupData={setPickupData}
                              handlePickupNext={handlePickupNext} />
                          </AccordionContent>
                        </AccordionItem>

                        {/* Payment accordion */}
                        <AccordionItem
                          value={"item-3"}
                          className="p-4 border-solid border-[1px] border-gray-1200 mt-6"
                        >
                          <AccordionTrigger
                            disabled={!outletChecked || !pickupFilled}
                            onClick={() => setPickupAccordion("item-3")}
                            className={`no-underline hover:no-underline`}>
                            <div className="flex items-center justify-between flex-grow text-xl font-medium border-none collapse-title">
                              <div className="text-left col-10">
                                <h5 className="text-[16px] font-semibold">
                                  {" "}
                                  3. Payment Method{" "}
                                </h5>
                              </div>
                              <div className="text-right col-2">
                                <span className="text-white text">
                                  <TiTick
                                    size={20}
                                    className="rounded-full bg-gray-650"
                                  />
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <CheckoutPayment selectedPayment={selectedPayment} handlePaymentChange={setSelectedPayment} />
                          </AccordionContent>
                        </AccordionItem>
                      </AccordionNormal>
                    </TabsContent>
                  </Tabs>
                )
              }
              <div className="mt-6">
                <h3 className="mb-4 text-3xl font-bold">Order Note</h3>
                <OrderNote
                  note={note}
                  setNote={setNote}
                />
              </div>
            </div>
            <div className="col-span-12 md:col-span-5">
              <CheckoutDetail deliveryAddress={deliveryAddress} isHomeDelivery={isHomeDelivery} selectedPayment={selectedPayment} />
              <div className="mt-[25px]">
                <button
                  disabled={placeBtnDisable || (isHomeDelivery && deliveryAddressData?.length === 0) || (!isHomeDelivery && !pickupFilled)}
                  className="flex items-center justify-center disabled:cursor-not-allowed gap-3 disabled:opacity-50 disabled:cursor-pointer-not-allowed disabled:pointer-events-none font-bold text-white py-[18px] px-[20px] uppercase rounded-full cursor-pointer bg-primary w-full hover:bg-darkBlack"
                  onClick={() => handlePlaceOrder()}>
                  Place Order
                  {
                    placeBtnDisable &&
                    <ButtonLoader className="!block" />
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Checkout;
Checkout.getLayout = (page: any) => {
  const configData = page?.props
  return <MainLayout configData={configData}>{page}</MainLayout>;
};

export async function getServerSideProps() {
  const baseUrl = config?.gateway?.apiURL
  const endPoint1 = config?.gateway?.apiEndPoint1
  const apiUrl = `${baseUrl}/${endPoint1}/configs`;
  const response: any = await axios.get(apiUrl, {
    headers: {
      Accept: "application/json",
      "Api-Key": config.gateway.apiKey,
    },
  })
  return {
    props: response?.data
  }
}


