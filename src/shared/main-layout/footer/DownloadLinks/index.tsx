import React from "react";
import Link from "next/link";
import { AppBanner } from "@/shared/lib/image-config";
import CustomImage from "@/features/custom-image";

function DownloadLinks({ configData }: any) {
  return (
    <div className="flex justify-center items-center flex-wrap gap-3 w-full mb-3">
      <h3 className="text-sm font-bold text-white me-4">DOWNLOAD THE APP ON</h3>
      <div className="flex gap-3">
        {configData?.data?.pageData && (
          <>
            <Link
              aria-label="play-store"
              target="_blank"
              href={`${configData?.data?.pageData?.["section4 googleplay link"]}`}
              className="p-0 btn"
            >
              <CustomImage
                src={AppBanner.play}
                height={32}
                width={108}
                quality={100}
                alt="play-store"
                className="rounded-sm"
              />
            </Link>
            <Link
              target="_blank"
              aria-label="app-store"
              href={`${configData?.data?.pageData?.["section4 appstore link"]}`}
              className="p-0 btn"
            >
              <CustomImage
                src={AppBanner.play}
                className="rounded-sm"
                quality={100}
                height={32}
                width={108}
                alt="app-store"
              />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default DownloadLinks;
