import classNames from "classnames/bind";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

import styles from "./ProductDetail.module.scss";
import { getProduct, getProductById } from "../../services/productService";
import Button from "../../components/Button";
import CardContent from "../../layouts/components/CardContent";
import { addProductToCart } from "../../services/cartService";
import Loading from "../../components/Loading";

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
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [stock, setStock] = useState(0);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await getProductById(id);
        console.log(response);

        if (!response) return;
        setProductDetail(response);
        setSelectedImageIndex(0);
        setPurchaseQuantity(1);
        response?.percentDiscount > 0
          ? setHasDiscount(true)
          : setHasDiscount(false);
        response?.percentDiscount > 0
          ? setDiscountedPrice(
              response?.price * (1 - response?.percentDiscount / 100),
            )
          : setDiscountedPrice(response?.price);
        setStock(response?.quantity - response?.purchaseCount);
        response?.quantity - response?.purchaseCount > 0
          ? setStatus(true)
          : setStatus(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductDetail();
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
          (item) => item.categories?.name === productDetail?.categories?.name,
        );

        const products = filtered.filter(
          (item) => item.id !== productDetail.id,
        );

        setOtherProducts(products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherProducts();
  }, [productDetail]);

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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMagnifierPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const formatDescription = (text) => {
    if (!text) return <p>Thông tin đang được cập nhật...</p>;

    return text
      .split(/[.:?!]/)
      .filter((sentence) => sentence.trim() !== "")
      .map((sentence, index) => <p key={index}>{sentence}</p>);
  };

  const emitCartUpdate = () => {
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleAddToCart = async (id) => {
    try {
      for (let i = 0; i < purchaseQuantity; i++) {
        await addProductToCart(id);
      }
      console.log("Đã thêm sản phẩm vào giỏ", id);
      emitCartUpdate();
    } catch (error) {
      console.warn("Thêm vào giỏ thất bại:", error.message);
    }
  };

  const handleBuyNow = () => {
    const product = {
      id: productDetail.id,
      name: productDetail.name,
      price: productDetail.price,
      percentDiscount: productDetail.percentDiscount || 0,
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
                  <img
                    src={mainImage}
                    alt="Magnified"
                    style={{
                      transform: "scale(3)",
                      transformOrigin: `${magnifierPosition.x}px ${magnifierPosition.y}px`,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
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
                      -{productDetail?.percentDiscount}%
                    </div>
                  )}
                </div>
                <div className={cx("product-price")}>
                  {discountedPrice.toLocaleString("vi-VN")} ₫
                </div>
              </div>
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
                      readOnly
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
                    onClick={() => handleAddToCart(productDetail?.id)}
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
            {loading ? (
              <Loading />
            ) : otherProducts.length > 0 ? (
              <CardContent
                slide
                title={"Sản phẩm khác"}
                products={otherProducts}
              />
            ) : (
              "Khong con san pham"
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
