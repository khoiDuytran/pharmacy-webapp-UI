import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./Location.module.scss";

const cx = classNames.bind(styles);

const ITEMS = [
  {
    icon: faLocationDot,
    title: "ĐỊA CHỈ NHÀ THUỐC:",
    content: "PharHealth: 75 P.Chính Kinh, Thanh Xuân, Hà Nội",
  },
  {
    icon: faPhone,
    title: "SỐ ĐIỆN THOẠI:",
    content: "1900 1572",
  },
  {
    icon: faEnvelope,
    title: "EMAIL:",
    content: "pharhealth@gmail.com",
  },
];

function Location() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <Link to={"/"}>TRANG CHỦ</Link>

        <FontAwesomeIcon icon={faAngleRight} />
        {"HỆ THỐNG NHÀ THUỐC"}
      </div>
      <div className={cx("container")}>
        <div className={cx("title")}>HỆ THỐNG NHÀ THUỐC PHARHEALTH</div>
        <div className={cx("contact")}>
          <div className={cx("info")}>
            {ITEMS.map((item, index) => {
              return (
                <div key={index} className={cx("item")}>
                  <div className={cx("icon")}>
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={cx("item-icon")}
                    />
                  </div>
                  <div className={cx("content")}>
                    <div className={cx("item-title")}>{item.title}</div>
                    <div className={cx("item-content")}>{item.content}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={cx("map")}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.84218974088!2d105.80878891032216!3d20.998962088721594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ad4357e196d3%3A0xc66b48c1c9d67e3b!2zTmjDoCB0aHXhu5FjIFBoYXJDRWNv!5e0!3m2!1svi!2s!4v1773722467045!5m2!1svi!2s"
              className={cx("gg-map")}
              title="Pharceco"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Location;
