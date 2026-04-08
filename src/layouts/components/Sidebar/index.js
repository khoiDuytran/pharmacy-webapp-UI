import classNames from "classnames/bind";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faLocationDot,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";

import styles from "./Sidebar.module.scss";
import { logout } from "../../../services/authService";
import { deleteChatbotSession } from "../../../services/chatbotService";

const cx = classNames.bind(styles);

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      title: "Đơn hàng của tôi",
      icon: faBox,
      path: "/profile/don-hang",
    },
    {
      title: "Thông tin cá nhân",
      icon: faUser,
      path: "/profile/thong-tin-ca-nhan",
    },
    {
      title: "Sổ địa chỉ",
      icon: faLocationDot,
      path: "/profile/dia-chi",
    },
  ];

  const handleLogout = () => {
    try {
      logout();
      const sessionId = localStorage.getItem("chat_session_id");
      if (sessionId) deleteChatbotSession(sessionId);
    } catch (error) {
      console.error(error);
    } finally {
      Cookies.remove("token");
      localStorage.removeItem("username");
      localStorage.removeItem("chat_session_id");
      window.location.href = "/";
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("items")}>
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            style={{ textDecoration: "none" }}
            className={cx("link")}
          >
            <div
              className={cx("item", {
                active: location.pathname === item.path,
              })}
            >
              <FontAwesomeIcon icon={item.icon} />
              <span className={cx("title")}>{item.title}</span>
            </div>
          </Link>
        ))}
      </div>
      <div className={cx("logout-btn")}>
        <button className={cx("item-logout")} onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOut} />
          <span className={cx("title")}>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
