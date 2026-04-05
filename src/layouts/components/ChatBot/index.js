import { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import Tippy from "@tippyjs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faXmark } from "@fortawesome/free-solid-svg-icons";

import styles from "./ChatBot.module.scss";
// import image from "../../../assets/images/AIchatbot.png";
// import image from "../../../assets/images/AI.png";
import image from "../../../assets/images/support.png";
import { Wrapper as PopperWrapper } from "../../../components/Popper";
import { getChatbotResponse } from "../../../services/chatbotService";
import logoIcon from "../../../assets/images/iconLogo.png";

const cx = classNames.bind(styles);

const WELCOME_MSG = {
  id: "welcome",
  role: "bot",
  text: "Xin chào Quý khách.\nTôi đã sẵn sàng hỗ trợ bạn!",
};

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef();
  const sessionId = useRef(null);

  useEffect(() => {
    const openChat = () => setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
    window.addEventListener("open-chatbot", openChat);
    return () => {
      window.removeEventListener("open-chatbot", openChat);
    };
  }, []);

  if (!sessionId.current) {
    const id = crypto.randomUUID();
    localStorage.setItem("chat_session_id", id);
    sessionId.current = id;
  }

  const scrollToBottom = () => {
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    scrollToBottom();

    try {
      const res = await getChatbotResponse(text, sessionId.current);
      const botMsg = {
        id: Date.now() + 1,
        role: "bot",
        text:
          typeof res === "string"
            ? res
            : res?.message || res?.data || "Xin lỗi, tôi không hiểu yêu cầu.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: "Đã có lỗi xảy ra. Vui lòng thử lại.",
        },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cx("container")}>
      {isOpen && (
        <PopperWrapper className={cx("chat-window")}>
          <div className={cx("chat-header")}>
            <div className={cx("title")}>
              <img src={logoIcon} alt="Logo" className={cx("logo-icon")} />
              <span className={cx("chat-title")}>Tư vấn trực tuyến</span>
            </div>
            <button
              className={cx("close-btn")}
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          <div className={cx("messages")}>
            {messages.map((msg) => (
              <div key={msg.id} className={cx("message", msg.role)}>
                <div className={cx("bubble")}>
                  {msg.text.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className={cx("message", "bot")}>
                <div className={cx("bubble", "typing")}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className={cx("input-area")}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Gửi yêu cầu..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className={cx("send-btn", { active: !!input.trim() })}
              onClick={handleSend}
              disabled={!input.trim() || loading}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </PopperWrapper>
      )}

      <Tippy content="Tư vấn trực tuyến" placement="top" disabled={isOpen}>
        <div
          className={cx("wrapper", { active: isOpen })}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <img src={image} className={cx("chatbot-icon")} alt="ChatBot" />
        </div>
      </Tippy>
    </div>
  );
}

export default ChatBot;
