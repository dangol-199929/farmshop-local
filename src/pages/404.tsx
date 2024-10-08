import CustomImage from "@/features/custom-image";
import { fourzerofour } from "@/shared/lib/image-config";
import MainLayout from "@/shared/main-layout";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div>
      <div className="container flex flex-col items-center py-8 text-center">
        <CustomImage
          src={fourzerofour}
          width={634}
          height={417}
          className="my-6"
          alt="error"
        />
        <h1 className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl text-primary md:mb-8">
          Something went wrong.
        </h1>
        <p className="text-sm">
          The page you were looking for could not be found.
        </p>
        <p className="mb-8 text-sm">
          It might have been removed, renamed or did not exist in the first
          place.
        </p>
        <Link
          href="/"
          aria-label="go-to-home"
          className="px-8 py-3 mb-8 text-white bg-primary hover:bg-orange-100 rounded-3xl"
        >
          {" "}
          GO TO HOMEPAGE{" "}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

NotFound.getLayout = (page: any) => {
  return <MainLayout configData={""}>{page}</MainLayout>;
};
