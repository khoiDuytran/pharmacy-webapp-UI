import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";

import styles from "../Login/Login.module.scss";
import { register } from "../../services/authService";
import Loading from "../../components/Loading";
import { ToastContext } from "../../contexts/ToastProvider";
import useDebounce from "../../hooks/useDebounce";

const cx = classNames.bind(styles);

const INITIAL_FORM = {
  username: "",
  password: "",
  repeatPassword: "",
};

function Register() {
  const usernameRef = useRef();
  const navigate = useNavigate();
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
    if (form.password !== form.repeatPassword) {
      return "Mật khẩu không trùng khớp!";
    }
    if (!agreedToTerms) {
      return "Vui lòng đồng ý với điều khoản sử dụng!";
    }
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await register(form.username, form.password);

      console.log(response);

      if (response.success) {
        toast.success("Đăng ký thành công!");
        navigate("/login");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Đăng ký thất bại!";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cx("login-container")}>
      <div className={cx("login-box")}>
        <div className={cx("login-content")}>
          <h1 className={cx("title")}>Đăng Ký</h1>
          <p className={cx("subtitle")}>
            Vui lòng nhập tên đăng nhập, mật khẩu và xác nhận lại mật khẩu để
            đăng ký tài khoản vào hệ thống
          </p>

          <form onSubmit={handleRegister} className={cx("form")}>
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

            <div className={cx("input-group")}>
              <label className={cx("label")}>Nhập lại mật khẩu</label>
              <div className={cx("input-wrapper")}>
                <input
                  type="password"
                  name="repeatPassword"
                  className={cx("input")}
                  placeholder="Nhập lại mật khẩu"
                  value={form.repeatPassword}
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

            <Link className={cx("create-btn")} to="/login">
              Đã có tài khoản? Đăng nhập tại đây
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
              className="object-cover opacity-100"
              src="https://cdnv2.tgdd.vn/webmwg/production-fe/ankhang/public/static/images/bg_footer.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
