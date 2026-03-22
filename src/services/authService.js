import HttpRequest, { post } from "../utils/HttpRequests";

export const login = async (username, password) => {
  try {
    const res = await HttpRequest.post("/auth/login", {
      username,
      password,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const register = async (username, password) => {
  try {
    const res = await HttpRequest.post("/auth/register", {
      username,
      password,
    });

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const res = await post("/auth/logout");
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
