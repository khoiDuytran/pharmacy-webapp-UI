// PaymentResult/index.js
import { useLocation, useSearchParams, Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./PaymentResult.module.scss";
import { useEffect, useState } from "react";
import { updatePaymentStatus } from "../../../services/orderService";
import { removeProductFromCart } from "../../../services/cartService";

const cx = classNames.bind(styles);

function PaymentResult() {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const [billId, setBillId] = useState("");

  // COD: nhận qua navigate state
  // VNPay: BE redirect về kèm query params
  const isVnpay = searchParams.get("vnp_ResponseCode") !== null;

  const vnpaySuccess = searchParams.get("vnp_ResponseCode") === "00";
  const vnpayAmount = searchParams.get("vnp_Amount");
  const vnpayBank = searchParams.get("vnp_BankCode");
  const vnpayTxNo = searchParams.get("vnp_TransactionNo");

  // COD data từ state
  const codData = state?.data;

  const isSuccess = isVnpay ? vnpaySuccess : !!codData;

  useEffect(() => {
    if (!isVnpay || !isSuccess) return;

    // Lấy thẳng từ sessionStorage, không dùng state
    const id = sessionStorage.getItem("billId");
    if (!id) {
      console.error("Bill ID not found in sessionStorage");
      return;
    }

    setBillId(id); // chỉ để hiển thị UI

    const run = async () => {
      try {
        // Cập nhật payment status
        await updatePaymentStatus(id);
        console.log("Payment status updated for order:", id);

        // Xóa sản phẩm khỏi giỏ hàng
        const selectedProducts = JSON.parse(
          localStorage.getItem("selectedProducts") || "[]",
        );
        for (const p of selectedProducts) {
          await removeProductFromCart(p.id);
        }
        console.log("Order finalized successfully");

        // Cleanup
        localStorage.removeItem("selectedProducts");
        sessionStorage.removeItem("billId");
        window.dispatchEvent(new Event("cart-updated"));
      } catch (error) {
        console.error("Failed to finalize order:", error);
      }
    };

    run();
  }, [isVnpay, isSuccess]);

  return (
    <div className={cx("wrapper")}>
      {!isSuccess ? (
        <>
          <div className={cx("icon-fail")}>✕</div>
          <h2 className={cx("title", "fail")}>
            {isVnpay ? "Thanh toán thất bại!" : "Không có dữ liệu đơn hàng."}
          </h2>
          <Link to="/" className={cx("btn-home")}>
            Về trang chủ
          </Link>
        </>
      ) : (
        <>
          <div className={cx("icon-success")}>✓</div>
          <h2 className={cx("title")}>Đặt hàng thành công!</h2>
          <p className={cx("subtitle")}>
            Cảm ơn bạn đã mua hàng. Đơn hàng đang được xử lý.
          </p>

          <div className={cx("detail")}>
            {isVnpay ? (
              // VNPay fields
              <>
                <div className={cx("row")}>
                  <span>Mã đơn hàng</span>
                  <span>{billId ? billId.slice(-8) : "—"}</span>
                </div>
                <div className={cx("row")}>
                  <span>Mã giao dịch</span>
                  <span>{vnpayTxNo || "—"}</span>
                </div>
                <div className={cx("row")}>
                  <span>Ngân hàng</span>
                  <span>{vnpayBank || "—"}</span>
                </div>
                <div className={cx("row", "row-total")}>
                  <span>Tổng tiền</span>
                  {/* VNPay trả amount * 100 */}
                  <span>
                    {vnpayAmount
                      ? (Number(vnpayAmount) / 100).toLocaleString("vi-VN")
                      : "—"}
                    ₫
                  </span>
                </div>
                <div className={cx("row")}>
                  <span>Trạng thái</span>
                  <span>Thanh toán thành công</span>
                </div>
              </>
            ) : (
              // COD fields
              <>
                <div className={cx("row")}>
                  <span>Mã đơn hàng</span>
                  <span>{codData?.billId?.slice(-8) || "—"}</span>
                </div>
                <div className={cx("row", "row-total")}>
                  <span>Tổng tiền</span>
                  <span>{codData?.totalAmount?.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className={cx("row")}>
                  <span>Trạng thái</span>
                  <span>{codData?.paymentStatusText || "Chờ xác nhận"}</span>
                </div>
              </>
            )}
          </div>

          <div className={cx("actions")}>
            <Link to="/" className={cx("btn-home")}>
              Về trang chủ
            </Link>
            <Link to="/profile/don-hang" className={cx("btn-orders")}>
              Xem đơn hàng
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default PaymentResult;
