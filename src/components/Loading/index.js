import classNames from "classnames/bind";

import styles from "./Loading.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);
function Loading() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("loader")}>
        <span className={cx("icon")}>
          <FontAwesomeIcon icon={faCircleNotch} />
        </span>
        <span>Đang tải...</span>
      </div>
    </div>
  );
}

export default Loading;
