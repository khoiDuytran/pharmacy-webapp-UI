import { useEffect, useState, useCallback } from "react";
import classNames from "classnames/bind";
import styles from "./HeroBanner.module.scss";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function HeroBanner({ images = [], interval = 10000 }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval, images.length]);

  if (!images.length) return null;

  return (
    <div className={cx("wrapper")}>
      {/* Slides */}
      <div className={cx("slider")}>
        {images.map((src, i) => (
          <div key={i} className={cx("slide", { active: i === current })}>
            <Link to={"/products"}>
              <img src={src} alt={`Banner ${i + 1}`} />
            </Link>
          </div>
        ))}
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className={cx("dots")}>
          {images.map((_, i) => (
            <button
              key={i}
              className={cx("dot", { active: i === current })}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HeroBanner;
