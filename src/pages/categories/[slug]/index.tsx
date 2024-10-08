import "react-range-slider-input/dist/style.css";

import axios from "axios";
import Head from "next/head";

import CategoryPage from "@/features/Category";
import useCategoryDetails from "@/hooks/categories.hook";
import { NextPageWithLayout } from "@/pages/_app";
import Breadcrumb from "@/shared/components/breadcrumb";
import MainLayout from "@/shared/main-layout";

import { config } from "../../../../config";

const CategoryDetail: NextPageWithLayout = () => {
  const { categoryName } = useCategoryDetails();
  return (
    <>
      <Head>
        <title>{categoryName || "Farmshop"}</title>
      </Head>
      <Breadcrumb title={categoryName} />
      <CategoryPage />
    </>
  );
};

export default CategoryDetail;

CategoryDetail.getLayout = (page) => {
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
