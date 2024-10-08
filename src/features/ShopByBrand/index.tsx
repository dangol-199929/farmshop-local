"use client";
import { useCallback, useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

import { getBrand } from "@/services/brand.service";
import SwiperNavigation from "@/shared/components/SwiperNavation";
import { useQuery } from "@tanstack/react-query";

import CustomImage from "../custom-image";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface IBrandData {
  id: number;
  name: string;
  description: string;
  excerpt: string | null;
  icon: string;
  iconAltText: string | null;
  slug: string;
  status: boolean;
}
interface IBrand {
  data: IBrandData[];
}

export default function BrandSlider() {
  const { data: brands, isLoading } = useQuery<IBrand>(["getBrand"], getBrand);

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
          <h2 className="text-2xl font-bold text-gray-800">Shop By Brands</h2>
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
            : brands?.data?.map((brand) => (
                <SwiperSlide key={brand.id}>
                  <div className="bg-[#FFFFFF] p-4 rounded-2xl shadow-sm flex justify-center items-center gap-4 ">
                    <CustomImage
                      src={brand.icon}
                      alt={brand.iconAltText || `${brand.name} logo`}
                      width={120}
                      height={120}
                      className="w-[120px] h-[120px] rounded-2xl object-contain bg-[#F9F9FA]"
                    />
                    <div className="block overflow-hidden">
                      <h3 className="text-base font-semibold mb-2 truncate overflow-hidden w-full">
                        {brand.name}
                      </h3>
                      <p className="text-gray-600 text-sm font-light line-clamp-4">
                        {brand.description ||
                          brand.excerpt ||
                          "No description available"}
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
