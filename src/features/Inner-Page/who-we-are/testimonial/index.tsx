import React, { useCallback, useState } from "react";
import { Autoplay, Grid, Navigation, Pagination } from "swiper";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import TestimonialCard from "./testimonial-card";
import { useQuery } from "@tanstack/react-query";
import { getHomeData } from "@/services/home.service";
import { IHome, ITestimonials } from "@/interface/home.interface";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import TestimonialModal from "./testimonial-modal";

const Testimonials = () => {
  const [swiperRef, setSwiperRef] = useState<SwiperClass>();
  const [nextDisable, setNextDisable] = useState<boolean>(false);
  const [prevDisable, setPrevDisable] = useState<boolean>(false);
  const [testimonialId, setTestimonialId] = useState<number>(0);
  // const [testimonialData, setTestimonialData] = useState<any>({})

  const { data: home } = useQuery<IHome>({
    queryKey: ["getHomeData"],
    queryFn: () => getHomeData(),
    enabled: true,
  });

  //handling prev and next of swiper category
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

  /**
   * Testimonial Data by id
   */
  const testimonialData: ITestimonials | any = home?.data?.testimonials?.find(
    (testimonial) => testimonial?.id === testimonialId
  );
  return (
    <div className="relative testimonial-swiper__content">
      {/* Button Remain */}
      {home?.data?.testimonials?.length! > 3 && (
        <div className="justify-between testimonial-navigation">
          <button
            title="Previous"
            className="bg-white"
            // disabled={prevDisable}
            onClick={handlePrevious}
          >
            <FaChevronLeft />
          </button>
          <button
            title="Next"
            className="bg-white"
            // disabled={nextDisable}
            onClick={handleNext}
          >
            <FaChevronRight />
          </button>
        </div>
      )}
      <Swiper
        slidesPerView={3}
        spaceBetween={15}
        grid={{
          rows: 1,
          fill: "row",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{ clickable: true }}
        modules={[Grid, Autoplay, Pagination]}
        onSwiper={setSwiperRef}
        onBeforeInit={() => setPrevDisable(true)}
        onReachBeginning={() => setPrevDisable(true)}
        onReachEnd={() => setNextDisable(true)}
        className="testimonial-swiper__content--swiper"
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            grid: {
              rows: 1,
              fill: "row",
            },
          },
          600: {
            slidesPerView: 2,
            loop: true,
            grid: {
              rows: 1,
              fill: "row",
            },

            spaceBetween: 20,
          },
          1050: {
            slidesPerView: 3,
            loop: true,
            grid: {
              rows: 1,
              fill: "row",
            },
            spaceBetween: 15,
          },
        }}
      >
        {home?.data?.testimonials.map((testimonial, index: number) => (
          <SwiperSlide key={`testimonial-${index}`} className="!h-[400px]">
            <TestimonialCard
              testimonial={testimonial}
              setTestmonialId={setTestimonialId}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {testimonialId !== 0 && (
        <TestimonialModal
          setTestimonialId={setTestimonialId}
          testimonialData={testimonialData}
          // setTestimonialData={setTestimonialData}
        />
      )}
    </div>
  );
};

export default Testimonials;
