import classNames from "classnames/bind";
import { useState, useEffect } from "react";
import styles from "./Event.module.scss";
import CardContent from "../CardContent";
import logo from "../../../assets/images/flash-sale.png";
import Countdown from "../../../components/CountDown";

const cx = classNames.bind(styles);

function Event({ eventProducts = [], activeTime, startDate }) {
  const [isActive, setIsActive] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [hasStarted, setHasStarted] = useState(true);
  const [countdownTime, setCountdownTime] = useState(activeTime);
  const [countdownLabel, setCountdownLabel] = useState("Kết thúc sau:");

  useEffect(() => {
    const checkEventTime = () => {
      const now = new Date();
      const start = startDate ? new Date(startDate) : null;
      const end = activeTime ? new Date(activeTime) : null;

      // Kiểm tra xem event đã bắt đầu chưa
      if (start) {
        const eventStarted = now >= start;
        setHasStarted(eventStarted);
        if (!eventStarted) {
          setCountdownTime(startDate);
          setCountdownLabel("Bắt đầu sau:");
        } else {
          setCountdownTime(activeTime);
          setCountdownLabel("Kết thúc sau:");
        }
      }

      // Chỉ hiện overlay khi event đã kết thúc (now >= end)
      if (start && end) {
        const started = now >= start;
        const ended = now >= end;
      
        setHasStarted(started);
        setIsActive(started && !ended);   // đang trong thời gian chạy
        setIsEnded(ended);                
      }
    };    

    checkEventTime();
  }, [activeTime, startDate]);
  // const [events, setEvents] = useState([]);
  // const [activeIdx, setActiveIdx] = useState(0);

  // useEffect(() => {
  //   getAllEvent()
  //     .then((res) => {
  //       const list = Array.isArray(res) ? res : [];
  //       // Chỉ lấy event đang active
  //       setEvents(list.filter((e) => e.active));
  //     })
  //     .catch(console.error);
  // }, []);

  // if (events.length === 0) return null;

  // const activeEvent = events[activeIdx];

  // // Lấy sản phẩm trong event, override percentDiscount bằng discountPercent của event
  // const eventProducts = (activeEvent?.productIds || [])
  //   .map((id) => {
  //     const product = products.find((p) => (p._id || p.id) === id);
  //     if (!product) return null;
  //     return {
  //       ...product,
  //       percentDiscount: activeEvent.discountPercent || product.percentDiscount,
  //     };
  //   })
  //   .filter(Boolean);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("logo")}>
        <img src={logo} alt="FS Logo" />
        <div className={cx("header-right")}>
          <span className={cx("end-label")}>{countdownLabel}</span>
          {/* <Countdown endDate={activeEvent.endDate} /> */}
          <Countdown endDate={countdownTime} />
          {/* <Link to="/products" className={cx("see-all")}>
            Xem tất cả
          </Link> */}
        </div>
      </div>
      <div className={cx("container")}>
        {isEnded && (
          <div className={cx("overlay")}>
            <div className={cx("message")}>Sự kiện đã kết thúc</div>
          </div>
        )}
        <div className={cx("header")}>
          {/* <div className={cx("header-left")}>
            <div className={cx("tabs")}>
              {events.map((e, i) => (
                <button
                  key={e.id}
                  className={cx("tab", { active: i === activeIdx })}
                  onClick={() => setActiveIdx(i)}
                >
                  {e.name}
                </button>
              ))}
            </div>
          </div> */}
        </div>

        <div className={cx("products-scroll")}>
          {eventProducts.length === 0 ? (
            <p className={cx("empty")}>Chưa có sản phẩm trong sự kiện này.</p>
          ) : (
            <CardContent
              flashsale
              products={eventProducts}
              isFlashSaleUpcoming={!hasStarted}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Event;
