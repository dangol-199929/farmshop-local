import ProfileForm from "@/features/My-Account/profile-form";
import AccountSidebarLayout from "@/shared/account-sidebar-layout";
import MainLayout from "@/shared/main-layout";
import { config } from "../../../../config";
import axios from "axios";
import Head from "next/head";
import React from "react";

const Profile = () => {
  return (
    <>
      <Head>
        <title>Farmshop | Profile</title>
      </Head>
      <h5 className="px-6 py-4 text-xl border-b border-solid border-gray-350">
        My Account Information
      </h5>
      <ProfileForm />
    </>
  );
};

export default Profile;

Profile.getLayout = (page: any) => {
  const configData = page?.props;
  return (
    <MainLayout configData={configData}>
      <AccountSidebarLayout>{page}</AccountSidebarLayout>
    </MainLayout>
  );
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
