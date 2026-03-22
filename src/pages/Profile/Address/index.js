import { useState } from "react";
import styles from "./Address.module.scss";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import {
  getAllShippingAddresses,
  addShippingAddress,
  deleteShippingAddress,
} from "../../../services/userService";
import Loading from "../../../components/Loading";

const cx = classNames.bind(styles);

function Address() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: "",
    numPhone: "",
    addressLine: "",
    district: "",
    city: "",
    isDefault: false,
  });

  // Mock data for dropdowns
  const cities = [
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
  const districts = [
    "Quân Hai Ba Trung",
    "Quân Ba Đình",
    "Quân Hoàn Kiếm",
    "Quân Cầu Giấy",
    "Quận Thanh Xuân",
    "Quận Đống Đa",
    "Quận Nam Từ Liêm",
    "Quận Bắc Từ Liêm",
    "Quận Hà Đông",
    "Quận Hoàng Mai",
  ];

  // fetch existing addresses from server
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllShippingAddresses();
        console.log("Addresses loaded:", res);

        setAddresses(res || []);
      } catch (e) {
        console.error("Failed to load addresses", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (
      newAddress.recipientName &&
      newAddress.numPhone &&
      newAddress.addressLine &&
      newAddress.district &&
      newAddress.city
    ) {
      try {
        const res = await addShippingAddress(newAddress);
        const added = res?.data || res || { ...newAddress, id: Date.now() };
        setAddresses([...addresses, added]);
      } catch (err) {
        console.error("Error adding address", err);
      }

      setNewAddress({
        recipientName: "",
        numPhone: "",
        city: "",
        district: "",
        addressLine: "",
        isDefault: false,
      });
      setIsAddingNew(false);
    }
  };

  const handleCancel = () => {
    setNewAddress({
      recipientName: "",
      numPhone: "",
      city: "",
      district: "",
      addressLine: "",
      isDefault: false,
    });
    setIsAddingNew(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteShippingAddress(id);
      setAddresses(addresses.filter((addr) => addr.id !== id));
    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };

  const handleSetDefault = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    );
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <h2>Quản lý sổ địa chỉ</h2>
        <button className={cx("btn-add")} onClick={() => setIsAddingNew(true)}>
          <FontAwesomeIcon icon={faPlus} />
          Thêm địa chỉ mới
        </button>
      </div>

      {isAddingNew && (
        <div className={cx("form-container")}>
          <h3>Thêm địa chỉ mới</h3>
          <form onSubmit={handleAddAddress}>
            <div className={cx("form-row")}>
              <div className={cx("form-group")}>
                <label>Tên người nhận</label>
                <input
                  type="text"
                  name="recipientName"
                  value={newAddress.recipientName}
                  onChange={handleInputChange}
                  placeholder="Nhập tên người nhận"
                  required
                />
              </div>

              <div className={cx("form-group")}>
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="numPhone"
                  value={newAddress.numPhone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
            </div>

            <div className={cx("form-group")}>
              <label>Chọn Tỉnh/Thành phố</label>
              <select
                name="city"
                value={newAddress.city}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Chọn Tỉnh/Thành phố --</option>
                {cities.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            <div className={cx("form-group")}>
              <label>Chọn Quận/Huyện</label>
              <select
                name="district"
                value={newAddress.district}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Chọn Quận/Huyện --</option>
                {districts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <div className={cx("form-group")}>
              <label>Nhập địa chỉ cụ thể</label>
              <input
                type="text"
                name="addressLine"
                value={newAddress.addressLine}
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
                  checked={newAddress.isDefault}
                  onChange={handleInputChange}
                />
                <span className={cx("toggle-bg")}></span>
              </label>
              <span>Đặt làm địa chỉ mặc định</span>
            </div>

            <div className={cx("form-actions")}>
              <button type="submit" className={cx("btn-submit")}>
                Lưu địa chỉ
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

      <div className={cx("addresses-list", { hidden: isAddingNew })}>
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
                <button className={cx("btn-edit")}>
                  <FontAwesomeIcon icon={faEdit} />
                  Sửa
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
