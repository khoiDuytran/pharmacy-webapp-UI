import { Outlet } from "react-router-dom";
import Sidebar from "../../layouts/components/Sidebar";
import styles from "./Profile.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function Profile() {
  return (
    <div className={cx("wrapper")}>
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
