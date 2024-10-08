import axios from "axios";
import MainLayout from "@/shared/main-layout";
import Head from "next/head";
import React from "react";
import { config } from "@/config";
import { NextPageWithLayout } from "../_app";
import { JobVacancyList } from "@/shared/components/job-vacancy-list";

const JobVacancy: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Job Vacancy</title>
      </Head>
      <div>
        <JobVacancyList />
      </div>
    </>
  );
};

JobVacancy.getLayout = (page) => {
  const configData = page?.props;
  return <MainLayout configData={configData}>{page}</MainLayout>;
};

export async function getServerSideProps() {
  const baseUrl = config?.gateway?.apiURL;
  const endPoint1 = config?.gateway?.apiEndPoint1;
  const apiUrl = `${baseUrl}/${endPoint1}/configs`;
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

export default JobVacancy;
