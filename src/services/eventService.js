import { get } from "../utils/HttpRequests";

export const getAllEvent = async () => {
  try {
    const res = await get("/discount-event/get-all-discount-event");
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
