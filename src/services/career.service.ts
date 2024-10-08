import axiosInstance from "@/axios/axiosInstance";
import { config } from "../../config";

const apiEndPoint2 = config.gateway.apiEndPoint2;
const apiURL = config.gateway.apiURL;
export const getJobVacancies = async () => {
  try {
    const response = await axiosInstance.get(`/${apiEndPoint2}/job-vacancies`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getJobDetailById = async (id: any) => {
  try {
    const response = await axiosInstance.get(
      `/${apiEndPoint2}/job-vacancies/${id}`
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const applyJob = async (id: any, payload: any) => {
  const url = `${apiURL}/${apiEndPoint2}/job-vacancies/${id}/apply`;

  try {
    const formData = new FormData();
    formData.append("cv", payload.fileName);
    formData.append("email", payload.email);
    formData.append("full_name", payload.full_name);
    formData.append("address", payload.address);
    formData.append("phone_number", payload.phone_number);
    formData.append("recaptchaToken", payload.recaptchaToken);

    const response = await axiosInstance.post(url, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
