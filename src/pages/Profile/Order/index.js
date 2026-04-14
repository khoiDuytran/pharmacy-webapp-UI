import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

import styles from "./Order.module.scss";
import { getProduct } from "../../../services/productService";
import {
  getMyOrders,
  cancelOrder,
  returnOrder,
} from "../../../services/orderService";
import Loading from "../../../components/Loading";

const cx = classNames.bind(styles);

const STATUS = {
  ALL: "all",
  PENDING: 0,
  CONFIRMED: 1,
  SHIPPING: 2,
  DELIVERED: 3,
  CANCELLED: 4,
  RETURNED: 5,
};

const TABS = [
  { label: "Tất cả", value: STATUS.ALL },
  { label: "Chờ xác nhận", value: STATUS.PENDING },
  { label: "Chờ giao", value: STATUS.CONFIRMED },
  { label: "Đang giao", value: STATUS.SHIPPING },
  { label: "Đã giao", value: STATUS.DELIVERED },
  { label: "Trả hàng", value: STATUS.RETURNED },
  { label: "Đã hủy", value: STATUS.CANCELLED },
];

const STATUS_LABEL = {
  0: "Chờ xác nhận",
  1: "Chờ giao",
  2: "Đang giao",
  3: "Đã giao",
  4: "Đã hủy",
  5: "Trả hàng",
};

const STATUS_STYLE = {
  0: "badge-pending",
  1: "badge-confirmed",
  2: "badge-shipping",
  3: "badge-delivered",
  4: "badge-cancelled",
  5: "badge-returned",
};

const EMPTY_IMG =
  "https://cdnv2.tgdd.vn/mwg-static/common/Banner/05/9e/059e7c7aaa76d6d7b9918ec82c533c77.png";

const PAYMENT_LABEL = { 1: "Thanh toán khi nhận hàng", 2: "VNPay" };

const PREVIEW_COUNT = 2; // số sản phẩm hiển thị mặc định

