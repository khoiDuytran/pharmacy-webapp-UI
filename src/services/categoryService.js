import { get } from "../utils/HttpRequests";

export const getAllCategories = async () => {
  try {
    const res = await get("/categories/get-all-categories");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
