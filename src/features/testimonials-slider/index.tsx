"use client";
import { useCallback, useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

import { getBrand } from "@/services/brand.service";
import SwiperNavigation from "@/shared/components/SwiperNavation";
import { useQuery } from "@tanstack/react-query";

import CustomImage from "../custom-image";
import { Skeleton } from "@/shared/components/ui/skeleton";
import Title from "@/shared/components/title";
import { getTestimonials } from "@/services/testimonials.service";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { FallBackImg } from "@/shared/lib/image-config";

interface ITestimonialData {
  id: number;
  name: string;
  content: string;
  createdAt: string;
  designation: string | null;
  image: string;
  iconAltText: string | null;
}
interface ITestimonials {
  data: ITestimonialData[];
}

export default function TestimonialsSlider() {
  const { data: testimonials, isLoading } = useQuery<ITestimonials>(
    ["getTestimonials"],
    getTestimonials
  );

  const [swiperRef, setSwiperRef] = useState<SwiperClass>();
  const [prevDisable, setPrevDisable] = useState(true);
  const [nextDisable, setNextDisable] = useState(true);
  const handlePrevious = useCallback(() => {
    setNextDisable(false);
    if (swiperRef) {
      swiperRef?.slidePrev();
    }
  }, [swiperRef]);

  const handleNext = useCallback(() => {
    setPrevDisable(false);
    if (swiperRef) {
      swiperRef?.slideNext();
    }
  }, [swiperRef]);

  const renderSkeletons = () => (
    <>
      {[1, 2, 3].map((index) => (
        <SwiperSlide key={`skeleton-${index}`}>
          <div className="bg-[#FFFFFF] p-4 rounded-2xl shadow-sm flex justify-center items-center gap-4">
            <Skeleton className="w-[120px] h-[120px] rounded-2xl" />
            <div className="block overflow-hidden flex-1">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </>
  );

  return (
    <div className=" mx-auto px-4 py-[49px] bg-[#F9F9FA]">
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <Title
            type="title-section"
            text={"Client Testimonials"}
            subTitle={"What our happy customers says !"}
          />
          <SwiperNavigation
            prevDisabled={prevDisable}
            nextDisabled={nextDisable}
            onPrevClick={() => {
              handlePrevious();
            }}
            onNextClick={() => {
              handleNext();
            }}
          />
        </div>
        <Swiper
          slidesPerView={3.5}
          grid={{
            rows: 1,
            fill: "row",
          }}
          pagination={false}
          spaceBetween={20}
          // modules={[Navigation]}
          className="productSwiper"
          onSwiper={setSwiperRef}
          onBeforeInit={() => setPrevDisable(true)}
          onReachBeginning={() => setPrevDisable(true)}
          onReachEnd={() => setNextDisable(true)}
          onSlideChange={() => {
            if (swiperRef) {
              const isAtBeginning = swiperRef.isBeginning;
              const isAtEnd = swiperRef.isEnd;

              setPrevDisable(isAtBeginning);
              setNextDisable(isAtEnd);
            }
          }}
          breakpoints={{
            0: {
              slidesPerView: 1.5,
              grid: {
                rows: 1,
              },
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 2.2,
              grid: {
                rows: 1,
              },
              spaceBetween: 16,
            },
            1050: {
              slidesPerView: 3.2,
              grid: {
                rows: 1,
              },
              spaceBetween: 16,
            },
          }}
        >
          {isLoading
            ? renderSkeletons()
            : testimonials?.data?.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="bg-[#FFFFFF] p-4 rounded-2xl shadow-sm">
                    <div className="flex justify-start items-center gap-2 mb-4">
                      <Avatar className="w-[56px] h-[56px] flex gap-2">
                        <AvatarImage src={testimonial.image} />
                        <AvatarFallback>{FallBackImg}</AvatarFallback>
                      </Avatar>
                      <div className="">
                        <p className="text-base font-semibold">
                          {testimonial.name}
                        </p>
                        <p className="text-sm font-light text-gray-500">
                          {testimonial.designation || "Customer"}
                        </p>
                      </div>
                    </div>
                    <div className="block overflow-hidden">
                      <p className="text-gray-500 text-sm font-light line-clamp-2 h-[40px]">
                        {testimonial.content || "No description available"}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
}
