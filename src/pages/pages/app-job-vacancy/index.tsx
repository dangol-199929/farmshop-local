import axios from "axios";
import { Calendar, Clock, MapPin } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";

import { useCareerData } from "@/hooks/career.hook";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import MainLayout from "@/shared/main-layout";
import { useConfig as useConfigStores } from "@/store/config";

import { config } from "../../../../config";
// import { NextPageWithLayout } from "../_app";

const CareerPage = () => {
  const router = useRouter();

  const { data: careerData, isLoading: careerDataLoading } = useCareerData();

  const { configData } = useConfigStores();

  const handleViewDetails = (slug: string) => {
    router.push(`/job-vacancy/${slug}`);
  };

  return (
    <div className="bg-white pb-14 -mb-14 ">
      <Head>
        <title>
          {configData?.data?.pageData?.["career title"] || "Careers"}
        </title>
      </Head>
      <div className="text-lg font-bold">
        <div className="container">
          {/* <h1 className="text-3xl mb-6">Career Opportunities</h1> */}
          {careerDataLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
            </div>
          ) : (
            <div>
              <div className="text-2xl font-bold mt-10 mb-3">
                Job Vacancy List
              </div>
              <p className="text-sm font-normal text-muted-foreground">
                A concise overview of current job openings, including titles,
                descriptions, and application details for job seekers.
              </p>
              <CardContent className="space-y-4 px-0 mt-10">
                {careerData?.map((job, index) => (
                  <Card
                    key={job.id}
                    className={index % 2 === 0 ? "bg-muted" : ""}
                  >
                    <CardContent className="flex justify-between items-center gap-3 p-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">
                          {job.job_title}
                        </h3>
                        <div className="flex flex-col md:flex-row item-start md:items-center gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center font-normal">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.branch}
                          </span>
                          <span className="flex items-center font-normal">
                            <Clock className="w-4 h-4 mr-1" />
                            {job.position_type}
                          </span>
                          <span className="flex items-center font-normal">
                            <Calendar className="w-4 h-4 mr-1" />
                            Posted {job.posted_date} (Deadline:{" "}
                            {job.deadline_date})
                          </span>
                        </div>
                        <p
                          className="text-sm font-normal "
                          dangerouslySetInnerHTML={{
                            __html: job.job_description,
                          }}
                        />
                      </div>
                      <Button
                        variant="primary"
                        className="shrink-0"
                        onClick={() => handleViewDetails(job.job_slug)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerPage;

CareerPage.getLayout = (page: any) => {
  // const configData = page?.props;
  return <div>{page}</div>;
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
