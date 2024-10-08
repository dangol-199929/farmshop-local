import Link from "next/link";
import React from "react";
import Image from "next/image";
import { emptyPages, FallBackImg } from "@/shared/lib/image-config";
import CustomImage from "@/features/custom-image";

export interface IEmptyPage {
  type?: string | string[];
}

const EmptyPage = ({ type }: IEmptyPage) => {
  return (
    <div className="pt-0">
      <div className="container">
        <div>
          <CustomImage
            className="flex mx-auto img-fluid"
            src={emptyPages?.search}
            width={330}
            height={330}
            alt={`Image`}
            fallback={FallBackImg}
          />
          <div className="text-center">
            <h2 className="text-lg font-medium capitalize">
              No {type || "Products"} Found
            </h2>
            <p>
              {" "}
              Thank you for using Farmshop. We will be in contact with more
              details shortly.
            </p>
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/"
              className="bg-primary font-bold py-[10px] px-[22px] text-white rounded-full transition-all delay-100 duration-150 hover:bg-slate-850"
              aria-label="continue-shopping"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyPage;
