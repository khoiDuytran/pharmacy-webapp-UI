import { get } from "../utils/HttpRequests";

export const getAllSections = async () => {
  try {
    const res = await get("/section/get-all-section");
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
