import axiosInstance from "@/axios/axiosInstance";
import { config } from "../../config";
const apiEndPoint2 = config.gateway.apiEndPoint2;

export const getBlogs = async () => {
  try {
    const response = await axiosInstance.get(
      `/${apiEndPoint2}/blogs?page=1&keyword=`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBlogDetailsFromSlug = async (slug: string | string[]) => {
  try {
    const response = await axiosInstance.get(`/${apiEndPoint2}/pages/${slug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
