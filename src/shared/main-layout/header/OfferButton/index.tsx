import { Button } from "@/shared/components/ui/button";
import OfferIcon from "@/shared/icons/common/OfferIcon";
import Link from "next/link";
import React from "react";

const OfferButton = () => {
  return (
    <div className="hidden md:block">
      <Link href="/offer" aria-label="header-offer">
        <Button
          variant="ghost"
          size="lg"
          className="flex justify-center items-center gap-2 rounded-2xl  text-gray-550 text-base px-3"
        >
          <OfferIcon className="w-6 h-6" />
          Offer
        </Button>
      </Link>
    </div>
  );
};

export default OfferButton;
