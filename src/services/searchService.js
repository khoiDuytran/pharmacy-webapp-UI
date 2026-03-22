import { get } from "../utils/HttpRequests";

const search = async (name) => {
  try {
    const res = await get("product/search", { params: { name } });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export default search;
