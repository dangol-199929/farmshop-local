import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import MainLayout from "@/shared/main-layout";
import { NextPageWithLayout } from "../../../../_app";
import { config } from "../../../../../../config";
import axios from "axios";
import JobApplication from "@/features/job-form";

const CareerApplicationForm: NextPageWithLayout = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LfYLD4qAAAAAD7u_LUpYr71TpZXiyticjCnpuHK">
      <JobApplication />
    </GoogleReCaptchaProvider>
  );
};

export default CareerApplicationForm;

CareerApplicationForm.getLayout = (page) => {
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
