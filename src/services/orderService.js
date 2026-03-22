import { get, put } from "../utils/HttpRequests";

export const getMyOrders = async () => {
  try {
    const res = await get("/bill/my-orders");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getBillById = async (id) => {
  try {
    const res = await get(`/bill/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const cancelOrder = async (id) => {
  try {
    const res = await put(`/bill/${id}/cancel`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const returnOrder = async (id) => {
  try {
    const res = await put(`/bill/${id}/update-order-status`, null, {
      params: { orderStatus: 5 },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updatePaymentStatus = async (id) => {
  try {
    const res = await put(`/bill/${id}/update-payment-status`, null, {
      params: { paymentStatus: 1 },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
