import axios from "axios";
import MainLayout from "@/shared/main-layout";
import Head from "next/head";
import React from "react";
import { config } from "@/config";
import { NextPageWithLayout } from "../../_app";
import { useRouter } from "next/router";

const JobVacancyDetail: NextPageWithLayout = () => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <Head>
        <title>Job Vacancy Detail</title>
      </Head>
      <div>
        <h1>Job Vacancy Detail Page for {slug}</h1>
      </div>
    </>
  );
};

JobVacancyDetail.getLayout = (page) => {
  const configData = page?.props;
  return <MainLayout configData={configData}>{page}</MainLayout>;
};

export async function getServerSideProps(context: any) {
  const { slug } = context.params;
  const baseUrl = config?.gateway?.apiURL;
  const endPoint1 = config?.gateway?.apiEndPoint1;
  const apiUrl = `${baseUrl}/${endPoint1}/configs/${slug}`;
  const response: any = await axios
    .get(apiUrl, {
      headers: {
        Accept: "application/json",
        "Api-Key": config.gateway.apiKey,
      },
    })
    .catch((error) => {
      console.error("API call failed", error);
      return { props: {} };
    });

  return {
    props: response?.data,
  };
}

export default JobVacancyDetail;
