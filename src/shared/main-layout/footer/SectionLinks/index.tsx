import React from "react";
import Link from "next/link";

const SectionLinks = ({ configData }: any) => {
  return (
    <div className="w-full xs:w-[45%] md:w-[23%] mb-3">
      <span className="text-base font-bold footer-title">
        {configData?.data?.pageData?.["section2 title"]}
      </span>
      {configData?.data?.pageData &&
        Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-start gap-4 mb-3"
          >
            <Link
              href={`${
                configData?.data?.pageData?.[`section2 link${index + 1}`]
              }`}
              aria-label={`section2-link${index + 1}`}
              className="p-0 footer-link"
            >
              {configData?.data?.pageData?.[`section2 content${index + 1}`]}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default SectionLinks;
