import { AccordionNormal, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion-normal'
import React from 'react'
import { TiTick } from 'react-icons/ti'

// import Address from '@/features/Address'

// import CheckoutPayment from '../checkout-payment'
import PersonalInformation from '../deliver/personal-information'
// import GuestUserAddress from '../deliver/checkout-address/guest-user-address'
import OrderNote from '../deliver/order-note'
import { getToken } from '@/shared/utils/cookies-utils/cookies.utils'


interface IGuestContentProps {
    accordionItem: string,
    setAccordionItem: any,
    personalInfoSubmitted: boolean,
    addressCollapseDisabled: boolean,
    setAddressCollapseDisabled: (arg: boolean) => void,
    setPersonalInfoSubmitted: (arg: boolean) => void
    checkoutGuestUserData: any
    setGuestUserData: ([]: any) => void
    setPersonalOpen: (arg: boolean) => void
    setAddressOpen: (arg: boolean) => void,
    paymentCollapseOpen: boolean,
    addressFilled: boolean,
}

const GuestContent = ({
    accordionItem,
    setAccordionItem,
    personalInfoSubmitted,
    addressCollapseDisabled,
    setPersonalInfoSubmitted,
    setGuestUserData,
    checkoutGuestUserData,
    setPersonalOpen,
    setAddressCollapseDisabled,
    setAddressOpen,
    addressFilled,
    paymentCollapseOpen }: IGuestContentProps) => {
    const token = getToken()

    return (
        <>
            {/* Accordion Start */}
            <AccordionNormal defaultValue={accordionItem} value={accordionItem} type="single" collapsible className="w-full">
                {/* Personal Information Accordion */}
                {
                    !token &&
                    <AccordionItem value="item-1" className="p-4 border-solid border-[1px] border-gray-1200 mb-[16px]">
                        <AccordionTrigger className="w-full no-underline hover:no-underline">
                            <div className="flex items-center justify-between flex-grow text-xl font-medium border-none">
                                <div className="text-left col-10">
                                    <h5 className="text-[16px] font-semibold">
                                        1. Personal Information
                                    </h5>
                                </div>
                                <div className="text-right col-2">
                                    <span className="text-white text">
                                        <TiTick
                                            size={20}
                                            className={`rounded-full ${personalInfoSubmitted ? 'bg-primary' : 'bg-gray-650'}`}
                                        />
                                    </span>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <PersonalInformation
                                addressCollapseDisabled={addressCollapseDisabled}
                                setAddressCollapseDisabled={setAddressCollapseDisabled}
                                personalInfoSubmitted={personalInfoSubmitted}
                                setPersonalInfoSubmitted={setPersonalInfoSubmitted}
                                guestUserData={checkoutGuestUserData}
                                setGuestUserData={setGuestUserData}
                                setPersonalOpen={setPersonalOpen}
                                setAddressOpen={setAddressOpen}
                            />
                        </AccordionContent>
                    </AccordionItem>
                }

                {/* Address Accordion */}
                <AccordionItem
                    value={(personalInfoSubmitted || token) ? "item-1" : "item-2"}
                    className="p-4 border-solid border-[1px] border-gray-1200 mb-[16px]">
                    <AccordionTrigger onClick={() => setAccordionItem("item-1")} className={`${(!token && addressCollapseDisabled) ? 'pointer-events-none' : ''} w-full no-underline hover:no-underline`}>
                        <div className="flex items-center justify-between flex-grow text-xl font-medium border-none collapse-title">
                            <div className="text-left col-10">
                                {token ? (
                                    <h5 className="text-[16px] font-semibold">
                                        {" "}
                                        1. Address{" "}
                                    </h5>
                                ) : (
                                    <h5 className="text-[16px] font-semibold">
                                        {" "}
                                        2. Address{" "}
                                    </h5>
                                )}
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
                    {/* <AccordionContent>
                        {token ? (
                            <>
                                <div className="grid grid-cols-12 gap-5 p-4">
                                    <Address
                                        formData={formData}
                                        setFormData={setFormData}
                                        setShowModal={setShowModal}
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
                            </>
                        ) : (
                            // Guest User Address Section
                            <div>
                                <form className="py-4" onSubmit={handleAddressSubmitGuest}>
                                    <GuestUserAddress guestformData={guestformData} setGuestFormData={setGuestFormData} />
                                </form>
                                <div className="text-right">
                                    <button
                                        type="submit"
                                        disabled={deliveryAddressData?.length === 0}
                                        className=" disabled:opacity-50 bg-primary text-white font-bold py-[10px] px-[22px] uppercase rounded-full hover:bg-slate-850 disabled:cursor-not-allowed disabled:pointer-events-auto"
                                        onClick={handleNextButtonClick}
                                    >
                                        Next
                                        {
                                            addressFormValidated &&
                                            <ButtonLoader />
                                        }
                                    </button>
                                </div>
                            </div>
                        )}
                    </AccordionContent> */}
                </AccordionItem>

                {/* Payment accordion */}
                <AccordionItem
                    value={(personalInfoSubmitted || token) ? "item-2" : "item-3"}
                    className="p-4 border-solid border-[1px] border-gray-1200 mb-[16px]"
                >
                    <AccordionTrigger onClick={() => setAccordionItem("item-2")}
                        className={`${paymentCollapseOpen ? '' : 'pointer-events-none'} no-underline hover:no-underline`}>
                        <div className="flex items-center justify-between flex-grow text-xl font-medium border-none collapse-title">
                            <div className="text-left col-10">
                                {token ? (
                                    <h5 className="text-[16px] font-semibold">
                                        {" "}
                                        2. Payment Method{" "}
                                    </h5>
                                ) : (
                                    <h5 className="text-[16px] font-semibold">
                                        {" "}
                                        3. Payment Method{" "}
                                    </h5>
                                )}
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
                    {/* <AccordionContent>
                        <CheckoutPayment selectedPayment={selectedPayment} handlePaymentChange={setSelectedPayment} />
                    </AccordionContent> */}
                </AccordionItem>
            </AccordionNormal>


        </>
    )
}

export default GuestContent