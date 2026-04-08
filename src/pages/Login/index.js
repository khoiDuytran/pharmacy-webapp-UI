import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import Cookies from "js-cookie";

import styles from "./Login.module.scss";
import { login } from "../../services/authService";
import { getCart, createCart } from "../../services/cartService";
import Loading from "../../components/Loading";
import { ToastContext } from "../../contexts/ToastProvider";
import useDebounce from "../../hooks/useDebounce";

const cx = classNames.bind(styles);

const INITIAL_FORM = {
  username: "",
  password: "",
};

function Login() {
  const usernameRef = useRef();
  const [form, setForm] = useState(INITIAL_FORM);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [usernameWarning, setUsernameWarning] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useContext(ToastContext);

  const debouncedUsername = useDebounce(form.username, 600);

  useEffect(() => {
    if (!debouncedUsername) {
      setUsernameWarning("");
      return;
    }

    const hasSpecialChar = /[^a-zA-Z0-9_]/.test(debouncedUsername);
    setUsernameWarning(
      hasSpecialChar ? "Tên đăng nhập không được chứa kí hiệu đặc biệt" : "",
    );
  }, [debouncedUsername]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearUsername = () => {
    setForm((prev) => ({ ...prev, username: "" }));
    usernameRef.current?.focus();
  };

  const validate = () => {
    if (!form.username.trim() || !form.password.trim()) {
      return "Vui lòng nhập đầy đủ thông tin!";
    }
    if (/[^a-zA-Z0-9_]/.test(form.username)) {
      return "Tên đăng nhập không được chứa kí hiệu đặc biệt!";
    }
    if (!agreedToTerms) {
      return "Vui lòng đồng ý với điều khoản sử dụng!";
    }
    return null;
  };

  const ensureCartExists = async () => {
    try {
      const cartRes = await getCart();
      console.log(cartRes);

      if (!cartRes?.data) {
        try {
          const create = await createCart();
          if (create.success) console.log("Tao gio hang thanh cong");
        } catch (cartError) {
          console.error("Tạo giỏ hàng thất bại:", cartError);
        }
      } else {
        console.log("Da co gio hang !");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await login(form.username, form.password);

      if (!response?.success) {
        setError(response?.message || "Đăng nhập thất bại!");
        return;
      }

      const token = response?.data?.token;
      if (token) {
        Cookies.set("token", token);
        localStorage.setItem("username", form.username);
      }

      await ensureCartExists();

      toast.success("Đăng nhập thành công!");

      window.location.href = "/";
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Tên đăng nhập hoặc mật khẩu không đúng!";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cx("login-container")}>
      <div className={cx("login-box")}>
        <div className={cx("login-content")}>
          <h1 className={cx("title")}>Đăng nhập</h1>
          <p className={cx("subtitle")}>
            Vui lòng nhập tên đăng nhập và mật khẩu để đăng nhập vào hệ thống
          </p>

          <form onSubmit={handleLogin} className={cx("form")}>
            <div className={cx("input-group")}>
              <label className={cx("label")}>Tên đăng nhập</label>
              {usernameWarning && (
                <p className={cx("field-warning")}>{usernameWarning}</p>
              )}
              <div className={cx("input-wrapper")}>
                <input
                  ref={usernameRef}
                  type="text"
                  name="username"
                  className={cx("input", { "input-error": !!usernameWarning })}
                  placeholder="Nhập tên đăng nhập"
                  value={form.username}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {form.username && (
                  <button
                    type="button"
                    className={cx("clear-btn")}
                    onClick={handleClearUsername}
                    disabled={isLoading}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className={cx("input-group")}>
              <label className={cx("label")}>Mật khẩu</label>
              <div className={cx("input-wrapper")}>
                <input
                  type="password"
                  name="password"
                  className={cx("input")}
                  placeholder="Nhập mật khẩu"
                  value={form.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className={cx("terms-group")}>
              <label className={cx("checkbox")}>
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  disabled={isLoading}
                />
                <span className={cx("checkmark")} />
              </label>
              <p className={cx("terms-text")}>
                Tôi đồng ý với{" "}
                <Link to="/profile" className={cx("link")}>
                  Các điều khoản
                </Link>
                , và{" "}
                <Link to="/profile" className={cx("link")}>
                  Chính sách Bảo vệ thông tin cá nhân
                </Link>{" "}
                và nhận thông tin quảng cáo, chăm sóc khách hàng
              </p>
            </div>

            {error && <p className={cx("error-message")}>{error}</p>}

            <button
              type="submit"
              className={cx("continue-btn")}
              disabled={isLoading}
            >
              {isLoading ? <Loading /> : "Tiếp tục"}
            </button>

            <Link className={cx("create-btn")} to="/register">
              Chưa có tài khoản? Đăng ký ngay
            </Link>
          </form>
        </div>
      </div>

      <div className={cx("mascot-container")}>
        <div className={cx("mascot")}>
          <div className={cx("mascot-placeholder")}>
            <img
              alt="background"
              loading="lazy"
              width="600"
              height="350"
              decoding="async"
              className={cx("mascot-img")}
              src="https://cdnv2.tgdd.vn/webmwg/production-fe/ankhang/public/static/images/bg_footer.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
