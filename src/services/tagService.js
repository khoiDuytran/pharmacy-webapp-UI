import { get } from "../utils/HttpRequests";

export const getAllTags = async () => {
  try {
    const res = await get("/tag/get-all-tag");
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
