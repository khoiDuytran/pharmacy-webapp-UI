import { post } from "../utils/HttpRequests";

// export const checkOut = async (data) => {
//   try {
//     const response = await post("/bill/check-out", data);
//     return response.data;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

export const buyNow = async (data) => {
  try {
    const response = await post("/bill/buy-now", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
