import { get } from "../utils/HttpRequests";

export const getAllManufacturs = async () => {
  try {
    const response = await get("/manufacturer/get-all-manufacturer");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
