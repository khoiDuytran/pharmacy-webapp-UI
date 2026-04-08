import classNames from "classnames/bind";
import { useCallback, useEffect, useState } from "react";

import styles from "./SuperHotDeal.module.scss";
import { getProduct } from "../../services/productService";
import { getAllEvent } from "../../services/eventService";
import Loading from "../../components/Loading";
import CardContent from "../../layouts/components/CardContent";
import headerImage from "../../assets/images/san-pham-doc-quyen.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function SuperHotDeal() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
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

      const productDiscount = productsWithFlashSale.filter(
        (p) => p.percentDiscount > 0,
      );

      const productsArray = productDiscount.sort(
        (a, b) => b.percentDiscount - a.percentDiscount,
      );

      setLoading(true);
      setProducts(productsArray);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <Link to={"/"}>TRANG CHỦ</Link>

        <FontAwesomeIcon icon={faAngleRight} />
        {"DEAL SIÊU HOT"}
      </div>
      <div className={cx("content")}>
        <div className={cx("products-header")}>
          <img
            src={headerImage}
            alt="Super Hot Deal"
            className={cx("products-header-image")}
          />
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className={cx("products-grids")}>
            <div className={cx("products-grid")}>
              <CardContent column products={products} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuperHotDeal;
