import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faClock,
  faArrowDown,
  faArrowUp,
  faAngleRight,
  faFilter,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames/bind";

import styles from "./ProductsList.module.scss";
import ProductCard from "../../components/ProductCard";
import SidebarProducts from "../../layouts/components/Sidebar/SidebarProducts";
import { getProduct } from "../../services/productService";
import Loading from "../../components/Loading";
import { getAllEvent } from "../../services/eventService";
// import { ToastContext } from "../../contexts/ToastProvider";

const cx = classNames.bind(styles);

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("bestseller");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceFilter, setPriceFilter] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  // const { toast } = useContext(ToastContext);
  const itemsPerPage = 9;
  // Tính toán pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const location = useLocation();

  const getQueryParam = (key) => {
    const params = new URLSearchParams(location.search);
    return params.get(key);
  };

  const categorySlug = getQueryParam("category");

  const fetchProducts = useCallback(async () => {
    try {
      const [res, eventsRes] = await Promise.all([getProduct(), getAllEvent()]);

      if (!res?.success || !res?.data?.length) {
        return setProducts([]);
      }

      const flashSaleActiceArray = eventsRes.filter((f) => f.active);
      const flashSaleActice = flashSaleActiceArray[0];

      const list = Array.isArray(res)
        ? res
        : Array.isArray(res.data)
          ? res.data
          : [];
      let filteredProducts = [...list];

      if (categorySlug) {
        filteredProducts = filteredProducts.filter(
          (item) => item.categories?.slug === categorySlug,
        );
      }

      const foundCategory = list.find(
        (item) => item.categories?.slug === categorySlug,
      );
      setCategoryTitle(foundCategory?.categories?.name || "");

      let productsWithFlashSale = filteredProducts.map((product) => {
        const productId = product._id || product.id;

        const isInFlashSale =
          flashSaleActice?.productIds?.includes(productId) ?? false;

        const effectiveDiscount = product
          ? isInFlashSale
            ? Math.max(
                product.percentDiscount || 0,
                flashSaleActice.discountPercent,
              )
            : product.percentDiscount || 0
          : 0;

        return {
          id: productId,
          manufacturer: product?.manufacturer || null,
          categories: product?.categories || null,
          quantity: product?.quantity || 0,
          purchaseCount: product?.purchaseCount || 0,
          name: product?.name || "",
          price: product?.price || 0,
          urlImages: product?.urlImages || [],
          percentDiscount: effectiveDiscount,
        };
      });

      // brand filter
      if (selectedBrands && selectedBrands.length > 0) {
        productsWithFlashSale = productsWithFlashSale.filter((item) => {
          const brandName = item.manufacturer?.name || "";
          return selectedBrands.includes(brandName);
        });
      }

      // price filter
      if (priceFilter) {
        const { option, min, max } = priceFilter;
        if (option) {
          switch (option) {
            case "lt100":
              productsWithFlashSale = productsWithFlashSale.filter(
                (p) => p.price * (1 - p.percentDiscount / 100) < 100000,
              );
              break;
            case "100-300":
              productsWithFlashSale = productsWithFlashSale.filter(
                (p) =>
                  p.price * (1 - p.percentDiscount / 100) >= 100000 &&
                  p.price <= 300000,
              );
              break;
            case "300-500":
              productsWithFlashSale = productsWithFlashSale.filter(
                (p) =>
                  p.price * (1 - p.percentDiscount / 100) >= 300000 &&
                  p.price <= 500000,
              );
              break;
            case "gt500":
              productsWithFlashSale = productsWithFlashSale.filter(
                (p) => p.price * (1 - p.percentDiscount / 100) > 500000,
              );
              break;
            default:
              break;
          }
        }
        // custom range
        const minVal = parseInt(min, 10);
        const maxVal = parseInt(max, 10);
        if (!isNaN(minVal)) {
          productsWithFlashSale = productsWithFlashSale.filter(
            (p) => p.price * (1 - p.percentDiscount / 100) >= minVal,
          );
        }
        if (!isNaN(maxVal)) {
          productsWithFlashSale = productsWithFlashSale.filter(
            (p) => p.price * (1 - p.percentDiscount / 100) <= maxVal,
          );
        }
      }

      let sortedProducts = [...productsWithFlashSale];

      // Sắp xếp theo loại
      switch (sortType) {
        case "newest":
          sortedProducts = sortedProducts.reverse();
          break;
        case "price-desc":
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
        case "price-asc":
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        case "bestseller":
          sortedProducts.sort((a, b) => b.purchaseCount - a.purchaseCount);
          break;
        default:
          // giữ nguyên thứ tự
          break;
      }

      setLoading(true);
      setProducts(sortedProducts);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [sortType, selectedBrands, priceFilter, categorySlug]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const res = await getProduct();

  //     if (res) {
  //       const list = Array.isArray(res)
  //         ? res
  //         : Array.isArray(res.data)
  //           ? res.data
  //           : [];
  //       let filteredProducts = [...list];

  //       // category filter (from query param)
  //       if (categorySlug) {
  //         filteredProducts = filteredProducts.filter(
  //           (item) => item.categories?.slug === categorySlug,
  //         );
  //       }

  //       const foundCategory = list.find(
  //         (item) => item.categories?.slug === categorySlug,
  //       );
  //       setCategoryTitle(foundCategory?.categories?.name || "");

  //       // brand filter
  //       if (selectedBrands && selectedBrands.length > 0) {
  //         filteredProducts = filteredProducts.filter((item) => {
  //           const brandName = item.manufacturer?.name || "";
  //           return selectedBrands.includes(brandName);
  //         });
  //       }

  //       // price filter
  //       if (priceFilter) {
  //         const { option, min, max } = priceFilter;
  //         if (option) {
  //           switch (option) {
  //             case "lt100":
  //               filteredProducts = filteredProducts.filter(
  //                 (p) => p.price * (1 - p.percentDiscount / 100) < 100000,
  //               );
  //               break;
  //             case "100-300":
  //               filteredProducts = filteredProducts.filter(
  //                 (p) =>
  //                   p.price * (1 - p.percentDiscount / 100) >= 100000 &&
  //                   p.price <= 300000,
  //               );
  //               break;
  //             case "300-500":
  //               filteredProducts = filteredProducts.filter(
  //                 (p) =>
  //                   p.price * (1 - p.percentDiscount / 100) >= 300000 &&
  //                   p.price <= 500000,
  //               );
  //               break;
  //             case "gt500":
  //               filteredProducts = filteredProducts.filter(
  //                 (p) => p.price * (1 - p.percentDiscount / 100) > 500000,
  //               );
  //               break;
  //             default:
  //               break;
  //           }
  //         }
  //         // custom range
  //         const minVal = parseInt(min, 10);
  //         const maxVal = parseInt(max, 10);
  //         if (!isNaN(minVal)) {
  //           filteredProducts = filteredProducts.filter(
  //             (p) => p.price * (1 - p.percentDiscount / 100) >= minVal,
  //           );
  //         }
  //         if (!isNaN(maxVal)) {
  //           filteredProducts = filteredProducts.filter(
  //             (p) => p.price * (1 - p.percentDiscount / 100) <= maxVal,
  //           );
  //         }
  //       }

  //       let sortedProducts = [...filteredProducts];

  //       // Sắp xếp theo loại
  //       switch (sortType) {
  //         case "newest":
  //           sortedProducts = sortedProducts.reverse();
  //           break;
  //         case "price-desc":
  //           sortedProducts.sort((a, b) => b.price - a.price);
  //           break;
  //         case "price-asc":
  //           sortedProducts.sort((a, b) => a.price - b.price);
  //           break;
  //         case "bestseller":
  //           sortedProducts.sort((a, b) => b.purchaseCount - a.purchaseCount);
  //           break;
  //         default:
  //           // giữ nguyên thứ tự
  //           break;
  //       }

  //       setProducts(sortedProducts);
  //       setCurrentPage(1);
  //     }
  //   };

  //   fetchProducts();
  // }, [sortType, location.search, selectedBrands, priceFilter, categorySlug]);

  const handleSort = (type) => {
    setSortType(type);
  };

  const handleBrandChange = useCallback((brands) => {
    setSelectedBrands(brands);
    setCurrentPage(1);
  }, []);

  const handlePriceChange = useCallback((priceData) => {
    setPriceFilter(priceData);
    setCurrentPage(1);
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <Link to={"/"}>TRANG CHỦ</Link>

        <FontAwesomeIcon icon={faAngleRight} />
        {categoryTitle || "TẤT CẢ SẢN PHẨM"}
      </div>

      <div className={cx("wrapper")}>
        <div className={cx("sidebar")}>
          <SidebarProducts
            onBrandChange={handleBrandChange}
            onPriceChange={handlePriceChange}
          />
        </div>

        <div className={cx("main-content")}>
          <div className={cx("content-header")}>
            <h1 className={cx("title")}>
              {categoryTitle
                ? `Danh sách sản phẩm: ${categoryTitle}`
                : "Danh sách sản phẩm"}
            </h1>

            <div className={cx("advanced-filter")}>
              <button
                className={cx("advanced-filter-btn")}
                onClick={() => setShowFilter(true)}
              >
                <FontAwesomeIcon icon={faFilter} /> Bộ lọc nâng cao
              </button>
              {showFilter && (
                <div
                  className={cx("mobile-sidebar")}
                  onClick={() => setShowFilter(false)}
                >
                  <div
                    className={cx("sidebar-content")}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className={cx("close-sidebar")}
                      onClick={() => setShowFilter(false)}
                    >
                      <FontAwesomeIcon icon={faClose} /> Đóng bộ lọc
                    </button>
                    <SidebarProducts
                      onBrandChange={handleBrandChange}
                      onPriceChange={handlePriceChange}
                      onApply={() => setShowFilter(false)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className={cx("filter-buttons")}>
              <button
                className={cx("filter-btn", {
                  active: sortType === "bestseller",
                })}
                onClick={() => handleSort("bestseller")}
              >
                <FontAwesomeIcon icon={faFire} /> Bán chạy
              </button>
              <button
                className={cx("filter-btn", { active: sortType === "newest" })}
                onClick={() => handleSort("newest")}
              >
                <FontAwesomeIcon icon={faClock} /> Mới nhất
              </button>
              <button
                className={cx("filter-btn", {
                  active: sortType === "price-desc",
                })}
                onClick={() => handleSort("price-desc")}
              >
                <FontAwesomeIcon icon={faArrowDown} /> Giá giảm dần
              </button>
              <button
                className={cx("filter-btn", {
                  active: sortType === "price-asc",
                })}
                onClick={() => handleSort("price-asc")}
              >
                <FontAwesomeIcon icon={faArrowUp} /> Giá tăng dần
              </button>
            </div>
          </div>

          {loading ? (
            <div className={cx("loading-overlay")}>
              <Loading />
            </div>
          ) : currentProducts.length === 0 ? (
            <p className={cx("empty")}>Không tìm thấy sản phẩm nào.</p>
          ) : (
            <div className={cx("products-grid")}>
              {currentProducts.map((product, index) => (
                <ProductCard key={index} data={product} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className={cx("pagination")}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    className={cx("page-button", {
                      active: currentPage === pageNum,
                    })}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsList;
