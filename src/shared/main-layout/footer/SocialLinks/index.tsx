import React from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

const SocialLinks = ({ configData }: any) => {
  const socialLinks = [
    {
      href: "section5 facebook",
      icon: <FaFacebookF className="text-xl text-white" />,
      aria: "fb-link",
    },
    {
      href: "section5 instagram",
      icon: <FaInstagram className="text-xl text-white" />,
      aria: "insta-link",
    },
  ];

  return (
    <div className="mt-4">
      <span className="text-base font-bold footer-title">Social Media</span>
      <div className="flex gap-3.5 mt-4">
        {configData?.data?.pageData &&
          socialLinks.map((link, index) => (
            <Link
              key={index}
              href={`${configData?.data?.pageData?.[link.href]}`}
              aria-label={link.aria}
              target="_blank"
              className="w-auto p-0"
            >
              {link.icon}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default SocialLinks;
