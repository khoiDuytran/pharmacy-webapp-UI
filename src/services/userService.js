import HttpRequest, { get, post, put } from "../utils/HttpRequests";

export const getUserProfile = async () => {
  try {
    const res = await get("/user/profile");
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUserProfile = async (data) => {
  try {
    const res = await put("/user/update-profile", data);
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllShippingAddresses = async () => {
  try {
    const response = await get("/shipping-address/get-all-shipping-address");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addShippingAddress = async (data) => {
  try {
    // assume POST /shipping-address/create or just /shipping-address
    const response = await post(
      "/shipping-address/create-shipping-address",
      data,
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateShippingAddress = async (id, data) => {
  try {
    const response = await put(`/shipping-address/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteShippingAddress = async (id) => {
  try {
    const res = await HttpRequest.delete(`/shipping-address/${id}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
