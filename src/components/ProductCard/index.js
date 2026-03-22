import classNames from "classnames/bind";
import styles from "./ProductCard.module.scss";
import React from "react";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function ProductCard({ data }) {
  const hasDiscount = data.percentDiscount > 0;
  const discountedPrice = hasDiscount
    ? data.price * (1 - data.percentDiscount / 100)
    : data.price;

  return (
    <div className={cx("wrapper")}>
      {hasDiscount && (
        <div className={cx("discount-tag")}>-{data.percentDiscount}%</div>
      )}

      <Link to={`/product/${data.id}`} className={cx("link")}>
        <img className={cx("image")} alt="Hinh mo ta" src={data.urlImages[0]} />
      </Link>

      <div className={cx("context")}>
        <Link to={`/product/${data.id}`} className={cx("link")}>
          <p className={cx("name")}>{data.name}</p>
        </Link>
        <p className={cx("manufacture")}>
          Thương hiệu: {data.manufacturer?.name ?? "undefined"}
        </p>
      </div>

      <div className={cx("detail")}>
        <div className={cx("price-group")}>
          <div
            className={cx("old-price")}
            style={{ visibility: hasDiscount ? "visible" : "hidden" }}
          >
            {data.price.toLocaleString("vi-VN")} ₫
          </div>
          <div className={cx("price")}>
            {discountedPrice.toLocaleString("vi-VN")} ₫
          </div>
        </div>
        <div className={cx("purchase-count")}>Đã bán {data.purchaseCount}</div>
      </div>
    </div>
  );
}

export default React.memo(ProductCard);
