import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import Tippy from "@tippyjs/react";

import styles from "./Header.module.scss";
import config from "../../../configs";
import Search from "../Search";
import Button from "../../../components/Button";
import { useCallback, useEffect, useState } from "react";
import { getCartCount } from "../../../services/cartService";
import Logo from "../../../components/Logo";

const cx = classNames.bind(styles);

function Header({ onMenuToggle }) {
  const [currentUser, setCurrentUser] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("token");
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
              <Tippy content="Giỏ thuốc">
                <Button
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
              </Tippy>
              {!currentUser ? (
                <Button text to={config.routes.login}>
                  Đăng nhập
                </Button>
              ) : (
                <Tippy content="Tài khoản">
                  <Button
                    to={`${config.routes.profile}/thong-tin-ca-nhan`}
                    leftIcon={
                      <svg
                        width="33"
                        height="33"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 16C14.7 16 17.8 17.29 18 18H6C6.23 17.28 9.31 16 12 16ZM12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                          fill="white"
                        ></path>
                      </svg>
                    }
                  />
                </Tippy>
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
