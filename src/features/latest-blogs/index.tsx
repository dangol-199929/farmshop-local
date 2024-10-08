"use client";

import React, { useCallback, useRef, useState } from "react";
import SwiperNavigation from "@/shared/components/SwiperNavation";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import BlogCard from "../blog/blog-card";
import { useBlogs } from "@/hooks/blog.hook";

export default function BlogSlider() {
  const { blogsdata, isLoading, error } = useBlogs();
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

  const renderSkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#414042]">Latest Blogs</h2>
          <p className="text-green-600 font-light text-base mt-2">
            Get An Inside Look At Our Stories, Inspirations, And Ideas
          </p>
        </div>
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
            slidesPerView: 1,
            grid: {
              rows: 1,
            },
            spaceBetween: 20,
          },
          499: {
            slidesPerView: 2,
            grid: {
              rows: 1,
            },
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            grid: {
              rows: 1,
            },
            spaceBetween: 24,
          },
          1050: {
            slidesPerView: 4,
            grid: {
              rows: 1,
            },
            spaceBetween: 30,
          },
        }}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <SwiperSlide key={`skeleton-${index}`}>
                {renderSkeletonCard()}
              </SwiperSlide>
            ))
          : blogsdata?.data.map((post) => (
              <SwiperSlide key={post.id}>
                <BlogCard
                  key={post.id.toString()}
                  title={post.title}
                  excerpt={post.content}
                  slug={post.slug}
                  authorName={post.createdBy}
                  publishedDate={post.createdAt}
                  featuredImage={post.image}
                  size="sm"
                />
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}
