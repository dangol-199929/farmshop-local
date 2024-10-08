import { FallBackImg, FooterBg } from "@/shared/lib/image-config";
import { useState } from "react";
import { useConfig as useConfigStores } from "@/store/config";
import CustomImage from "@/features/custom-image";
import SocialLinks from "./SocialLinks";
import ContactItems from "./ContactItems";
import SectionLinks from "./SectionLinks";
import QRCodeSection from "./QRCodeSection";
import DownloadLinks from "./DownloadLinks";
import FooterCredits from "./FooterCredits";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { configData } = useConfigStores();

  return (
    <div className="relative">
      <CustomImage
        fill
        src={FooterBg}
        priority={true}
        className="z-0 object-cover"
        alt="footer-bg"
        fallback={FallBackImg}
      />
      <footer className="relative block p-4 !pb-0 sm:p-10 footer">
        <div className="container flex flex-wrap items-start justify-between gap-2 footer">
          <div className="w-full xs:w-[45%] md:w-[23%] mb-3">
            <CustomImage
              src={configData?.data?.pageData?.logo}
              height={160}
              width={160}
              alt="footer-logo"
              priority={true}
              fallback={FallBackImg}
            />
            <p className="text-[12px] text-white mt-5">
              {configData?.data?.pageData?.["section1 description"]}
            </p>
            <SocialLinks configData={configData} />
          </div>
          {configData?.data?.pageData && (
            <ContactItems configData={configData} />
          )}
          <SectionLinks configData={configData} />
          {configData?.data?.pageData?.qr_code && (
            <QRCodeSection configData={configData} />
          )}
        </div>
        <DownloadLinks configData={configData} />
      </footer>
      <FooterCredits currentYear={currentYear} configData={configData} />
    </div>
  );
};

export default Footer;
