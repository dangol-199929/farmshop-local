import React from "react";
import Link from "next/link";

function FooterCredits({ currentYear, configData }: any) {
  return (
    <div className="relative py-5 text-sm text-white bg-[rgb(0,0,0,0.2)]">
      <div className="flex flex-wrap justify-center gap-2 mx-auto text-white">
        <p className="text-center">
          © {currentYear}{" "}
          <Link href="/" className="hover:text-orange-450">
            {configData?.data?.title}
          </Link>
          . All Rights Reserved
        </p>
        <div className="before:bg-white before:w-[1px] after:w-[1px] after:bg-white m-0 hidden xs:flex"></div>
        <p>
          Powered By{" "}
          <Link
            href="https://koklass.com/"
            target="_blank"
            className="hover:text-orange-450"
          >
            Koklass
          </Link>{" "}
          from{" "}
          <Link
            href="https://ekbana.com/"
            target="_blank"
            className="hover:text-orange-450"
          >
            EKbana
          </Link>
        </p>
      </div>
    </div>
  );
}

export default FooterCredits;
