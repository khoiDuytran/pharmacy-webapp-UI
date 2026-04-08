import { useMemo, useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./SidebarProducts.module.scss";
import useDebounce from "../../../../hooks/useDebounce";
import Button from "../../../../components/Button";
import { getAllManufacturs } from "../../../../services/manufactorsService";

const cx = classNames.bind(styles);

function SidebarProducts({ onBrandChange, onPriceChange, onApply }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [allBrand, setAllBrand] = useState([]);
  const [priceOption, setPriceOption] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);

  const resetFilters = () => {
    setSelected([]);
    setPriceOption("");
    setMinPrice("");
    setMaxPrice("");
    if (onBrandChange) onBrandChange([]);
    if (onPriceChange) onPriceChange(null);
    if (onApply) onApply();
  };

  const debouncedQuery = useDebounce(query, 250);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await getAllManufacturs();

        if (!res) return;

        setAllBrand(res);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBrand();
  }, []);

  const filteredBrands = useMemo(() => {
    if (!debouncedQuery.trim()) return allBrand;
    const q = debouncedQuery.toLowerCase().trim();
    return allBrand.filter((b) => b.name.toLowerCase().includes(q));
  }, [debouncedQuery, allBrand]);

  useEffect(() => {
    setVisibleCount(5);
  }, [debouncedQuery]);

  const toggleBrand = (brand) => {
    setSelected((prev) => {
      const exists = prev.includes(brand);
      const next = exists ? prev.filter((b) => b !== brand) : [...prev, brand];
      if (onBrandChange) onBrandChange(next);
      return next;
    });
  };

  const handleClear = () => {
    setQuery("");
  };

  const handleApplyPrice = () => {
    if (onPriceChange) {
      onPriceChange({ option: priceOption, min: minPrice, max: maxPrice });
    }
    if (onApply) onApply();
  };

  const visibleBrands = filteredBrands.slice(0, visibleCount);

  const handleLoadMore = () => {
    if (visibleCount >= filteredBrands.length) {
      setVisibleCount(5);
    } else {
      setVisibleCount((v) => v + 5);
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("filter-header")}>
        <h3 className={cx("title")}>Bộ lọc</h3>
        <Button small className={cx("clear-filters")} onClick={resetFilters}>
          Thiết lập lại
        </Button>
      </div>

      <div className={cx("price-filter")}>
        <h3 className={cx("f-title")}>Khoảng giá</h3>

        <div className={cx("price-options")}>
          <label className={cx("price-item")}>
            <input
              type="radio"
              name="price"
              value="lt100"
              checked={priceOption === "lt100"}
              onChange={(e) => setPriceOption(e.target.value)}
            />
            <span> Dưới 100.000₫</span>
          </label>

          <label className={cx("price-item")}>
            <input
              type="radio"
              name="price"
              value="100-300"
              checked={priceOption === "100-300"}
              onChange={(e) => setPriceOption(e.target.value)}
            />
            <span> 100.000₫ - 300.000₫</span>
          </label>

          <label className={cx("price-item")}>
            <input
              type="radio"
              name="price"
              value="300-500"
              checked={priceOption === "300-500"}
              onChange={(e) => setPriceOption(e.target.value)}
            />
            <span> 300.000₫ - 500.000₫</span>
          </label>

          <label className={cx("price-item")}>
            <input
              type="radio"
              name="price"
              value="gt500"
              checked={priceOption === "gt500"}
              onChange={(e) => setPriceOption(e.target.value)}
            />
            <span> Trên 500.000₫</span>
          </label>

          <div className={cx("price-range")}>
            <input
              type="number"
              placeholder="Tối thiểu"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Tối đa"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className={cx("price-actions")}>
            <button className={cx("apply")} onClick={handleApplyPrice}>
              Áp dụng
            </button>
          </div>
        </div>
      </div>

      <h3 className={cx("f-title")}>Thương hiệu</h3>

      <div className={cx("search")}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập tên thương hiệu"
          spellCheck={false}
        />
        {query && (
          <button className={cx("clear")} onClick={handleClear}>
            ×
          </button>
        )}
      </div>

      <div className={cx("brands-list")}>
        {filteredBrands.length === 0 ? (
          <div className={cx("empty")}>Không tìm thấy thương hiệu</div>
        ) : (
          visibleBrands.map((brand) => (
            <label key={brand.id} className={cx("brand-item")}>
              <input
                type="checkbox"
                checked={selected.includes(brand.name)}
                onChange={() => toggleBrand(brand.name)}
              />
              <span className={cx("brand-name")}>{brand.name}</span>
            </label>
          ))
        )}

        {filteredBrands.length > 5 && (
          <div className={cx("load-more-wrap")}>
            <button className={cx("load-more")} onClick={handleLoadMore}>
              {visibleCount >= filteredBrands.length ? "Thu gọn" : "Xem thêm"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SidebarProducts;
