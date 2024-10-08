import { useRouter } from "next/router";
import { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import CustomImage from "@/features/custom-image";
import { useHomeData } from "@/hooks/web-home.hook";
import BannerSkeletonLoader from "../skeleton/banner";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const LINK_TYPES = {
  Website: (value: string) => window.open(value, "_blank"),
  Category: (value: string, router: any) =>
    router.push(`/menu?active=${value}`),
  Product: (value: string, router: any) => router.push(`/products/${value}`),
};

function Banner() {
  const router = useRouter();
  const { home: homeData, isInitialLoading } = useHomeData();

  const handleOpenNewTab = (value: string, type: string) => {
    const action = LINK_TYPES[type as keyof typeof LINK_TYPES];
    action ? action(value, router) : null;
  };
  const {
    home,
    homeLoading,
    categories,
    loadingCategories,
    bannerPopupData,
    bannerPopupLoading,
  } = useHomeData();

  const adBanners = home?.data?.adBanners || [];

  const banners = homeData?.data?.banners;
  return (
    <div className="container">
      <div className={`grid grid-cols-12 mt-9 gap-4 md:gap-[30px]`}>
        <div
          className={`col-span-12 md:col-span-8 rounded-2xl overflow-hidden `}
        >
          {isInitialLoading && banners ? (
            <BannerSkeletonLoader />
          ) : (
            <Swiper
              loop
              className="mySwiper"
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              centeredSlides
              modules={[Autoplay, Pagination]}
              pagination={{
                dynamicBullets: true,
              }}
            >
              {banners?.map((banner: any, index: number) => (
                <SwiperSlide
                  key={`banner-images-${index}`}
                  className="cursor-pointer"
                  onClick={() =>
                    handleOpenNewTab(`${banner.id}`, banner?.linkTo)
                  }
                >
                  <CustomImage
                    className="m-auto object-contain h-full w-full rounded-2xl"
                    src={banner?.image}
                    width={937}
                    height={500}
                    alt={`Banner ${index + 1}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        <div className="col-span-12 gap-4 md:col-span-4 grid grid-cols-2">
          {adBanners.length > 0 &&
            adBanners?.slice(0, 2).map((bannerImg: any, index: number) => (
              <div
                className="bg-primary overflow-hidden rounded-2xl hover:scale-[1.03] transition-all duration-300 col-span-1 md:col-span-2"
                key={bannerImg?.id}
              >
                <CustomImage
                  className="m-auto mb-8 object-cover h-full w-full"
                  src={bannerImg?.image}
                  width={450}
                  height={242}
                  alt={`Banner ${index + 1}`}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Banner;
