import { useEffect, useState } from "react";
import classNames from "classnames/bind";

import styles from "./Account.module.scss";
import {
  getUserProfile,
  updateUserProfile,
} from "../../../services/userService";
const cx = classNames.bind(styles);

function Account() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [displayData, setDisplayData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    birthDate: "",
  });

  const [formData, setFormData] = useState(displayData);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        console.log(response);

        const userData = {
          name: response?.fullName || "",
          email: response?.email || "",
          phoneNumber: response?.phoneNumber || "",
          gender: response?.gender || "",
          birthDate: response?.birthDate || "",
        };

        setDisplayData(userData);
        setFormData(userData);
      } catch (error) {
        console.error("Load profile error:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError("");

      const payloadData = {
        fullName: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        birthDate: formData.birthDate,
      };
      console.log("Dữ liệu cập nhật", payloadData);

      const response = await updateUserProfile(payloadData);

      if (response && response.success === false) {
        throw new Error(response.message || "Cập nhật thất bại");
      }

      console.log("Cập nhật thành công", response);

      const userData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        birthDate: formData.birthDate,
      };

      setDisplayData(userData);
      setIsEditing(false);
    } catch (err) {
      setError("Cập nhật thất bại. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setFormData(displayData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(displayData);
    setIsEditing(false);
  };

  return (
    <div className={cx("wrapper")}>
      <h2>Thông tin cá nhân</h2>

      {!isEditing ? (
        // Display View
        <div className={cx("display-view")}>
          <div className={cx("info-row")}>
            <div className={cx("info-label")}>Họ và tên</div>
            <div className={cx("info-value")}>
              {displayData.name || "Thêm thông tin"}
            </div>
          </div>

          <div className={cx("info-row")}>
            <div className={cx("info-label")}>Email</div>
            <div className={cx("info-value")}>
              {displayData.email || "Thêm thông tin"}
            </div>
          </div>

          <div className={cx("info-row")}>
            <div className={cx("info-label")}>Số điện thoại</div>
            <div className={cx("info-value")}>
              {displayData.phoneNumber || "Thêm thông tin"}
            </div>
          </div>

          <div className={cx("info-row")}>
            <div className={cx("info-label")}>Giới tính</div>
            <div className={cx("info-value")}>
              {displayData.gender || "Thêm thông tin"}
            </div>
          </div>

          <div className={cx("info-row")}>
            <div className={cx("info-label")}>Ngày sinh</div>
            <div className={cx("info-value")}>
              {displayData.birthDate || "Thêm thông tin"}
            </div>
          </div>

          <div className={cx("actions")}>
            <button
              type="button"
              className={cx("btn-submit")}
              onClick={handleEdit}
            >
              Chỉnh sửa thông tin
            </button>
          </div>
        </div>
      ) : (
        // Edit View
        <form onSubmit={handleSubmit}>
          <div className={cx("form-group")}>
            <label>Họ và tên</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className={cx("form-group")}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className={cx("form-group")}>
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className={cx("form-group")}>
            <label>Giới tính</label>
            <div className={cx("radio-group")}>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Nam"
                  checked={formData.gender === "Nam"}
                  onChange={handleChange}
                />
                Nam
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Nữ"
                  checked={formData.gender === "Nữ"}
                  onChange={handleChange}
                />
                Nữ
              </label>
            </div>
          </div>

          <div className={cx("form-group")}>
            <label>Ngày sinh</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>

          {error && <div className={cx("error")}>{error}</div>}

          <div className={cx("actions")}>
            <button
              type="submit"
              className={cx("btn-submit")}
              disabled={isLoading}
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
            </button>

            <button
              type="button"
              className={cx("btn-cancel")}
              onClick={handleCancel}
            >
              Hủy
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Account;
