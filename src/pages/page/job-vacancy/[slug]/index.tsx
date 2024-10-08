import axios from "axios";
import {
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  CheckIcon,
  Clipboard,
  Copy,
  Facebook,
  GraduationCap,
  Instagram,
  Linkedin,
  Twitter,
  Users,
} from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useCareerData } from "@/hooks/career.hook";
import { getJobDetailById } from "@/services/career.service";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import MainLayout from "@/shared/main-layout";
import { useQuery } from "@tanstack/react-query";

import { config } from "../../../../../config";
import { NextPageWithLayout } from "../../../_app";
import { setCookie } from "cookies-next";
import Breadcrumb from "@/components/Breadcrumb";

const CareerDetailPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [jobId, setJobId] = useState<number>();
  const [isCopied, setIsCopied] = useState(false);

  const { data: jobData, isLoading: jobDataLoading } = useQuery<any>(
    ["getJobData", jobId],
    async () => {
      if (jobId) {
        const response = await getJobDetailById(jobId);
        return response;
      }
    }
  );

  setCookie("job_title", jobData?.job_title);

  const { data: careerData, isLoading: careerDataLoading } = useCareerData();

  useEffect(() => {
    const findJob = careerData?.find((job) => job.job_slug === slug);
    setJobId(findJob?.id);
  }, [careerData]);

  const copyToClipboard = () => {
    const jobLink = `www.Farmshop.com${router.asPath}`;
    navigator.clipboard
      .writeText(jobLink)
      .then(() => {
        console.log("Job link copied to clipboard:", jobLink);
      })
      .catch((err) => {
        console.log("Failed to copy job link:", err);
      });
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleShare = (platform: string) => {
    const jobLink = `www.Farmshop.com${router.asPath}`;
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${jobLink}`;
        break;
      case "instagram":
        shareUrl = `https://www.instagram.com/?url=${jobLink}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${jobLink}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${jobLink}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank");
  };

  return (
    <div className="bg-white pb-14 -mb-14">
      <Head>
        <title>{jobData?.job_title || "Job Details"}</title>
      </Head>
      <Breadcrumb title={jobData?.job_title || "Job Details"} />
      <div className="container mx-auto p-4 my-10 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="space-y-4 p-4">
                <div className="text-2xl font-semibold bg-primary text-white p-4 rounded-md sticky top-0">
                  {jobData?.job_title || "Job Vacancy: Delivery Rider"}
                </div>
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                  <Card>
                    <CardContent className="p-4 ">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Branch:</strong> {jobData?.branch}
                        </div>
                        <div>
                          <strong>Position Type:</strong>{" "}
                          {jobData?.position_type}
                        </div>
                        <div>
                          <strong>Posted Date:</strong> {jobData?.posted_date}
                        </div>
                        <div>
                          <strong>Deadline Date:</strong>{" "}
                          {jobData?.deadline_date}
                        </div>
                        <div>
                          <strong>Number of Openings:</strong>{" "}
                          {jobData?.openings}
                        </div>
                        <div>
                          <strong>Experience Required:</strong>{" "}
                          <p
                            className="list"
                            dangerouslySetInnerHTML={{
                              __html: jobData?.experience,
                            }}
                          />
                        </div>
                        <div className="col-span-2">
                          <strong>Education Required:</strong>{" "}
                          <div
                            className="text-justify"
                            dangerouslySetInnerHTML={{
                              __html: jobData?.education,
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-4">
                    <CardContent className="p-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center mb-3">
                          <Briefcase className="mr-2" /> Job Description
                        </h3>
                        <div
                          className="text-sm text-justify ms-[33px]"
                          dangerouslySetInnerHTML={{
                            __html: jobData?.job_description,
                          }}
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold flex items-center mb-3">
                          <Calendar className="mr-2" /> Responsibilities
                        </h3>
                        <p
                          className="text-sm list ms-[33px]"
                          dangerouslySetInnerHTML={{
                            __html: jobData?.responsibilities,
                          }}
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold flex items-center mb-3">
                          <Users className="mr-2" /> Skills
                        </h3>
                        <div
                          className="text-sm list ms-[33px]"
                          dangerouslySetInnerHTML={{ __html: jobData?.skills }}
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold flex items-center mb-3">
                          <GraduationCap className="mr-2" /> Benefits
                        </h3>
                        <div
                          className="text-sm list ms-[33px]"
                          dangerouslySetInnerHTML={{
                            __html: jobData?.benefits,
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="space-y-4 p-4">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    router.push(`/page/job-vacancy/${slug}/apply`);
                  }}
                >
                  Apply for This Job
                </Button>
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    <BookOpen className="mr-2" /> Job Link
                  </h3>
                  <div className="flex items-center mt-2">
                    <p className="text-sm !truncate !overflow-hidden p-2 py-[9px] border border-gray-800 rounded-md">
                      www.Farmshop.com/{router.asPath}
                    </p>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`ml-2 shrink-0 ${
                        isCopied ? "!bg-gray-500 !border-gray-500" : ""
                      }`}
                      onClick={copyToClipboard}
                    >
                      {isCopied ? (
                        <CheckIcon className="h-4 w-4 " />
                      ) : (
                        <Clipboard className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Share:</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare("facebook")}
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare("linkedin")}
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare("twitter")}
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerDetailPage;

CareerDetailPage.getLayout = (page) => {
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
