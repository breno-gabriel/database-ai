import axios from "axios";
import "dotenv/config";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,

  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
