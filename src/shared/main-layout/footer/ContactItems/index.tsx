import React from "react";
import Link from "next/link";
import PhoneIcon from "@/shared/icons/common/PhoneIcon";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactItems = ({ configData }: any) => {
  const contactItems = [
    { type: "mobile2", icon: <Phone size={18} className=" mt-1" /> },
    { type: "email", icon: <Mail size={18} className=" mt-1" /> },
    { type: "address", icon: <MapPin size={18} className=" mt-1" /> },
  ];

  return (
    <div className="w-full xs:w-[45%] md:w-[30%] mb-3">
      <span className="text-base font-bold footer-title">
        {configData?.data?.pageData?.["section1 title"]}
      </span>
      {contactItems.map((item, index) => (
        <div key={index} className="flex items-start justify-start gap-4 mb-3 ">
          <div className="text-white">{item.icon}</div>
          <div>
            {item.type === "mobile2" && (
              <Link
                className="p-0 footer-link"
                href={`tel:${
                  configData?.data?.pageData?.[`section1 ${item.type}`]
                }`}
              >
                {configData?.data?.pageData?.[`section1 ${item.type}`]}
              </Link>
            )}
            {item.type === "email" && (
              <Link
                href={`mailTo:${
                  configData?.data?.pageData?.[`section1 ${item.type}`]
                }`}
              >
                <button className="p-0 footer-link">
                  {configData?.data?.pageData?.[`section1 ${item.type}`]}
                </button>
              </Link>
            )}
            {item.type === "address" && (
              <button className="p-0 footer-link text-start">
                {configData?.data?.pageData?.[`section1 ${item.type}`]}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactItems;
