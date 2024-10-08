import axios from "axios";
import { getCookie } from "cookies-next";
import Head from "next/head";
import React, { useState } from "react";

import AppCategories from "@/features/Home/app-categories";
import BannerPopup from "@/features/Home/banner-popup";
import Categories from "@/features/Home/categories";
import { useHomeData } from "@/hooks/web-home.hook";
import AdBanner from "@/shared/components/ad-banner";
import Banner from "@/shared/components/banner";
import SkeletonLoadingCard from "@/shared/components/skeleton/products";
import MainLayout from "@/shared/main-layout";

import { config } from "../../config";
import { NextPageWithLayout } from "./_app";
import HowWeWork from "@/shared/components/how-we-work";
import BrandSlider from "@/features/ShopByBrand";
import BlogSlider from "@/features/latest-blogs";

const Home: NextPageWithLayout = () => {
  //Cookie
  const bannerPop = getCookie("bannerPopup");

  // Web-home Hooks
  const {
    home,
    homeLoading,
    categories,
    loadingCategories,
    bannerPopupData,
    bannerPopupLoading,
  } = useHomeData();

  //States
  const [showPopupModal, setShowPopupModal] = useState<boolean>(true);

  return (
    <>
      <Head>
        <title>Farm Shop</title>
      </Head>
      <div className="text-lg font-bold">
        <Banner />
        <HowWeWork />
        <Categories loading={loadingCategories} categories={categories?.data} />

        {homeLoading ? (
          <div className="container my-6">
            <div className="w-20 h-5 mx-4 mb-5 bg-gray-300 rounded animate-pulse"></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
              {[1, 2, 3, 4, 5].map((index) => (
                <SkeletonLoadingCard key={`app-skeleton-${index}`} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {home?.data?.appCategories?.map((prev: any, index: number) => (
              <React.Fragment key={`AppCategories-${prev?.id}`}>
                <AppCategories prev={prev} />
                {index * 2 + 2 < home?.data?.adBanners.length && (
                  <div className="container">
                    <div className="grid grid-cols-12 gap-4 my-6">
                      {home?.data?.adBanners
                        .slice(index * 2 + 2, (index + 1) * 2 + 2) // Display 2 adBanners after each AppCategories set
                        .map((adBanner: any) => (
                          <div
                            className="relative col-span-12 overflow-hidden group sm:col-span-6"
                            key={adBanner?.id}
                          >
                            <AdBanner adBanner={adBanner} />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </>
        )}
        {bannerPopupData?.data.length > 0 &&
          showPopupModal &&
          bannerPop !== (undefined || true) && (
            <BannerPopup
              setShowPopupModal={setShowPopupModal}
              showPopupModal={showPopupModal}
              popupData={bannerPopupData?.data[0]!}
              bannerPopupLoading={bannerPopupLoading}
            />
          )}
        <BrandSlider />
        <BlogSlider />
      </div>
    </>
  );
};
export default Home;
Home.getLayout = (page) => {
  const configData = page?.props;
  return <MainLayout configData={configData}>{page}</MainLayout>;
};

export async function getServerSideProps() {
  const baseUrl = config?.gateway?.apiURL;
  const endPoint1 = config?.gateway?.apiEndPoint1;
  const apiUrl = `${baseUrl}/${endPoint1}/configs`;
  const response: any = await axios.get(apiUrl, {
    headers: {
      Accept: "application/json",
      "Api-Key": config.gateway.apiKey,
    },
  });

  return {
    props: response?.data,
  };
}
