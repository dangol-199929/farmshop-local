import CustomImage from "@/features/custom-image";
import { ITestimonials } from "@/interface/home.interface";
import Image from "next/image";
import React from "react";
import StarRatings from "react-star-ratings";

export interface IProps {
  testimonial: ITestimonials;
  setTestmonialId: (arg: number) => void;
}

const TestimonialCard = ({ testimonial, setTestmonialId }: IProps) => {
  return (
    <div
      className="testimonial-card"
      onClick={() => setTestmonialId(testimonial?.id)}
    >
      <div className="testimonial-card__body">
        <CustomImage
          src={
            testimonial?.webpIcon ? testimonial?.webpIcon : testimonial?.icon
          }
          width={96}
          height={96}
          quality={100}
          className="max-w-[76px] h-auto rounded-full m-auto"
          alt="User Icon"
        />

        <div className="my-2 leading-tight text-center">
          <StarRatings
            name="Testimonial Rating"
            rating={testimonial?.rating}
            starDimension="20px"
            starSpacing="2px"
            starEmptyColor="#d1d1d1"
            starRatedColor="#fdc71f"
          />
        </div>

        <p className="testimonial-card__text">{testimonial?.content}</p>
        <div className="testimonial-card__nameContent">
          <p className="testimonial-card__nameContent--name">
            {testimonial?.name}
          </p>
          <p className="testimonial-card__nameContent--designation">
            {testimonial?.designation}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
