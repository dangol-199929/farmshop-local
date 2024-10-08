import CustomImage from "@/features/custom-image";
import { ITestimonials } from "@/interface/home.interface";
import Image from "next/image";
import React from "react";
import { FaTimes } from "react-icons/fa";
import StarRatings from "react-star-ratings";

interface ITestimonialModalProps {
  setTestimonialId: (arg: number) => void;
  testimonialData: ITestimonials;
  // setTestimonialData: ({ }) => void
}

const TestimonialModal = ({
  setTestimonialId,
  testimonialData,
}: ITestimonialModalProps) => {
  return (
    <>
      <input
        title="close"
        type="checkbox"
        id="productDetailModal"
        className="modal-toggle"
        defaultChecked
      />
      <div className="modal z-[9999]">
        <div className="w-6/12 max-w-5xl rounded-lg lg:w-11/12 modal-box">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">
              Listen from {testimonialData?.name}
            </h3>
            <button title="close" onClick={() => setTestimonialId(0)}>
              <FaTimes />
            </button>
          </div>
          <div className="py-[60px] px-[40px]">
            <div className="flex items-start gap-3">
              <CustomImage
                className="max-w-[69px] h-auto rounded-full"
                src={testimonialData?.icon}
                width={100}
                height={100}
                quality={100}
                alt={`Tesstimonial - ${testimonialData?.iconAltText}`}
              />
              <div>
                <p className="font-bold text-normal text-primary">
                  {testimonialData?.name}
                </p>
                <p className="text-sm">{testimonialData?.designation}</p>
              </div>
            </div>
            <p className="my-6 text-sm text-zinc-250 leading-[24px]">
              {testimonialData?.content}
            </p>
            <StarRatings
              name="Testimonial Rating"
              rating={testimonialData?.rating}
              starDimension="25px"
              starSpacing="2px"
              starEmptyColor="#d1d1d1"
              starRatedColor="#fdc71f"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialModal;
