import { useContext, useEffect, useState } from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";

import styles from "./Address.module.scss";
import {
  getAllShippingAddresses,
  addShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
} from "../../../services/userService";
import Loading from "../../../components/Loading";
import { ToastContext } from "../../../contexts/ToastProvider";
import useDebounce from "../../../hooks/useDebounce";

const cx = classNames.bind(styles);

const CITIES = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Hải Phòng",
  "Đà Nẵng",
  "Cần Thơ",
  "Hà Giang",
  "Ninh Bình",
  "Thái Bình",
  "Nam Định",
  "Vĩnh Phúc",
];

const DISTRICTS = [
  "Quận Hai Bà Trưng",
  "Quận Ba Đình",
  "Quận Hoàn Kiếm",
  "Quận Cầu Giấy",
  "Quận Thanh Xuân",
  "Quận Đống Đa",
  "Quận Nam Từ Liêm",
  "Quận Bắc Từ Liêm",
  "Quận Hà Đông",
  "Quận Hoàng Mai",
];

const EMPTY_FORM = {
  recipientName: "",
  numPhone: "",
  addressLine: "",
  district: "",
  city: "",
  isDefault: false,
};

const VALIDATORS = {
  recipientName: {
    regex: /[^a-zA-ZÀ-ỹ\s]/,
    message: "Tên người nhận chỉ được chứa chữ cái và khoảng trắng",
  },
  numPhone: {
    regex: /[^0-9]/,
    message: "Số điện thoại chỉ được chứa số",
  },
};

