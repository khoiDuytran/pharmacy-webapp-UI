import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Event.module.scss";
import { getAllEvent } from "../../../services/eventService";
import CardContent from "../CardContent";
import logo from "../../../assets/images/flash-sale.png";
import Countdown from "../../../components/CountDown";

const cx = classNames.bind(styles);

function Event({ products = [] }) {
  const [events, setEvents] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    getAllEvent()
      .then((res) => {
        const list = Array.isArray(res) ? res : [];
        // Chỉ lấy event đang active
        setEvents(list.filter((e) => e.active));
      })
      .catch(console.error);
  }, []);

  if (events.length === 0) return null;

  const activeEvent = events[activeIdx];

  // Lấy sản phẩm trong event, override percentDiscount bằng discountPercent của event
  const eventProducts = (activeEvent?.productIds || [])
    .map((id) => {
      const product = products.find((p) => (p._id || p.id) === id);
      if (!product) return null;
      return {
        ...product,
        percentDiscount: activeEvent.discountPercent || product.percentDiscount,
      };
    })
    .filter(Boolean);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("logo")}>
        <img src={logo} alt="FS Logo" />
        <div className={cx("header-right")}>
          <span className={cx("end-label")}>Kết thúc sau:</span>
          <Countdown endDate={activeEvent.endDate} />
          {/* <Link to="/products" className={cx("see-all")}>
            Xem tất cả
          </Link> */}
        </div>
      </div>
      <div className={cx("container")}>
        <div className={cx("header")}>
          <div className={cx("header-left")}>
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
          </div>
        </div>

        <div className={cx("products-scroll")}>
          {eventProducts.length === 0 ? (
            <p className={cx("empty")}>Chưa có sản phẩm trong sự kiện này.</p>
          ) : (
            <CardContent flashsale products={eventProducts} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Event;
