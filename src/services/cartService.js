import { get, post, put } from "../utils/HttpRequests";

export const createCart = async () => {
  try {
    const response = await post("/shopping-cart/create-shopping-cart");

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addProductToCart = async (id) => {
  try {
    const res = await put(
      `/shopping-cart/add-product-to-shopping-cart?productId=${id}`,
    );
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const removeProductFromCart = async (id) => {
  try {
    const res = await put(
      `/shopping-cart/remove-product-from-shopping-cart?productId=${id}`,
    );
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const decreaseProductFormCart = async (id) => {
  try {
    const res = await put(
      `/shopping-cart/decrease-product-from-shopping-cart?productId=${id}`,
    );
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const res = await put("/shopping-cart/clear-shopping-cart");
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCart = async () => {
  try {
    const res = await get("/shopping-cart/get-shopping-cart");
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCartCount = async () => {
  try {
    const res = await get("/shopping-cart/get-shopping-cart");

    if (!res.data) return 0;

    const items = res.data?.items || {};
    return Object.keys(items).length;
  } catch {
    return 0;
  }
};
