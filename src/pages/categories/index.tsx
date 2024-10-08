import React from "react";
import MainLayout from "@/shared/main-layout";
import Categories from "@/features/Home/categories";

import { useQuery } from "@tanstack/react-query";
import { NextPageWithLayout } from "../_app";
import CategoryCard from "@/shared/components/category-card";
import CategorySkeletonLoading from "@/shared/components/skeleton/category";
import Title from "@/shared/components/title";
import { config } from "../../../config";
import axios from "axios";

const CategoriesPage: NextPageWithLayout = () => {

    const { data: categories, isInitialLoading }: any = useQuery({ queryKey: ['getCategoriesList'] });


    return (
        <div className="text-lg font-bold ">
            <div className="container mt-6">
                <section className="my-[60px] relative">
                    <Title
                        type="title-section"
                        text="Shop By Categories"
                        subTitle="We’ve got something for everyone"
                    />
                    {
                        isInitialLoading ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {[1, 2, 3, 4, 5, 6]?.map((index: number) => (
                                    <CategorySkeletonLoading
                                        key={`categories-${index}`}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {
                                    categories?.data?.map((item: any, index: number) => (
                                        <CategoryCard
                                            key={`categories-${index}`}
                                            title={item?.name}
                                            totalProducts={item?.productCount}
                                            shopLink={`/categories/${item?.slug}`}
                                            image={item?.webpBackgroundImage ? item?.webpBackgroundImage : item?.backgroundImage}
                                        />
                                    ))
                                }

                            </div>
                        )
                    }
                </section>
            </div>
        </div>
    );
};
export default CategoriesPage;
CategoriesPage.getLayout = (page) => {
    const configData = page?.props
    return <MainLayout configData={configData}>{page}</MainLayout>;
};

export async function getServerSideProps() {
    const baseUrl = config?.gateway?.apiURL
    const endPoint1 = config?.gateway?.apiEndPoint1
  const apiUrl = `${baseUrl}/${endPoint1}/configs`;
    const response: any = await axios.get(apiUrl, {
        headers: {
            Accept: "application/json",
            "Api-Key": config.gateway.apiKey,
        },
    })
    return {
        props: response?.data
    }
}
