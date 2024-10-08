import axiosInstance from "@/axios/axiosInstance";
import { config } from "../../config";
const apiEndPoint2 = config.gateway.apiEndPoint2;

export const getTestimonials = async () => {
  try {
    const response = await axiosInstance.get(`/${apiEndPoint2}/testimonials`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
