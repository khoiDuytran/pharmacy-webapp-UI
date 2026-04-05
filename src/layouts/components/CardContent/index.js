import { useEffect, useRef, useState, useMemo } from "react";
import ProductCard from "../../../components/ProductCard";
import classNames from "classnames/bind";
import styles from "./CardContent.module.scss";

const cx = classNames.bind(styles);

function CardContent({
  slide = false,
  column = false,
  topseller = false,
  flashsale = false,
  title,
  products = [],
}) {
  const listRef = useRef(null);
  const [filterType, setFilterType] = useState("most-bought"); // "search" | "most-bought" | "newest"

  const classes = cx("wrapper", {
    slide,
    column,
    topseller,
    flashsale,
  });

  useEffect(() => {
    if (!slide && !flashsale) return;

    const list = listRef.current;
    if (!list) return;

    let isScrolling = false;

    const handleWheel = (e) => {
      if (list.scrollWidth <= list.clientWidth) return;

      e.preventDefault();

      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          list.scrollLeft += e.deltaY;
          isScrolling = false;
        });

        isScrolling = true;
      }
    };

    list.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      list.removeEventListener("wheel", handleWheel);
    };
  }, [slide, flashsale]);

  // Sắp xếp sản phẩm dựa vào filter
  const sortedProducts = useMemo(() => {
    if (!topseller) return products;

    const sorted = [...products];
    switch (filterType) {
      case "most-bought":
        return sorted
          .sort((a, b) => b.purchaseCount - a.purchaseCount)
          .slice(0, 4);
      case "newest":
        return sorted.reverse().slice(0, 4);
      default:
        return sorted.slice(0, 4);
    }
  }, [products, filterType, topseller]);

  return (
    <div className={classes}>
      <div className={cx("title")}>
        <div className={cx("subtitle")}>{title}</div>
        {/* <Button outline to="/products" className={cx("see-more-btn")}>
          Xem tất cả ›
          </Button> */}
      </div>
      {topseller && (
        <div className={cx("filter-buttons")}>
          <button
            className={cx("filter-btn", {
              active: filterType === "most-bought",
            })}
            onClick={() => setFilterType("most-bought")}
          >
            Sản phẩm mua nhiều nhất
          </button>
          <button
            className={cx("filter-btn", { active: filterType === "newest" })}
            onClick={() => setFilterType("newest")}
          >
            Mới nhất
          </button>
        </div>
      )}

      <div className={cx("container")}>
        <div className={cx("list")} ref={listRef}>
          {sortedProducts.map((item) => (
            <ProductCard key={item.id} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CardContent;
