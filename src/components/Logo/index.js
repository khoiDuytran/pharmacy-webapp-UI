import classNames from "classnames/bind";

import styles from "./Logo.module.scss";
import icon from "../../assets/images/logo-icon.png";

const cx = classNames.bind(styles);

function Logo() {
  return (
    <div className={cx("logo-home")}>
      <div className={cx("logo-icon")}>
        <img src={icon} alt="PharHealth" />
      </div>
      <div className={cx("logo-content")}>
        <span className={cx("home-title")}>PHARHEALTH</span>
        <span className={cx("home-subtitle")}>Bảo vệ sức khỏe toàn diện</span>
      </div>
    </div>
  );
}

export default Logo;