function Order() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState(STATUS.ALL);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  // Set chứa id các order đang expand
  const [expanded, setExpanded] = useState(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          getMyOrders(),
          getProduct(),
        ]);

        const productList = Array.isArray(productsRes)
          ? productsRes
          : productsRes?.data || [];

        const enriched = (Array.isArray(ordersRes) ? ordersRes : []).map(
          (order) => {
            const productEntries = order.products
              ? Object.entries(order.products).map(([productId, qty]) => {
                  const detail = productList.find((p) => p.id === productId);
                  return {
                    id: productId,
                    quantity: qty,
                    name: detail?.name || "Sản phẩm",
                    price: detail?.price || 0,
                    percentDiscount: detail?.percentDiscount || 0,
                    image: detail?.urlImages?.[0] || detail?.image || "",
                  };
                })
              : [];
            return { ...order, productDetails: productEntries };
          },
        );

        // Lọc bỏ đơn VNPay chưa thanh toán (tránh hiển thị đơn treo)
        const filteredOrders = enriched.filter(
          (o) =>
            !(
              o.paymentMethod === 2 &&
              (o.paymentStatus === 0 || o.paymentStatus === 2)
            ),
        );

        setOrders([...filteredOrders].reverse());
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filtered =
    activeTab === STATUS.ALL
      ? orders
      : orders.filter((o) => o.oderStatus === activeTab);

  const countByStatus = (value) => {
    if (value === STATUS.ALL) return orders.length;
    return orders.filter((o) => o.oderStatus === value).length;
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    setActionId(id);
    try {
      await cancelOrder(id);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, oderStatus: STATUS.CANCELLED } : o,
        ),
      );
    } catch (e) {
      alert("Hủy đơn thất bại, vui lòng thử lại.");
    } finally {
      setActionId(null);
    }
  };

  const handleReturn = async (id) => {
    if (!window.confirm("Bạn có chắc muốn trả hàng?")) return;
    setActionId(id);
    try {
      await returnOrder(id, STATUS.RETURNED);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, oderStatus: STATUS.RETURNED } : o,
        ),
      );
    } catch (e) {
      alert("Yêu cầu trả hàng thất bại, vui lòng thử lại.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className={cx("wrapper")}>
      {/* Tabs */}
      <div className={cx("tabs")}>
        {TABS.map((tab) => {
          const count = countByStatus(tab.value);
          return (
            <button
              key={tab.value}
              className={cx("tab", { active: activeTab === tab.value })}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
              {count > 0 && <span className={cx("tab-count")}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <div className={cx("empty")}>
          <img
            src={EMPTY_IMG}
            alt="Không có đơn hàng"
            className={cx("empty-img")}
          />
          <p>Bạn chưa có đơn hàng nào</p>
          <Link to="/" className={cx("btn-shop")}>
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className={cx("order-list")}>
          {filtered.map((order) => {
            const status = order.oderStatus;
            const canCancel =
              status === STATUS.PENDING || status === STATUS.CONFIRMED;
            const canReturn = status === STATUS.DELIVERED;
            const items = order.productDetails || [];
            const isExpanded = expanded.has(order.id);
            const hasMore = items.length > PREVIEW_COUNT;
            // Hiện 2 sản phẩm đầu, nếu expand thì hiện tất cả
            const visibleItems = isExpanded
              ? items
              : items.slice(0, PREVIEW_COUNT);

            return (
              <div key={order.id} className={cx("order-card")}>
                {/* Header */}
                <div className={cx("card-header")}>
                  <span className={cx("order-id")}>
                    Mã đơn: <strong>#{order.id?.slice(-8)}</strong>
                  </span>
                  <span className={cx("badge", STATUS_STYLE[status])}>
                    {STATUS_LABEL[status]}
                  </span>
                </div>

                {/* Địa chỉ */}
                {order.shippingAddress && (
                  <div className={cx("address")}>
                    <span className={cx("addr-label")}>Giao tới:</span>
                    <span>
                      {order.shippingAddress.recipientName} —{" "}
                      {order.shippingAddress.addressLine},{" "}
                      {order.shippingAddress.district},{" "}
                      {order.shippingAddress.city}
                    </span>
                  </div>
                )}

                {/* Sản phẩm */}
                <div className={cx("products")}>
                  {visibleItems.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      className={cx("product-row")}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className={cx("product-img")}
                      />
                      <div className={cx("product-info")}>
                        <span className={cx("product-name")}>{item.name}</span>
                        {/* <div className={cx("product-price-group")}>
                          {item.percentDiscount > 0 && (
                            <span className={cx("old-price")}>
                              {item.price.toLocaleString("vi-VN")}₫
                            </span>
                          )}
                          <span className={cx("new-price")}>
                            {(
                              item.price *
                              (1 - item.percentDiscount / 100)
                            ).toLocaleString("vi-VN")}
                            ₫
                          </span>
                          {item.percentDiscount > 0 && (
                            <span className={cx("discount-tag")}>
                              -{item.percentDiscount}%
                            </span>
                          )}
                        </div> */}
                        <span className={cx("product-qty")}>
                          Số lượng: {item.quantity}
                        </span>
                      </div>
                    </Link>
                  ))}

                  {/* Nút xem thêm / thu gọn */}
                  {hasMore && (
                    <button
                      className={cx("btn-expand")}
                      onClick={() => toggleExpand(order.id)}
                    >
                      {isExpanded
                        ? "Thu gọn ▲"
                        : `Xem thêm ${items.length - PREVIEW_COUNT} sản phẩm ▼`}
                    </button>
                  )}
                </div>

                {/* Footer */}
                <div className={cx("card-footer")}>
                  <div className={cx("footer-left")}>
                    <span className={cx("payment-method")}>
                      {"Phương thức thanh toán: "}
                      {PAYMENT_LABEL[order.paymentMethod] || "—"}
                    </span>
                    <span className={cx("order-date")}>
                      {"Ngày đặt hàng: "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                        : "—"}
                    </span>
                    <span className={cx("order-note")}>
                      {"Ghi chú: "}
                      {order.note ? <em>{order.note}</em> : "—"}
                    </span>
                  </div>
                  <div className={cx("footer-right")}>
                    <span className={cx("total")}>
                      Tổng:{" "}
                      <strong>
                        {order.totalAmount?.toLocaleString("vi-VN")}₫
                      </strong>
                    </span>
                    {canCancel && (
                      <button
                        className={cx("btn-cancel")}
                        onClick={() => handleCancel(order.id)}
                        disabled={actionId === order.id}
                      >
                        {actionId === order.id ? "Đang hủy..." : "Hủy đơn"}
                      </button>
                    )}
                    {canReturn && (
                      <button
                        className={cx("btn-return")}
                        onClick={() => handleReturn(order.id)}
                        disabled={actionId === order.id}
                      >
                        {actionId === order.id ? "Đang xử lý..." : "Trả hàng"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Order;
