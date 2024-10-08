import CustomImage from "@/features/custom-image";
import Link from "next/link";
import React from "react";

import { useConfig } from "@/store/config";
import { Logo } from "@/shared/lib/image-config";

const HeaderLogo = () => {
  const { configData } = useConfig();

  return (
    <Link href={"/"} aria-label="home_blank">
      <CustomImage
        className="!max-w-[55px] md:!max-w-[140px] md:max-w-[150px]"
        src={
          configData?.pageData?.headerlogo
            ? configData?.pageData?.headerlogo
            : Logo
        }
        height={80}
        width={144}
        quality={100}
        alt="Logo"
        style={{ width: "auto", height: "auto" }}
        priority
      />
    </Link>
  );
};

export default HeaderLogo;
