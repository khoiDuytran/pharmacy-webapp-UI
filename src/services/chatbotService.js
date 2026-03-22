import { post } from "../utils/HttpRequests";

export const getChatbotResponse = async (message, sessionId = "default") => {
  try {
    const response = await post("/chat", null, {
      params: { message },
      headers: { "X-Session-Id": sessionId },
    });
    return response;
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    throw error;
  }
};

export const deleteChatbotSession = async (sessionId) => {
  try {
    await post("/chat/delete-session", null, {
      headers: { "X-Session-Id": sessionId },
    });
    return true;
  } catch (error) {
    console.error("Error deleting chatbot session:", error);
    throw error;
  }
};
