import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleRight,
  faAngleUp,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./Cart.module.scss";
import emptyCartImage from "../../assets/images/empty-cart.png";
import {
  getCart,
  addProductToCart,
  decreaseProductFormCart,
  removeProductFromCart,
} from "../../services/cartService";
import { getProduct } from "../../services/productService";
import Loading from "../../components/Loading";

const cx = classNames.bind(styles);

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isShow, setIsShow] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState(null); // id đang thực hiện action

  const fetchCart = useCallback(async () => {
    try {
      const [cartRes, productsRes] = await Promise.all([
        getCart(),
        getProduct(),
      ]);

      if (!cartRes?.success || !cartRes?.data?.items) {
        return setCartItems([]);
      }

      // Chuẩn hóa danh sách sản phẩm về array
      const productList = Array.isArray(productsRes)
        ? productsRes
        : Array.isArray(productsRes?.data)
          ? productsRes.data
          : [];

      // items = { productId: quantity, ... }
      const entries = Object.entries(cartRes.data.items);

      const itemsWithDetail = entries.map(([productId, quantity]) => {
        const product = productList.find((p) => p.id === productId);
        return {
          id: productId,
          quantity,
          name: product?.name || "",
          price: product?.price || 0,
          image: product?.urlImages?.[0] || "",
          percentDiscount: product?.percentDiscount || 0,
        };
      });

      setCartItems(itemsWithDetail);
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const emitCartUpdate = () => {
    window.dispatchEvent(new Event("cart-updated"));
  };

  // Select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(new Set(cartItems.map((item) => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  // Tăng số lượng
  const handleIncrease = async (id) => {
    setLoadingItemId(id);
    try {
      const res = await addProductToCart(id);
      if (res?.success) await fetchCart();
    } catch (error) {
      console.error("Lỗi tăng số lượng:", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  // Giảm số lượng
  const handleDecrease = async (id) => {
    setLoadingItemId(id);
    try {
      const res = await decreaseProductFormCart(id);
      if (res?.success) await fetchCart();
    } catch (error) {
      console.error("Lỗi giảm số lượng:", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  // Xóa 1 sản phẩm
  const handleDeleteItem = async (id) => {
    setLoadingItemId(id);
    try {
      const res = await removeProductFromCart(id);
      if (res?.success) {
        await fetchCart();
        const newSelected = new Set(selectedItems);
        newSelected.delete(id);
        setSelectedItems(newSelected);
        emitCartUpdate();
      }
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  // Xóa các sản phẩm đã chọn
  const handleDeleteSelected = async () => {
    console.log(selectedItems);

    try {
      for (const id of selectedItems) {
        await removeProductFromCart(id);
      }
      await fetchCart();
      setSelectedItems(new Set());
      emitCartUpdate();
    } catch (error) {
      console.error("Lỗi xóa nhiều sản phẩm:", error);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems.has(item.id)) {
        return (
          total +
          (item.price * (1 - item.percentDiscount / 100) || 0) * item.quantity
        );
      }
      return total;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal;

  if (isLoading) {
    return <Loading />;
  }

  if (cartItems.length === 0) {
    return (
      <div className={cx("emptyContainer")}>
        <img
          src={emptyCartImage}
          alt="Empty Cart"
          className={cx("emptyImage")}
        />
        <p className={cx("emptyText")}>Chưa có sản phẩm nào</p>
        <p className={cx("emptySubtext")}>Hãy khám phá để mua sắm thêm</p>
        <Link to="/">
          <button className={cx("emptyButton")}>Khám phá ngay</button>
        </Link>
      </div>
    );
  }

  const handlePay = () => {
    // Lưu các sản phẩm đã chọn vào localStorage để trang Payment có thể truy xuất
    const selectedProducts = cartItems.filter((item) =>
      selectedItems.has(item.id),
    );
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <Link to={"/"}>TRANG CHỦ</Link>

        <FontAwesomeIcon icon={faAngleRight} />
        {"GIỎ HÀNG"}
      </div>
      <div className={cx("container")}>
        <div className={cx("cart-content")}>
          <div className={cx("items")}>
            {/* Header */}
            <div className={cx("cart-item")}>
              <input
                type="checkbox"
                className={cx("check-box")}
                checked={
                  selectedItems.size === cartItems.length &&
                  cartItems.length > 0
                }
                onChange={handleSelectAll}
              />
              <div style={{ flex: 1, fontWeight: 700 }}>SẢN PHẨM</div>
              {selectedItems.size > 0 && (
                <button
                  className={cx("delete-button")}
                  onClick={handleDeleteSelected}
                  title="Xóa các mục đã chọn"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>

            {/* Cart items */}
            {cartItems.map((item) => (
              <div key={item.id} className={cx("cart-item")}>
                <input
                  type="checkbox"
                  className={cx("check-box")}
                  checked={selectedItems.has(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                />
                <div className={cx("item-info")}>
                  <img
                    src={item.image || item.urlImages?.[0]}
                    alt={item.name}
                    className={cx("item-image")}
                  />
                  <div className={cx("item-details")}>
                    <p className={cx("item-name")}>{item.name}</p>
                    <div className={cx("item-price")}>
                      <div className={cx("price-discount-tag")}>
                        <div
                          className={cx("old-price")}
                          style={{
                            visibility:
                              item.percentDiscount > 0 ? "visible" : "hidden",
                          }}
                        >
                          {item.price.toLocaleString("vi-VN")} ₫
                        </div>
                        {item.percentDiscount > 0 && (
                          <div className={cx("discount-tag")}>
                            -{item.percentDiscount}%
                          </div>
                        )}
                      </div>
                      <div className={cx("product-price")}>
                        {(
                          item.price *
                          (1 - item.percentDiscount / 100)
                        ).toLocaleString("vi-VN")}{" "}
                        ₫
                      </div>
                    </div>
                  </div>
                </div>
                <div className={cx("item-actions")}>
                  <div className={cx("quantity-control")}>
                    <button
                      onClick={() => handleDecrease(item.id)}
                      disabled={item.quantity <= 1 || loadingItemId === item.id}
                    >
                      −
                    </button>
                    <input type="number" value={item.quantity} readOnly />
                    <button
                      onClick={() => handleIncrease(item.id)}
                      disabled={loadingItemId === item.id}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={cx("delete-button")}
                    onClick={() => handleDeleteItem(item.id)}
                    disabled={loadingItemId === item.id}
                    title="Xoá sản phẩm"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className={cx("summary")}>
          <h3 className={cx("summary-title")}>
            Giỏ hàng ({selectedItems.size})
          </h3>
          <div className={cx("summary-row-detail", { show: isShow })}>
            <div className={cx("summary-row")}>
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className={cx("summary-row")}>
              <span>Phí vận chuyển</span>
              <span>0 ₫</span>
            </div>
          </div>
          <div className={cx("summary-row", "total")}>
            <span>Tổng tiền</span>
            <div className={cx("total-actions")}>
              <span>{total.toLocaleString("vi-VN")} ₫</span>
              <button
                className={cx("actions")}
                onClick={() => setIsShow((p) => !p)}
              >
                <FontAwesomeIcon icon={isShow ? faAngleDown : faAngleUp} />
              </button>
            </div>
          </div>
          <Link to={"/payment"}>
            <button
              className={cx("checkout-button")}
              disabled={selectedItems.size === 0}
              onClick={handlePay}
            >
              Thanh Toán ({selectedItems.size})
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
