import React, { useCallback, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Grid } from "swiper";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

import CategoryCard from "@/shared/components/category-card";
import CategorySkeletonLoading from "@/shared/components/skeleton/category";
import Title from "@/shared/components/title";

interface IProps {
  loading: boolean;
  categories: any;
}
const Categories: React.FC<IProps> = ({ loading, categories }) => {
  const [swiperRef, setSwiperRef] = useState<SwiperClass>();
  const [nextDisable, setNextDisable] = useState<boolean>(false);
  const [prevDisable, setPrevDisable] = useState<boolean>(false);

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

  return (
    <section className="container mt-[30px] mb-[60px] relative">
      <Title
        type="title-section"
        text="Shop By Categories"
        subTitle="We’ve got something for everyone"
      />
      {categories?.length > 5 && (
        <div className="productSwiper-navigation">
          <button
            title="Previous"
            disabled={prevDisable}
            onClick={handlePrevious}
          >
            <FaChevronLeft />
          </button>
          <button title="Next" disabled={nextDisable} onClick={handleNext}>
            <FaChevronRight />
          </button>
        </div>
      )}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6]?.map((index: number) => (
            <CategorySkeletonLoading key={`categories-${index}`} />
          ))}
        </div>
      ) : (
        <Swiper
          slidesPerView={3}
          grid={{
            rows: 2,
            fill: "row",
          }}
          pagination={false}
          modules={[Grid]}
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
              slidesPerView: 2,
              grid: {
                rows: 1,
              },
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 5,
              grid: {
                rows: 1,
              },
              spaceBetween: 10,
            },
            1050: {
              slidesPerView: 6,
              grid: {
                rows: 1,
              },
              spaceBetween: 10,
            },
          }}
        >
          {categories?.map((item: any, index: number) => (
            <SwiperSlide
              className="hover:scale-105 transition-all duration-300 p-3"
              key={`categories-${index}`}
            >
              <CategoryCard
                key={`categories-${index}`}
                title={item?.name}
                totalProducts={item?.productCount}
                shopLink={`/categories/${item?.slug}`}
                image={
                  item?.webpBackgroundImage
                    ? item?.webpBackgroundImage
                    : item?.backgroundImage
                }
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
};

export default Categories;
