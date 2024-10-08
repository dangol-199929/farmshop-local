import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Headphones, RefreshCw, ShieldCheck, Truck } from "lucide-react";
import { services } from "@/shared/lib/image-config";
import CustomImage from "@/features/custom-image";

const howWeWorkData = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over Rs. 1500 within 7 kms of Ring Road",
    image: services.delivery,
  },
  {
    icon: RefreshCw,
    title: "Free Returns",
    description: "Free returns within 24 hours of delivery",
    image: services.truck,
  },
  {
    icon: ShieldCheck,
    title: "100% Payment Secure",
    description: "Your payments are safe and secure with us.",
    image: services.wallet,
  },
  {
    icon: Headphones,
    title: "Support 10 Am - 4 Pm",
    description: "Contact us from 10 am to 4 pm, every Sunday to Friday",
    image: services.support,
  },
];

function HowWeWork() {
  return (
    <div className="container mt-10">
      <Card className="w-full mx-auto rounded-2xl border-none bg-[#F9F9FA]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">How do we work</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {howWeWorkData.map((item, index) => (
            <div
              key={index}
              className="flex justify-center items-center gap-3 me-auto"
            >
              <CustomImage
                width={56}
                height={56}
                quality={100}
                src={item.image}
                alt={item.title}
              />
              <div>
                <h3 className="font-bold text-xs sm:text-sm md:text-base text-[#414042] whitespace-nowrap mb-3">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm font-light text-[#666666]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default HowWeWork;

{
  /* <div className="flex items-start space-x-4">
<div className="bg-blue-100 p-2 rounded-full">
  <Truck className="w-6 h-6 text-blue-600" />
</div>
<div>
  <h3 className="font-bold text-base text-[#414042]">
    Free Shipping
  </h3>
  <p className="text-sm font-normal text-[#666666]">
    On orders over Rs. 1500 within 7 kms of Ring Road
  </p>
</div>
</div> */
}
