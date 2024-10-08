import React, { useCallback, useState } from "react";
import { Grid } from "swiper";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

import { useWishlists } from "@/hooks/wishlist.hooks";
import { ICartData } from "@/interface/cart.interface";
import { IAppCategories } from "@/interface/home.interface";
import Card from "@/shared/components/card";
import SwiperNavigation from "@/shared/components/SwiperNavation";
import Title from "@/shared/components/title";
import { useQuery } from "@tanstack/react-query";

import HalfLeftCard from "./half-left-card";

interface IProps {
  prev: IAppCategories;
}

const AppCategories: React.FC<IProps> = ({ prev }) => {
  const [swiperRef, setSwiperRef] = useState<SwiperClass>();

  const [nextDisable, setNextDisable] = useState<boolean>(false);
  const [prevDisable, setPrevDisable] = useState<boolean>(false);

  const { favList } = useWishlists();

  const { data: cart } = useQuery<ICartData>(["getCartList"]);

  const updatedData = prev?.product?.map((item) => ({
    ...item,
    isFav:
      favList && favList.data.length > 0
        ? favList?.data.some((favItem: any) => favItem.product_id === item.id)
        : false,
    favId:
      favList && favList.data.length > 0
        ? favList?.data.find((favItem: any) => favItem.product_id === item.id)
            ?.id
        : 0,
  }));

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

  let content: any;
  if (prev?.product) {
    if (prev?.type === "half left") {
      content = <HalfLeftCard updatedData={prev} />;
    } else {
      content = (
        <div className="container">
          <section className="my-[60px]">
            <div className="relative flex items-center justify-between">
              <Title type="title-section" text={prev?.title} />
              {prev?.product?.length > 0 && (
                <SwiperNavigation
                  prevDisabled={prevDisable}
                  nextDisabled={nextDisable}
                  onPrevClick={handlePrevious}
                  onNextClick={handleNext}
                />
              )}
            </div>
            <>
              <Swiper
                slidesPerView={5}
                grid={{
                  rows:
                    prev?.type === "product horizontal" ||
                    prev?.type === "product vertical"
                      ? 1
                      : 2,
                  fill: "row",
                }}
                pagination={false}
                spaceBetween={20}
                modules={[Grid]}
                className="productSwiper"
                onSwiper={setSwiperRef}
                onBeforeInit={() => setPrevDisable(true)}
                onReachBeginning={() => setPrevDisable(true)}
                onReachEnd={() => setNextDisable(true)}
                onSlideChange={() => {
                  // Enable/disable buttons based on the current slide index
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
                      rows:
                        prev?.type === "product horizontal" ||
                        prev?.type === "product vertical"
                          ? 1
                          : 2,
                    },
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 3,
                    grid: {
                      rows:
                        prev?.type === "product horizontal" ||
                        prev?.type === "product vertical"
                          ? 1
                          : 2,
                    },
                    spaceBetween: 20,
                  },
                  1050: {
                    slidesPerView: 5,
                    grid: {
                      rows:
                        prev?.type === "product horizontal" ||
                        prev?.type === "product vertical"
                          ? 1
                          : 2,
                    },
                    spaceBetween: 20,
                  },
                }}
              >
                {updatedData?.map((product, index) => (
                  <SwiperSlide key={`app-categories-${product?.id}`}>
                    <Card
                      product={product}
                      key={product?.id}
                      cartItem={cart?.cartProducts?.find(
                        (item) => item?.product?.id === product?.id
                      )}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          </section>
        </div>
      );
    }
  }
  return <>{content}</>;
};

export default AppCategories;
