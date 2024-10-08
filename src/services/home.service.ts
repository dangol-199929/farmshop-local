import axiosInstance, { setWarehouseIdAxios } from "@/axios/axiosInstance";
import { config } from "../../config";
import { addWareHouseToStorage } from "@/shared/utils/local-storage-utils";

const apiEndPoint1 = config.gateway.apiEndPoint1;
const apiEndPoint2 = config.gateway.apiEndPoint2;
export const getCategoriesList = async () => {
  try {
    await setWarehouseIdAxios();
    const response = await axiosInstance.get(`/${apiEndPoint1}/categories`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getHomeData = async () => {
  try {
    await setWarehouseIdAxios();
    const response = await axiosInstance.get(`/${apiEndPoint2}/web-home`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getConfig = async () => {
  try {
    await setWarehouseIdAxios();
    const response = await axiosInstance.get(`/${apiEndPoint1}/web-config`);
    addWareHouseToStorage(response?.data?.data?.warehouses);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBannerPopup = async () => {
  try {
    await setWarehouseIdAxios();
    const response = await axiosInstance.get(
      `${apiEndPoint1}/banner?type=popup`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNavCategories = async () => {
  try {
    await setWarehouseIdAxios();
    const response = await axiosInstance.get(
      `/${apiEndPoint1}/navHeader/categories`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
