import axios from "axios";

const baseURL = "http://ivivaanywhere.ivivacloud.com/api";
const APIKEY = "SC:demo:64a9aa122143a5db";

const instance = axios.create({
  baseURL: baseURL,
});

export const GetAllAssets = async ({ limit = 10, rowId = 0 }) => {
  try {
    return await instance.get(
      `/Asset/Asset/All?apikey=${APIKEY}&max=${limit}&last=${rowId}`
    );
  } catch (error) {
    return error;
  }
};
