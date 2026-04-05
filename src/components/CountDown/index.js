import classNames from "classnames/bind";

import styles from "./CountDown.module.scss";
import { useCallback, useEffect, useState } from "react";

const cx = classNames.bind(styles);

function CountDown({ endDate, big, small, className }) {
  const calcRemaining = useCallback(() => {
    const diff = new Date(endDate) - new Date();
    if (diff <= 0) return { h: 0, m: 0, s: 0 };
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s };
  }, [endDate]);

  const [time, setTime] = useState(calcRemaining);

  useEffect(() => {
    const timer = setInterval(() => setTime(calcRemaining()), 1000);
    return () => clearInterval(timer);
  }, [calcRemaining]);

  const pad = (n) => String(n).padStart(2, "0");

  const classes = cx("wrapper", {
    small,
    big,
    [className]: className,
  });

  return (
    <div className={classes}>
      <span className={cx("time-block")}>{pad(time.h)}</span>
      <span className={cx("colon")}>:</span>
      <span className={cx("time-block")}>{pad(time.m)}</span>
      <span className={cx("colon")}>:</span>
      <span className={cx("time-block")}>{pad(time.s)}</span>
    </div>
  );
}

export default CountDown;
