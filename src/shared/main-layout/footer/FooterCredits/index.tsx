import React from "react";
import Link from "next/link";

function FooterCredits({ currentYear, configData }: any) {
  return (
    <div className="relative py-5 text-sm text-white border-t-[1px] !border-[#f9f9f9]/20">
      <div className="flex flex-wrap justify-center gap-2 mx-auto text-white">
        <p className="text-center uppercase font-light">
          © {currentYear}{" "}
          <Link href="/" className="hover:underline font-semibold">
            {configData?.data?.title}
          </Link>
          . All Rights Reserved
        </p>
        <p className="uppercase font-light">
          Powered By{" "}
          {/* <Link
            href="https://koklass.com/"
            target="_blank"
            className="hover:underline"
          >
            Koklass
          </Link>{" "}
          from{" "} */}
          <Link
            href="https://ekbana.com/"
            target="_blank"
            className="hover:underline font-semibold"
          >
            EKbana
          </Link>
        </p>
      </div>
    </div>
  );
}

export default FooterCredits;
