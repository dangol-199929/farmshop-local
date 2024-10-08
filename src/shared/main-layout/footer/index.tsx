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
import { Card } from "@/shared/components/ui/card";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { configData } = useConfigStores();

  return (
    <div className="relative pt-16">
      <CustomImage
        fill
        src={FooterBg}
        priority={true}
        className="z-0 object-cover"
        alt="footer-bg"
        fallback={FallBackImg}
      />
      <footer className="relative block p-4 !pb-0 sm:p-10 footer">
        <div className="container flex flex-wrap md:flex-none items-start justify-center md:justify-between gap-3 footer">
          <Card className="flex justify-center items-center gap-3 mb-3 py-[30px] px-[16px] max-w-[469px] rounded-2xl">
            <CustomImage
              src={configData?.data?.pageData?.logo}
              height={69}
              width={69}
              alt="footer-logo"
              // priority={true}
              fallback={FallBackImg}
              className="w-[69px] h-[69px] object-contain object-left border"
            />
            <div>
              <p className="text-primary font-bold text-xl mb-2">About Us</p>
              <p className="text-[12px] text-black mb-3">
                {configData?.data?.pageData?.["section1 description"]}
              </p>
              <SocialLinks configData={configData} />
            </div>
          </Card>
          {configData?.data?.pageData && (
            <ContactItems configData={configData} />
          )}
          <SectionLinks configData={configData} />
          {configData?.data?.pageData?.qr_code && (
            <QRCodeSection configData={configData} />
          )}
        </div>
        {/* <DownloadLinks configData={configData} /> */}
      </footer>
      <FooterCredits currentYear={currentYear} configData={configData} />
    </div>
  );
};

export default Footer;
