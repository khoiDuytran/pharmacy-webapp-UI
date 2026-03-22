import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faUser,
  faTimes,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./Navbar.module.scss";
import { getAllCategories } from "../../../services/categoryService";
import config from "../../../configs";

const cx = classNames.bind(styles);

function Navbar({ mobileMenuOpen, onMenuClose }) {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [currentUser, setCurrentUser] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentUser(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    onMenuClose();
    window.location.reload();
  };

  return (
    <>
      {/* Desktop Navbar */}
      <div className={cx("wrapper")}>
        <nav className={cx("inner")}>
          {categories?.map((item, index) => {
            const active = location.search.includes(item.slug);
            return (
              <Link
                key={index}
                to={`/products?category=${item.slug}`}
                className={cx("item", { active })}
              >
                {item.name}
              </Link>
            );
          })}
          <Link to="/location" className={cx("item")}>
            HỆ THỐNG NHÀ THUỐC
          </Link>
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className={cx("mobile-sidebar-overlay")} onClick={onMenuClose} />
      )}

      {/* Mobile Sidebar */}
      <div className={cx("mobile-sidebar", { open: mobileMenuOpen })}>
        {/* Nút đóng */}
        <div className={cx("close-btn")}>
          <button onClick={onMenuClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* User section */}
        <div className={cx("sidebar-header")}>
          {currentUser ? (
            <div className={cx("user-actions")}>
              <Link
                to={`${config.routes.profile}/thong-tin-ca-nhan`}
                className={cx("user-link")}
                onClick={onMenuClose}
              >
                <FontAwesomeIcon icon={faUser} />
                <span>Tài khoản</span>
              </Link>
              <button className={cx("logout-btn")} onClick={handleLogout}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
              </button>
            </div>
          ) : (
            <Link
              to={config.routes.login}
              className={cx("login-link")}
              onClick={onMenuClose}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>

        {/* Danh mục */}
        <nav className={cx("categories-list")}>
          {categories?.map((item, index) => (
            <Link
              key={index}
              to={`/products?category=${item.slug}`}
              className={cx("category-item")}
              onClick={onMenuClose}
            >
              <span>{item.name}</span>
              <FontAwesomeIcon icon={faChevronRight} />
            </Link>
          ))}
          <Link
            to="/location"
            className={cx("category-item")}
            onClick={onMenuClose}
          >
            <span>Hệ thống nhà thuốc</span>
            <FontAwesomeIcon icon={faChevronRight} />
          </Link>
        </nav>
      </div>
    </>
  );
}

export default Navbar;
