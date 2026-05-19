import classNames from "classnames/bind";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

import styles from "./ProductDetail.module.scss";
import { getProduct, getProductById } from "../../services/productService";
import Button from "../../components/Button";
import CardContent from "../../layouts/components/CardContent";
import { addProductToCart } from "../../services/cartService";
import Loading from "../../components/Loading";
import { ToastContext } from "../../contexts/ToastProvider";
import CountDown from "../../components/CountDown";
import hotIcon from "../../assets/images/hot-sale-icon.png";
import { getAllEvent } from "../../services/eventService";

const cx = classNames.bind(styles);

function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState();
  const [otherProducts, setOtherProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [status, setStatus] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [stock, setStock] = useState(0);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingOther, setLoadingOther] = useState(true);
  const { toast } = useContext(ToastContext);
  const [isFSItem, setIsFSItem] = useState(false);
  // const [isFSActive, setIsFSActive] = useState(true);
  // const [isFSUpcoming, setIsFSUpcoming] = useState(false);
  const [endDate, setEndDate] = useState();
  const [startDate, setStartDate] = useState();
  const [countdownLabel, setCountdownLabel] = useState("Hết sau:");
  const [countdownTime, setCountdownTime] = useState();
  // const [isEventActive, setIsEventActive] = useState(true);
  const [eventProducts, setEventProducts] = useState([]);

  // Tối ưu zoom: tránh setState liên tục khi mousemove.
  const magnifierImgRef = useRef(null);
  const rafIdRef = useRef(null);
  const pendingOriginPercentRef = useRef({ xp: 50, yp: 50 }); // 50% center

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const scheduleMagnifierUpdate = () => {
    if (rafIdRef.current != null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const magnifierImg = magnifierImgRef.current;
      if (!magnifierImg) return;

      const { xp, yp } = pendingOriginPercentRef.current;
      // Dùng % để đồng bộ tương quan dù kích thước magnifier/ảnh hiển thị khác nhau.
      magnifierImg.style.transformOrigin = `${xp}% ${yp}%`;
    });
  };

  // Cleanup RAF khi rời trang để tránh chạy thừa khi đổi route.
  useEffect(() => {
    return () => {
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [productData, falshSaleRes] = await Promise.all([
          getProductById(id),
          getAllEvent(),
        ]);

        const flashSaleActiceArray = falshSaleRes.filter((f) => f.active);

        const flashSaleActice = flashSaleActiceArray[0];

        setEventProducts(flashSaleActice?.productIds || []);

        const productId = productData.id;

        const isInFlashSale =
          flashSaleActice?.productIds?.includes(productId) ?? false;

        let eventActive = true;

        // Kiểm tra trạng thái event
        if (flashSaleActice) {
          const now = new Date();
          const start = flashSaleActice.startDate
            ? new Date(flashSaleActice.startDate)
            : null;
          const end = flashSaleActice.endDate
            ? new Date(flashSaleActice.endDate)
            : null;

          // Xác định label và countdown time dựa trên thời gian
          if (start && now < start) {
            // Chưa bắt đầu
            setCountdownLabel("BẮT ĐẦU SAU:");
            setCountdownTime(flashSaleActice.startDate);
            eventActive = false;
          } else if (end && now < end) {
            // Đang hoạt động
            setCountdownLabel("KẾT THÚC SAU:");
            setCountdownTime(flashSaleActice.endDate);
            eventActive = true;
          } else {
            // Đã kết thúc hoặc không có time info
            setCountdownLabel("KẾT THÚC SAU:");
            setCountdownTime(flashSaleActice.endDate);
            eventActive = false;
          }
        }

        const effectiveDiscount = isInFlashSale
          ? eventActive ? Math.max(
            productData.percentDiscount || 0,
            flashSaleActice.discountPercent,
          ) : productData.percentDiscount || 0
          : productData.percentDiscount || 0;

        setProductDetail(productData);
        setIsFSItem(isInFlashSale);
        setEndDate(flashSaleActice?.endDate);
        setStartDate(flashSaleActice?.startDate || null);
        setSelectedImageIndex(0);
        setPurchaseQuantity(1);

        const hasDisc = effectiveDiscount > 0;
        setHasDiscount(hasDisc);
        setDiscountedPrice(
          hasDisc
            ? productData.price * (1 - effectiveDiscount / 100)
            : productData.price,
        );
        // Lưu lại để dùng khi mua ngay
        productData._effectiveDiscount = effectiveDiscount;

        setStock(productData.quantity - productData.purchaseCount);
        setStatus(productData.quantity - productData.purchaseCount > 0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  useEffect(() => {
    const fetchOtherProducts = async () => {
      try {
        if (!productDetail) return;

        const response = await getProduct();
        if (!response) return;

        const list = Array.isArray(response)
          ? response
          : Array.isArray(response.data)
            ? response.data
            : [];

        const res = [...list];

        const filtered = res.filter(
          (item) => !eventProducts.includes(item.id),
        );

        const products = filtered.filter(
          (item) => item.id !== productDetail.id,
        );

        const shuffled = products
          .map((item) => ({ item, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ item }) => item)
          .slice(0, 5);


        setOtherProducts(shuffled);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingOther(false);
      }
    };

    fetchOtherProducts();
  }, [productDetail, eventProducts]);

  const mainImage = productDetail?.urlImages?.[selectedImageIndex];
  const allImages = productDetail?.urlImages || [];
  const productQuantity = productDetail?.quantity || 0;

  const handleIncreaseQuantity = () => {
    if (purchaseQuantity < productQuantity) {
      setPurchaseQuantity(purchaseQuantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (purchaseQuantity > 1) {
      setPurchaseQuantity(purchaseQuantity - 1);
    }
  };

  const handleMouseMove = (e) => {
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clampedX = clamp(x, 0, rect.width);
    const clampedY = clamp(y, 0, rect.height);

    const xp = (clampedX / rect.width) * 100;
    const yp = (clampedY / rect.height) * 100;

    pendingOriginPercentRef.current = { xp, yp };
    scheduleMagnifierUpdate();
  };

  const handleMouseEnter = (e) => {
    setShowMagnifier(true);

    // Set vị trí ban đầu về tâm để tránh nhảy “từ 0,0” khi lần đầu hover.
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const xp = 50;
    const yp = 50;

    if (rect.width > 0 && rect.height > 0) {
      pendingOriginPercentRef.current = { xp, yp };
      scheduleMagnifierUpdate();
    }
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
    if (rafIdRef.current != null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  const formatDescription = (text) => {
    if (!text) return <p>Thông tin đang được cập nhật...</p>;

    return text
      .split(/[.:?!]/)
      .filter((sentence) => sentence.trim() !== "")
      .map((sentence, index) => <p key={index}>{sentence}</p>);
  };

  // Bỏ handleFormatQuantity, sửa trực tiếp onChange
  const handleQuantityInput = (e) => {
    const raw = e.target.value;

    // Cho phép trống tạm thời khi user đang xóa để gõ lại
    if (raw === "") {
      setPurchaseQuantity("");
      return;
    }

    const parsed = parseInt(raw, 10);

    // Không phải số hợp lệ → bỏ qua
    if (isNaN(parsed)) return;

    // Clamp trong khoảng [1, stock]
    const clamped = Math.min(Math.max(parsed, 1), stock);
    setPurchaseQuantity(clamped);
  };

  // Khi blur — nếu đang trống thì reset về 1
  const handleQuantityBlur = () => {
    if (purchaseQuantity === "" || purchaseQuantity < 1) {
      setPurchaseQuantity(1);
    }
  };

  const emitCartUpdate = () => {
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleAddToCart = async (id, quantity) => {
    try {
      const res = await addProductToCart(id, quantity);
      if (!res.data) return;
      console.log("Đã thêm sản phẩm vào giỏ", id);
      toast.success("Đã thêm vào giỏ hàng");
      emitCartUpdate();
    } catch (error) {
      console.warn("Thêm vào giỏ thất bại:", error.message);
      toast.error("Không thể thêm sản phẩm vào giỏ hàng");
    }
  };

  const handleBuyNow = () => {
    const product = {
      id: productDetail.id,
      name: productDetail.name,
      price: productDetail.price,
      percentDiscount:
        productDetail._effectiveDiscount ?? productDetail.percentDiscount ?? 0,
      image: productDetail.urlImages?.[0] || "",
      quantity: purchaseQuantity,
    };

    localStorage.setItem("selectedProducts", JSON.stringify([product]));
    navigate("/payment");
  };

  return (
    <div className={cx("wrapper")}>
      {productDetail ? (
        <>
          <div className={cx("header")}>
            <Link to={"/"}>TRANG CHỦ</Link>
            <FontAwesomeIcon icon={faAngleRight} />
            <Link to={`/products?category=${productDetail?.categories.slug}`}>
              {productDetail?.categories.name}
            </Link>
            <FontAwesomeIcon icon={faAngleRight} />
            <span>{productDetail?.name}</span>
          </div>
          <div className={cx("product-box")}>
            <div className={cx("product-detail")}>
              <div className={cx("product-image")}>
                <img
                  src={mainImage}
                  alt={productDetail?.name || ""}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
              {showMagnifier && (
                <div className={cx("magnifier")}>
                  <img ref={magnifierImgRef} src={mainImage} alt="Magnified" />
                </div>
              )}
              <div className={cx("product-other-image")}>
                {allImages.map((item, index) => (
                  <img
                    key={index}
                    src={item}
                    alt={productDetail?.name || ""}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cx({
                      active: index === selectedImageIndex,
                    })}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </div>
            </div>
            <div className={cx("product-info")}>
              <h1 className={cx("product-name")}>{productDetail?.name}</h1>
              <p className={cx("product-manufacturer")}>
                {"Thương hiệu: "}
                {productDetail?.manufacturer.name}
              </p>
              <p className={cx("product-quantity")}>
                {"Tình trạng: "}
                <span className={cx("status-text", { inStock: status })}>
                  {status ? "Còn hàng" : "Hết hàng"}
                </span>
              </p>
              <p className={cx("product-available")}>
                Số lượng có sẵn: {stock}
              </p>

              {isFSItem ? (
                <div className={cx("fs-price-group")}>
                  <div className={cx("hot-sale")}>
                    <div className={cx("hot-sale-left")}>
                      <div className={cx("hot-sale-icon")}>
                        <img src={hotIcon} alt="hot-sale" />
                      </div>
                      <div className={cx("hot-sale-title")}>FLASH SALE {countdownLabel}</div>
                    </div>
                    <div className={cx("hot-sale-right")}>
                      {/* <div className={cx("countdown-label")}>
                        {countdownLabel}
                      </div> */}
                      <CountDown small endDate={countdownTime} />
                    </div>
                  </div>

                  <div className={cx("price-group")}>
                    <div className={cx("price-discount-tag")}>
                      <div
                        className={cx("old-price")}
                        style={{
                          visibility: hasDiscount ? "visible" : "hidden",
                        }}
                      >
                        {productDetail?.price.toLocaleString("vi-VN")} ₫
                      </div>
                      {hasDiscount && (
                        <div className={cx("discount-tag")}>
                          -
                          {productDetail._effectiveDiscount ??
                            productDetail.percentDiscount}
                          %
                        </div>
                      )}
                    </div>
                    <div className={cx("product-price")}>
                      {discountedPrice.toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                </div>
              ) : (
                <div className={cx("price-group")}>
                  <div className={cx("price-discount-tag")}>
                    <div
                      className={cx("old-price")}
                      style={{ visibility: hasDiscount ? "visible" : "hidden" }}
                    >
                      {productDetail?.price.toLocaleString("vi-VN")} ₫
                    </div>
                    {hasDiscount && (
                      <div className={cx("discount-tag")}>
                        -
                        {productDetail._effectiveDiscount ??
                          productDetail.percentDiscount}
                        %
                      </div>
                    )}
                  </div>

                  <div className={cx("product-price")}>
                    {discountedPrice.toLocaleString("vi-VN")} ₫
                  </div>
                </div>
              )}

              {status ? (
                <div className={cx("quantity-section")}>
                  <div className={cx("quantity-adjuster")}>
                    <button
                      className={cx("quantity-btn", "decrease")}
                      onClick={handleDecreaseQuantity}
                      disabled={purchaseQuantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className={cx("quantity-input")}
                      value={purchaseQuantity}
                      onChange={handleQuantityInput}
                      onBlur={handleQuantityBlur}
                      min={1}
                      max={stock}
                    />
                    <button
                      className={cx("quantity-btn", "increase")}
                      onClick={handleIncreaseQuantity}
                      disabled={purchaseQuantity >= productQuantity}
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : null}
              {status ? (
                <div className={cx("product-actions")}>
                  <Button
                    medium
                    className={cx("action-btn")}
                    onClick={() =>
                      handleAddToCart(
                        productDetail?.id,
                        Number(purchaseQuantity) || 1,
                      )
                    }
                  >
                    THÊM VÀO GIỎ HÀNG
                  </Button>
                  <Button
                    medium
                    className={cx("action-btn")}
                    onClick={handleBuyNow}
                  >
                    MUA NGAY
                  </Button>
                </div>
              ) : (
                <div className={cx("product-actions")}>
                  <Button medium disable className={cx("action-btn")}>
                    HẾT HÀNG
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className={cx("description-box")}>
            <div className={cx("description-header")}>
              <div className={cx("description-title")}>THÔNG TIN MÔ TẢ</div>
            </div>
            <div className={cx("description-content")}>
              {formatDescription(productDetail?.description)}
            </div>
          </div>

          <div className={cx("other-product-box")}>
            {loadingOther || loading ? (
              <Loading />
            ) : otherProducts.length > 0 ? (
              <CardContent
                slide
                title={"Sản phẩm khác"}
                products={otherProducts}
              />
            ) : (
              "Không có sản phẩm khác"
            )}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default ProductDetail;
