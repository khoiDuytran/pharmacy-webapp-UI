import { useEffect, useState, useCallback, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./HeroBanner.module.scss";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function HeroBanner({ images = [], interval = 10000 }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("next"); // "next" | "prev"
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (index, dir) => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setCurrent(index);
      // Reset animation flag sau khi transition kết thúc
      setTimeout(() => setAnimating(false), 500);
    },
    [animating],
  );

  const next = useCallback(() => {
    goTo((current + 1) % images.length, "next");
  }, [current, images.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + images.length) % images.length, "prev");
  }, [current, images.length, goTo]);

  // Auto play
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (images.length > 1) {
      timerRef.current = setInterval(next, interval);
    }
  }, [next, interval, images.length]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  const handlePrev = () => {
    prev();
    resetTimer();
  };
  const handleNext = () => {
    next();
    resetTimer();
  };
  const handleDot = (i) => {
    goTo(i, i > current ? "next" : "prev");
    resetTimer();
  };

  if (!images.length) return null;

  return (
    <div className={cx("wrapper")}>
      {/* Slides */}
      <div className={cx("slider")}>
        {images.map((src, i) => {
          const isActive = i === current;
          // Class animation: slide đang active, hướng vào/ra
          const slideClass = cx("slide", {
            active: isActive,
            "enter-next": isActive && direction === "next" && animating,
            "enter-prev": isActive && direction === "prev" && animating,
          });

          return (
            <div key={i} className={slideClass}>
              <Link to="/products">
                <img src={src} alt={`Banner ${i + 1}`} />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          className={cx("arrow", "arrow-prev")}
          onClick={handlePrev}
          aria-label="Previous"
        >
          &#8249;
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button
          className={cx("arrow", "arrow-next")}
          onClick={handleNext}
          aria-label="Next"
        >
          &#8250;
        </button>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className={cx("dots")}>
          {images.map((_, i) => (
            <button
              key={i}
              className={cx("dot", { active: i === current })}
              onClick={() => handleDot(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HeroBanner;
