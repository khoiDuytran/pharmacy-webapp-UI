import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBox,
  faCartShopping,
  faLocationDot,
  faSearch,
  faSignOut,
  faUser,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import HeadlessTippy from "@tippyjs/react/headless";
import Cookies from "js-cookie";

import styles from "./Header.module.scss";
import config from "../../../configs";
import Search from "../Search";
import Button from "../../../components/Button";
import { useCallback, useEffect, useState } from "react";
import { getCartCount } from "../../../services/cartService";
import Logo from "../../../components/Logo";
import { Wrapper } from "../../../components/Popper";
import { logout } from "../../../services/authService";
import { deleteChatbotSession } from "../../../services/chatbotService";

const cx = classNames.bind(styles);

const UserMenu = [
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

function Header({ onMenuToggle }) {
  const [currentUser, setCurrentUser] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const storedUser = Cookies.get("token");
    setCurrentUser(!!storedUser);
  }, []);

  const loadCartCount = useCallback(async () => {
    const count = await getCartCount();
    setCartCount(count);
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadCartCount();
    } else {
      setCartCount(0);
    }
    window.addEventListener("cart-updated", loadCartCount);
    return () => window.removeEventListener("cart-updated", loadCartCount);
  }, [currentUser, loadCartCount]);

  const handleHideMenu = () => {
    setShowMenu(false);
  };

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
    <header className={cx("wrapper")}>
      {/* Desktop Header */}
      <div className={cx("desktop-header")}>
        <div className={cx("inner")}>
          <div className={cx("items-header")}>
            <div className={cx("logo")}>
              <Link to={config.routes.home} className={cx("logo-link")}>
                <Logo />
              </Link>
            </div>
            <Search />
            <div className={cx("actions")}>
              <Button
                to={config.routes.cart}
                primary
                leftIcon={<FontAwesomeIcon icon={faCartShopping} />}
                badge={cartCount}
              >
                <span>Giỏ thuốc</span>
              </Button>
              {!currentUser ? (
                <Button
                  primary
                  leftIcon={<FontAwesomeIcon icon={faUserCircle} />}
                  to={config.routes.login}
                >
                  <span>Đăng nhập</span>
                </Button>
              ) : (
                <HeadlessTippy
                  interactive
                  visible={showMenu}
                  render={(attrs) => (
                    <div className={cx("user-menu")} tabIndex="-1" {...attrs}>
                      <Wrapper>
                        <div className={cx("user-menu-body")}>
                          {UserMenu.map((item, index) => {
                            return (
                              <div className={cx("menu-item")}>
                                <Link
                                  key={index}
                                  to={item.path}
                                  className={cx("user-menu-item")}
                                  onClick={() => setShowMenu(false)}
                                >
                                  <FontAwesomeIcon icon={item.icon} />
                                  <span className={cx("menu-item-title")}>
                                    {item.title}
                                  </span>
                                </Link>
                              </div>
                            );
                          })}

                          <div className={cx("logout-btn")}>
                            <button
                              className={cx("item-logout")}
                              onClick={handleLogout}
                            >
                              <FontAwesomeIcon icon={faSignOut} />
                              <span className={cx("title")}>Đăng xuất</span>
                            </button>
                          </div>
                        </div>
                      </Wrapper>
                    </div>
                  )}
                  onClickOutside={handleHideMenu}
                >
                  <Button primary onClick={() => setShowMenu((p) => !p)}>
                    <div className={cx("username-img")}>
                      {localStorage
                        .getItem("username")
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </div>
                    {localStorage.getItem("username") || "Tài khoản"}
                  </Button>
                </HeadlessTippy>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className={cx("mobile-header")}>
        {/* Gọi onMenuToggle từ Navbar */}
        <button className={cx("mobile-menu-btn")} onClick={onMenuToggle}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className={cx("logo-mobile")}>
          <Link to={config.routes.home} className={cx("logo-link")}>
            <Logo />
          </Link>
        </div>

        <button
          className={cx("mobile-menu-btn")}
          onClick={() => setShowSearch((p) => !p)}
        >
          {" "}
          <FontAwesomeIcon icon={faSearch} />{" "}
        </button>
        <Button
          className={cx("mobile-cart-btn")}
          to={config.routes.cart}
          leftIcon={
            <svg
              width="25"
              height="25"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5461 11C15.2961 11 15.9561 10.59 16.2961 9.97L19.8761 3.48C20.2461 2.82 19.7661 2 19.0061 2H4.20609L3.26609 0H-0.00390625V2H1.99609L5.59609 9.59L4.24609 12.03C3.51609 13.37 4.47609 15 5.99609 15H17.9961V13H5.99609L7.09609 11H14.5461ZM5.15609 4H17.3061L14.5461 9H7.52609L5.15609 4ZM5.99609 16C4.89609 16 4.00609 16.9 4.00609 18C4.00609 19.1 4.89609 20 5.99609 20C7.09609 20 7.99609 19.1 7.99609 18C7.99609 16.9 7.09609 16 5.99609 16ZM15.9961 16C14.8961 16 14.0061 16.9 14.0061 18C14.0061 19.1 14.8961 20 15.9961 20C17.0961 20 17.9961 19.1 17.9961 18C17.9961 16.9 17.0961 16 15.9961 16Z"
                fill="white"
              ></path>
            </svg>
          }
          badge={cartCount}
        />
      </div>

      {/* Mobile Search */}
      {showSearch && (
        <div className={cx("mobile-search-container")}>
          <Search />
        </div>
      )}
    </header>
  );
}

export default Header;
