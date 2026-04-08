import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";

import styles from "./Payment.module.scss";
import { getAllShippingAddresses } from "../../services/userService";
import { buyNow } from "../../services/paymentService";
import cash from "../../assets/images/paymentMethod/cash.png";
import vnpay from "../../assets/images/paymentMethod/vnpay.jpg";

const cx = classNames.bind(styles);

function Payment() {
  const navigate = useNavigate();
  const selectedProducts =
    JSON.parse(localStorage.getItem("selectedProducts")) || [];

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(1); // "cod" | "vnpay"
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        note: "",
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
          <div className={cx("modal")} onClick={(e) => e.stopPropagation()}>
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
              <Link
                to="/profile/dia-chi"
                className={cx("btn-manage-addr")}
                onClick={() => setShowAddressPicker(false)}
              >
                Quản lý địa chỉ giao hàng
              </Link>
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
