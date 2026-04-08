import { Link, Outlet } from "react-router-dom";
import Sidebar from "../../layouts/components/Sidebar";
import styles from "./Profile.module.scss";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function Profile() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("header")}>
        <Link to={"/"}>TRANG CHỦ</Link>

        <FontAwesomeIcon icon={faAngleRight} />
        {"TÀI KHOẢN"}
      </div>
      <div className={cx("container")}>
        <Sidebar />
        <div className={cx("content")}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Profile;
