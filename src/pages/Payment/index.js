import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";

import styles from "./Payment.module.scss";
import { getAllShippingAddresses } from "../../services/userService";
import { buyNow } from "../../services/paymentService";
import cash from "../../assets/images/paymentMethod/cash.png";
import vnpay from "../../assets/images/paymentMethod/vnpay.jpg";
import { ToastContext } from "../../contexts/ToastProvider";
import { addShippingAddress } from "../../services/userService";
import useDebounce from "../../hooks/useDebounce";

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

function Payment() {
  const navigate = useNavigate();
  const selectedProducts =
    JSON.parse(localStorage.getItem("selectedProducts")) || [];

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(1); // "cod" | "vnpay"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [note, setNote] = useState("");
  const [fieldWarnings, setFieldWarnings] = useState({
    recipientName: "",
    numPhone: "",
  });
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formMode, setFormMode] = useState(null);
  const { toast } = useContext(ToastContext);

  // Load danh sách địa chỉ
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllShippingAddresses();
        const list = res || [];
        setAddresses(list);
        // Chọn địa chỉ mặc định
        const defaultAddr = list.find((a) => a.isDefault) || list[0] || null;
        setSelectedAddress(defaultAddr);
      } catch (e) {
        console.error("Failed to load addresses", e);
      }
    };
    load();
  }, []);

  const debouncedName = useDebounce(formData.recipientName, 100);
  const debouncedPhone = useDebounce(formData.numPhone, 100);

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
    setFormMode("add");
  };

  const handleCancel = () => {
    setFormMode(null);
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
      }
      handleCancel();
    } catch (err) {
      console.error("Error saving address", err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // Tính tiền
  const calcPrice = (product) =>
    product.price * (1 - (product.percentDiscount || 0) / 100);

  const subtotal = selectedProducts.reduce(
    (sum, p) => sum + calcPrice(p) * p.quantity,
    0,
  );
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  // Đặt hàng
  const handleOrder = async () => {
    if (!selectedAddress) {
      alert("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }
    setIsSubmitting(true);
    try {
      // products: { [productId]: quantity }
      const products = {};
      selectedProducts.forEach((p) => {
        products[p.id] = p.quantity;
      });

      const payload = {
        products,
        shippingAddressId: selectedAddress.id,
        paymentMethod, // 1 = COD, 2 = VNPay
        note: note.trim(),
      };

      const res = await buyNow(payload);
      if (paymentMethod === 2 && res?.paymentUrl) {
        sessionStorage.setItem("billId", res.billId);
        window.location.href = res.paymentUrl;
      } else if (paymentMethod === 1) {
        localStorage.removeItem("selectedProducts");
        navigate("/payment/result", { state: { data: res, paymentMethod } });
      } else {
        localStorage.removeItem("selectedProducts");
        navigate("/");
      }
    } catch (e) {
      console.error("Order failed", e);
      alert("Đặt hàng thất bại, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddressPicker(false);
    setFormMode(null);
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <Link to="/">TRANG CHỦ</Link>
        <FontAwesomeIcon icon={faAngleRight} />
        <Link to="/cart">GIỎ HÀNG</Link>
        <FontAwesomeIcon icon={faAngleRight} />
        HOÀN TẤT THANH TOÁN
      </div>

      <div className={cx("container")}>
        <div className={cx("products")}>
          <div className={cx("products-header")}>
            <span className={cx("col-product")}>Sản phẩm</span>
            <span className={cx("col-price")}>Đơn giá</span>
            <span className={cx("col-qty")}>Số lượng</span>
            <span className={cx("col-total")}>Thành tiền</span>
          </div>

          {selectedProducts.length === 0 ? (
            <p className={cx("empty")}>Không có sản phẩm nào được chọn.</p>
          ) : (
            selectedProducts.map((product) => (
              <div key={product.id} className={cx("product-row")}>
                <div className={cx("col-product")}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={cx("product-img")}
                  />
                  <span className={cx("product-name")}>{product.name}</span>
                </div>

                <div className={cx("col-price")}>
                  {product.percentDiscount > 0 && (
                    <span className={cx("old-price")}>
                      {product.price.toLocaleString("vi-VN")}₫
                    </span>
                  )}
                  <div className={cx("price-row")}>
                    <span className={cx("new-price")}>
                      {calcPrice(product).toLocaleString("vi-VN")}₫
                    </span>
                    {product.percentDiscount > 0 && (
                      <span className={cx("discount-tag")}>
                        -{product.percentDiscount}%
                      </span>
                    )}
                  </div>
                </div>

                <div className={cx("col-qty")}>{product.quantity}</div>

                <div className={cx("col-total")}>
                  {(calcPrice(product) * product.quantity).toLocaleString(
                    "vi-VN",
                  )}
                  ₫
                </div>
              </div>
            ))
          )}

          <div className={cx("note")}>
            <div className={cx("note-title")}>Ghi chú:</div>
            <textarea
              placeholder="Nhập ghi chú cho đơn hàng (tùy chọn)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Tổng tiền */}
          <div className={cx("summary")}>
            <div className={cx("summary-row")}>
              <span>Tổng tiền hàng</span>
              <span>{subtotal.toLocaleString("vi-VN")}₫</span>
            </div>
            <div className={cx("summary-row")}>
              <span>Phí vận chuyển</span>
              <span>0₫</span>
            </div>
            <div className={cx("summary-row", "summary-total")}>
              <span>Tổng thanh toán</span>
              <span className={cx("total-amount")}>
                {total.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>
        </div>

        <div className={cx("bill-detail")}>
          {/* Địa chỉ giao hàng */}
          <div className={cx("section")}>
            <div className={cx("section-title")}>
              <FontAwesomeIcon
                icon={faLocationDot}
                className={cx("location-icon")}
              />
              Địa Chỉ Nhận Hàng
            </div>

            {selectedAddress ? (
              <div className={cx("selected-address")}>
                <div className={cx("address-info")}>
                  <span className={cx("addr-name")}>
                    {selectedAddress.recipientName}
                  </span>
                  <span className={cx("addr-phone")}>
                    {selectedAddress.numPhone}
                  </span>
                  <span className={cx("addr-line")}>
                    {selectedAddress.addressLine}, {selectedAddress.district},{" "}
                    {selectedAddress.city}
                  </span>
                  {selectedAddress.isDefault && (
                    <span className={cx("badge-default")}>Mặc định</span>
                  )}
                </div>
                <button
                  className={cx("btn-change")}
                  onClick={() => setShowAddressPicker(true)}
                >
                  Thay Đổi
                </button>
              </div>
            ) : (
              <div className={cx("no-address")}>
                <span>Chưa có địa chỉ giao hàng</span>
                <button
                  className={cx("btn-change")}
                  onClick={() => setShowAddressPicker(true)}
                >
                  Chọn địa chỉ
                </button>
              </div>
            )}
          </div>

          {/* Phương thức thanh toán */}
          <div className={cx("section")}>
            <div className={cx("section-title")}>Phương Thức Thanh Toán</div>
            <div className={cx("payment-methods")}>
              <label
                className={cx("method-option", {
                  active: paymentMethod === 1,
                })}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 1}
                  onChange={() => setPaymentMethod(1)}
                />
                <img src={cash} alt="COD" className={cx("method-icon")} />
                <span>Thanh toán khi nhận hàng</span>
              </label>

              <label
                className={cx("method-option", {
                  active: paymentMethod === 2,
                })}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="vnpay"
                  checked={paymentMethod === 2}
                  onChange={() => setPaymentMethod(2)}
                />
                <img src={vnpay} alt="VNPay" className={cx("method-icon")} />
                <span>VNPay QR</span>
              </label>
            </div>
            {paymentMethod === 1 && (
              <p className={cx("method-note")}>Phí thu hộ: ₫0.</p>
            )}
          </div>

          {/* Nút đặt hàng */}
          <div className={cx("order-action")}>
            <button
              className={cx("btn-order")}
              onClick={handleOrder}
              disabled={isSubmitting || selectedProducts.length === 0}
            >
              {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal chọn địa chỉ */}
      {showAddressPicker && (
        <div
          className={cx("modal-overlay")}
          onClick={() => setShowAddressPicker(false)}
        >
          {formMode && (
            <div
              className={cx("form-container")}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <div className={cx("form-header")}>
                  <span>Thêm địa chỉ mới</span>
                  <button onClick={() => handleCloseModal()}>✕</button>
                </div>
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
                      className={cx({
                        "input-error": !!fieldWarnings.numPhone,
                      })}
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

                <div className={cx("form-actions")}>
                  <button
                    type="submit"
                    className={cx("btn-submit")}
                    disabled={hasWarnings}
                  >
                    {"Lưu địa chỉ"}
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

          <div
            className={cx("modal", { hidden: !!formMode })}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={cx("modal-header")}>
              <span>Địa Chỉ Của Tôi</span>
              <button onClick={() => setShowAddressPicker(false)}>✕</button>
            </div>

            <div className={cx("modal-body")}>
              {addresses.length === 0 ? (
                <p className={cx("no-addr-msg")}>Chưa có địa chỉ nào.</p>
              ) : (
                addresses.map((addr) => (
                  <label key={addr.id} className={cx("addr-option")}>
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress?.id === addr.id}
                      onChange={() => setSelectedAddress(addr)}
                    />
                    <div className={cx("addr-option-info")}>
                      <div className={cx("addr-option-top")}>
                        <span className={cx("addr-name")}>
                          {addr.recipientName}
                        </span>
                        <span className={cx("addr-phone")}>
                          {addr.numPhone}
                        </span>
                        {addr.isDefault && (
                          <span className={cx("badge-default")}>Mặc định</span>
                        )}
                      </div>
                      <div className={cx("addr-option-line")}>
                        {addr.addressLine}, {addr.district}, {addr.city}
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>

            <div className={cx("modal-footer")}>
              <button className={cx("btn-manage-addr")} onClick={openAddForm}>
                Thêm địa chỉ mới
              </button>
              {/* <Link
                to="/profile/dia-chi"
                className={cx("btn-manage-addr")}
                onClick={() => setShowAddressPicker(false)}
              >
                Quản lý địa chỉ giao hàng
              </Link> */}
              <button
                className={cx("btn-confirm")}
                onClick={() => setShowAddressPicker(false)}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payment;
