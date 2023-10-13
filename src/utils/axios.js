import axios from "axios";
import { configs } from "../config/index";

//used to reuse axios configuration
export const getAxiosInstance = () => {
  return axios.create({
    baseURL: configs.SERVER_URL,
  });
};