function Address() {
  const { toast } = useContext(ToastContext);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null); // null | "add" | "edit"
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fieldWarnings, setFieldWarnings] = useState({
    recipientName: "",
    numPhone: "",
  });

  const debouncedName = useDebounce(formData.recipientName, 100);
  const debouncedPhone = useDebounce(formData.numPhone, 100);

  useEffect(() => {
    const fetchShippingAddress = async () => {
      try {
        const res = await getAllShippingAddresses();
        console.log(res);

        setAddresses(res || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchShippingAddress();
  }, []);

  useEffect(() => {
    if (!debouncedName) {
      setFieldWarnings((p) => ({ ...p, recipientName: "" }));
      return;
    }
    setFieldWarnings((p) => ({
      ...p,
      recipientName: VALIDATORS.recipientName.regex.test(debouncedName)
        ? VALIDATORS.recipientName.message
        : "",
    }));
  }, [debouncedName]);

  useEffect(() => {
    if (!debouncedPhone) {
      setFieldWarnings((p) => ({ ...p, numPhone: "" }));
      return;
    }
    setFieldWarnings((p) => ({
      ...p,
      numPhone: VALIDATORS.numPhone.regex.test(debouncedPhone)
        ? VALIDATORS.numPhone.message
        : "",
    }));
  }, [debouncedPhone]);

  const hasWarnings = Object.values(fieldWarnings).some((w) => !!w);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setFormMode("add");
  };

  const openEditForm = (addr) => {
    setFormData({
      recipientName: addr.recipientName || "",
      numPhone: addr.numPhone || "",
      addressLine: addr.addressLine || "",
      district: addr.district || "",
      city: addr.city || "",
      isDefault: addr.isDefault || false,
    });
    setEditingId(addr.id);
    setFormMode("edit");
  };

  const handleCancel = () => {
    setFormMode(null);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { recipientName, numPhone, addressLine, district, city } = formData;
    if (!recipientName || !numPhone || !addressLine || !district || !city)
      return;

    try {
      if (formMode === "add") {
        const res = await addShippingAddress(formData);
        const added = res?.data || res || { ...formData, id: Date.now() };
        setAddresses((prev) => [...prev, added]);
        toast.success("Thêm địa chỉ mới thành công!");
      } else {
        const res = await updateShippingAddress(editingId, formData);
        const updated = res?.data || res || { ...formData, id: editingId };
        setAddresses((prev) =>
          prev.map((addr) => (addr.id === editingId ? updated : addr)),
        );
        toast.success("Cập nhật địa chỉ thành công!");
      }
      handleCancel();
    } catch (err) {
      console.error("Error saving address", err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteShippingAddress(id);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      toast.success("Đã xóa địa chỉ thành công!");
    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({ ...addr, isDefault: addr.id === id })),
    );
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h2>Quản lý sổ địa chỉ</h2>
        <button className={cx("btn-add")} onClick={openAddForm}>
          <FontAwesomeIcon icon={faPlus} />
          Thêm địa chỉ mới
        </button>
      </div>

      {/* Form thêm / sửa */}
      {formMode && (
        <div className={cx("form-container")}>
          <h3>
            {formMode === "add" ? "Thêm địa chỉ mới" : "Chỉnh sửa địa chỉ"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className={cx("form-row")}>
              <div className={cx("form-group")}>
                <label>Tên người nhận</label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  placeholder="Nhập tên người nhận"
                  className={cx({
                    "input-error": !!fieldWarnings.recipientName,
                  })}
                  required
                />
                {fieldWarnings.recipientName && (
                  <p className={cx("field-warning")}>
                    {fieldWarnings.recipientName}
                  </p>
                )}
              </div>
              <div className={cx("form-group")}>
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="numPhone"
                  value={formData.numPhone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  className={cx({ "input-error": !!fieldWarnings.numPhone })}
                  required
                />
                {fieldWarnings.numPhone && (
                  <p className={cx("field-warning")}>
                    {fieldWarnings.numPhone}
                  </p>
                )}
              </div>
            </div>

            <div className={cx("form-group")}>
              <label>Chọn Tỉnh/Thành phố</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Chọn Tỉnh/Thành phố --</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className={cx("form-group")}>
              <label>Chọn Quận/Huyện</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Chọn Quận/Huyện --</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className={cx("form-group")}>
              <label>Nhập địa chỉ cụ thể</label>
              <input
                type="text"
                name="addressLine"
                value={formData.addressLine}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ cụ thể"
                required
              />
            </div>

            <div className={cx("form-group", "checkbox-group")}>
              <label className={cx("checkbox-label")}>
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                />
                <span className={cx("toggle-bg")}></span>
              </label>
              <span>Đặt làm địa chỉ mặc định</span>
            </div>

            <div className={cx("form-actions")}>
              <button
                type="submit"
                className={cx("btn-submit")}
                disabled={hasWarnings}
              >
                {formMode === "add" ? "Lưu địa chỉ" : "Cập nhật"}
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
        </div>
      )}

      {/* Danh sách địa chỉ */}
      <div className={cx("addresses-list", { hidden: !!formMode })}>
        {loading ? (
          <Loading />
        ) : addresses.length === 0 ? (
          <p className={cx("empty-message")}>Chưa có địa chỉ nào</p>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} className={cx("address-item")}>
              <div className={cx("address-info")}>
                <div className={cx("address-header")}>
                  <span className={cx("name")}>{addr.recipientName}</span>
                  <span className={cx("phone")}>{addr.numPhone}</span>
                  {addr.isDefault && (
                    <span className={cx("badge-default")}>Mặc định</span>
                  )}
                </div>
                <div className={cx("address-main")}>
                  {addr.addressLine}, {addr.district}, {addr.city}
                </div>
              </div>

              <div className={cx("address-actions")}>
                <button
                  className={cx("btn-default")}
                  onClick={() => handleSetDefault(addr.id)}
                  disabled={addr.isDefault}
                >
                  Mặc định
                </button>
                <button
                  className={cx("btn-edit")}
                  onClick={() => openEditForm(addr)}
                >
                  <FontAwesomeIcon icon={faEdit} /> Sửa
                </button>
                <button
                  className={cx("btn-delete")}
                  onClick={() => handleDelete(addr.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Address;
