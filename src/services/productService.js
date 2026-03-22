import { get } from "../utils/HttpRequests";

export const getProduct = async () => {
  try {
    const res = await get("/product/get-all-products");
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getProductById = async (id) => {
  try {
    // the backend endpoint uses the id in the path; no need for a query parameter
    const response = await get(`/product/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
