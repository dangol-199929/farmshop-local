import AccountSidebarLayout from "@/shared/account-sidebar-layout";
import MainLayout from "@/shared/main-layout";
import Head from "next/head";
import React, { useState } from "react";
import { IDeliveryAddress } from "@/interface/delivery-address.interface";
import Address from "@/features/Address";
import { config } from "../../../../config";
import axios from "axios";

const DelieveryAddress = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCreateMdodal, setShowCreateModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IDeliveryAddress>({
    address: "",
    mobile_number: "",
    name: "",
    default: false,
    lat: 27.7172,
    lng: 85.324,
    title: "",
  });
  return (
    <>
      <Head>
        <title>Farmshop | Address</title>
      </Head>
      <h5 className="px-6 py-4 text-xl border-b border-solid border-gray-350">
        Select Delivery Address
      </h5>
      <div className="grid grid-cols-12 gap-5 p-4">
        <Address
          formData={formData}
          setFormData={setFormData}
          showCreateModal={showCreateMdodal}
          setShowCreateModal={setShowCreateModal}
          setShowModal={setShowModal}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          showModal={showModal}
        />
      </div>
    </>
  );
};

export default DelieveryAddress;

DelieveryAddress.getLayout = (page: any) => {
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
