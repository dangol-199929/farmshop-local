import { IPaymentMethod } from "@/interface/home.interface";
import { useConfig as useConfigStores } from "@/store/config";
import Image from "next/image";
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Label } from "@/shared/components/ui/label";
import CustomImage from "@/features/custom-image";
import { FallBackImg } from "@/shared/lib/image-config";
interface CheckoutPaymentProps {
  selectedPayment: IPaymentMethod | null;
  handlePaymentChange: (payment: IPaymentMethod) => void;
}
const CheckoutPayment: React.FC<CheckoutPaymentProps> = ({
  selectedPayment,
  handlePaymentChange,
}) => {
  //Get Config Data
  const { configData } = useConfigStores();
  const defaultPaymentMethod = configData?.data?.paymentMethods[0]?.title;

  return (
    <>
      <RadioGroup defaultValue={defaultPaymentMethod}>
        {configData?.data?.paymentMethods?.map((payment: IPaymentMethod) => (
          <div className="flex items-center space-x-2" key={payment.id}>
            <RadioGroupItem
              onClick={() => handlePaymentChange(payment)}
              checked={selectedPayment?.id === payment.id}
              value={payment?.title}
              id={payment?.title}
            />
            <Label
              htmlFor={payment?.title}
              className="flex items-center cursor-pointer"
            >
              <CustomImage
                alt="Checkout Img"
                width={50}
                height={50}
                quality={100}
                src={payment?.webpIcon ? payment?.webpIcon : payment?.icon}
                className="w-[30px] mx-3"
                fallback={FallBackImg}
              />
              <span className="capitalize">{payment.title}</span>
            </Label>
          </div>
          // <div className="form-control" key={payment.id}>
          //     <label className="justify-start cursor-pointer label">
          //         <Input
          //             type="radio"
          //             name="radio-10"
          //             className="radio checked:bg-primary w-[18px] h-[18px]"
          //         />
          //         <div className="flex">
          //             <CustomImage
          //                 alt="Checkout Img"
          //                 width={50}
          //                 height={50}
          //                 quality={100}
          //                 src={payment?.webpIcon ? payment?.webpIcon : payment?.icon}
          //                 className="w-[30px] mx-3"
          //             />
          //             <span className="capitalize">{payment.title}</span>
          //         </div>
          //     </label>
          // </div>
        ))}
      </RadioGroup>
    </>
  );
};

export default CheckoutPayment;
