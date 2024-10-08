import React from "react";
import Image from "next/image";
import { FallBackImg, QR } from "@/shared/lib/image-config";
import CustomImage from "@/features/custom-image";

const QRCodeSection = ({ configData }: any) => {
  return (
    <div className="w-full xs:w-[45%] md:w-[15%] mb-3">
      <span className="text-base font-bold footer-title">
        {configData?.data?.pageData?.["section4 title"]}
      </span>
      <div>
        <CustomImage
          src={configData?.data?.pageData?.qr_code}
          alt="QR"
          width={150}
          height={190}
          quality={100}
          style={{ width: "auto", height: "auto" }}
          className="max-w-[150px]"
          fallback={FallBackImg}
        />
      </div>
    </div>
  );
};

export default QRCodeSection;
