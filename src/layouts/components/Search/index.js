import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
import HeadlessTippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";
import {
  faCircleXmark,
  faMagnifyingGlass,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Search.module.scss";
import { Wrapper as PopperWrapper } from "../../../components/Popper";
import ProductItem from "../../../components/ProductItem";
import { useDebounce } from "../../../hooks";
import search from "../../../services/searchService";
import { useLocation } from "react-router-dom";

const cx = classNames.bind(styles);

function Search() {
  const searchRef = useRef();
  const [searchValue, setSearchValue] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceValue = useDebounce(searchValue, 700);
  const location = useLocation();

  // Clear search khi navigate sang trang mới
  useEffect(() => {
    // setSearchValue("");
    // setSearchResult([]);
    setShowResult(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!debounceValue.trim()) {
      setSearchResult([]);
      return;
    }

    const fetchApi = async () => {
      setLoading(true);
      const result = await search(debounceValue);
      console.log(result);

      setSearchResult(result);
      setLoading(false);
    };

    fetchApi();
  }, [debounceValue]);

  const handleHideResult = () => {
    setShowResult(false);
  };

  const handleClear = () => {
    setSearchValue("");
    setSearchResult([]);
    searchRef.current.focus();
  };

  const handleOnChangeValue = (e) => {
    setLoading(true);
    setSearchValue(e.target.value.trimStart());
    setLoading(false);
  };

  return (
    <div>
      <HeadlessTippy
        interactive
        visible={showResult && searchResult.length > 0}
        render={(attrs) => (
          <div className={cx("search-result")} tabIndex="-1" {...attrs}>
            <PopperWrapper>
              <div className={cx("search-result-body")}>
                {searchResult.map((result) => {
                  return <ProductItem key={result.id} data={result} />;
                })}
              </div>
            </PopperWrapper>
          </div>
        )}
        onClickOutside={handleHideResult}
      >
        <div className={cx("search")}>
          <button
            className={cx("search-btn")}
            onMouseDown={(e) => e.preventDefault()}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          <input
            ref={searchRef}
            value={searchValue}
            placeholder="Tìm theo tên thuốc, bệnh,..."
            spellCheck={false}
            onChange={(e) => handleOnChangeValue(e)}
            onFocus={() => setShowResult(true)}
          />
          {!!searchValue && !loading && (
            <button className={cx("clear")} onClick={handleClear}>
              <FontAwesomeIcon icon={faCircleXmark} />
            </button>
          )}

          {loading && (
            <FontAwesomeIcon className={cx("loading")} icon={faCircleNotch} />
          )}
        </div>
      </HeadlessTippy>
    </div>
  );
}

export default Search;
