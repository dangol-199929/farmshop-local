import CustomImage from "@/features/custom-image";
import Button from "../button";

import { Card } from "../ui/card";
import Link from "next/link";
import { AppBanner, FallBackImg } from "@/shared/lib/image-config";

export default function DownloadApp() {
  return (
    <div className="container">
      <div className="grid grid-cols-12 gap-[30px] py-10">
        <Card className="justify-center items-center bg-[#F3F9FB] py-[20px] px-[75px] rounded-3xl border-0 col-span-12 md:col-span-5 aspect-square hidden md:flex">
          <CustomImage
            src={AppBanner.phones}
            alt="Farm Shop App mockups"
            className="w-[430px] h-[430px] object-contain aspect-square"
            width={390}
            height={390}
          />
        </Card>
        <div className="col-span-12 md:col-span-7 flex flex-col justify-center items-start">
          <h2 className="text-3xl font-bold mb-4">
            Download Our <span className="text-primary">Farm Shop App</span> on
            the Play Store and App Store!
          </h2>
          <p className="text-gray-500 mb-6 text-base font-light">
            Get the freshest farm produce delivered to your door. Browse and
            order organic vegetables, dairy, and artisanal products with ease.
            Enjoy secure payments and real-time order tracking. Experience
            farm-fresh goodness today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              className="hover:scale-105 transition-all duration-300"
              href={"https://apps.apple.com/us/app/farm-shop/id6443336686"}
            >
              <CustomImage
                src={AppBanner.apple}
                alt="Google Play icon"
                className="mr-2 w-[188px] h-[56px] object-contain"
                width={188}
                height={56}
              />
            </Link>
            <Link
              className="hover:scale-105 transition-all duration-300"
              href={
                "https://play.google.com/store/apps/details?id=com.farmshop.app&pli=1"
              }
            >
              <CustomImage
                src={AppBanner.play}
                alt="App Store icon"
                className="mr-2 w-[188px] h-[56px] object-contain"
                width={188}
                height={56}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
