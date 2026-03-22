import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames/bind";

import styles from "./ProductItem.module.scss";

const cx = classNames.bind(styles);
function ProductItem({ data }) {
  const hasDiscount = data.percentDiscount > 0;
  const discountedPrice = hasDiscount
    ? data.price * (1 - data.percentDiscount / 100)
    : data.price;
  return (
    <Link to={`/product/${data.id}`} className={cx("wrapper")}>
      <img
        className={cx("product-image")}
        src={data.urlImages?.[0] || data.image}
        alt={data.id}
      />
      <div className={cx("product-info")}>
        <p className={cx("product-name")}>{data.name}</p>
        <div className={cx("price-group")}>
          <div className={cx("price-discount-tag")}>
            <div
              className={cx("old-price")}
              style={{
                visibility: hasDiscount ? "visible" : "hidden",
              }}
            >
              {data.price.toLocaleString("vi-VN")} ₫
            </div>
            {hasDiscount && (
              <div className={cx("discount-tag")}>-{data.percentDiscount}%</div>
            )}
          </div>
          <div className={cx("price")}>
            {discountedPrice.toLocaleString("vi-VN")} ₫
          </div>
        </div>
      </div>
    </Link>
  );
}

ProductItem.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ProductItem;
