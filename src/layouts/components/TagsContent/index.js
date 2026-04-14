import classNames from "classnames/bind";

import styles from "./TagsContent.module.scss";
// import CMT from "../../../assets/images/tag/icon-canmuathuoc.png";
// import TV from "../../../assets/images/tag/icon-tuvan.png";
// import DT from "../../../assets/images/tag/icon-donthuoc.png";
// import DSH from "../../../assets/images/tag/icon-dealsieuhot.png";
// import HTNT from "../../../assets/images/tag/icon-hethongnhathuoc.png";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxArchive,
  faCapsules,
  faHeartPulse,
  faHouseMedicalCircleCheck,
  faTags,
} from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const TAG_ITEMS = [
  {
    icon: faCapsules,
    name: "Cần mua thuốc",
    type: "link",
    to: "/products",
  },
  {
    icon: faHeartPulse,
    name: "Tư vấn trực tuyến",
    type: "chat",
  },
  {
    icon: faBoxArchive,
    name: "Đơn hàng của tôi",
    type: "link",
    to: "/profile/don-hang",
  },
  {
    icon: faTags,
    name: "Deal siêu hot",
    type: "link",
    to: "/super-hot-deal",
  },
  {
    icon: faHouseMedicalCircleCheck,
    name: "Tìm nhà thuốc",
    type: "link",
    to: "/location",
  },
];
function TagsContent() {
  const navigate = useNavigate();

  const handleClick = (item) => {
    if (item.type === "link") {
      navigate(item.to);
    }

    if (item.type === "chat") {
      window.dispatchEvent(new Event("open-chatbot"));
    }
  };

  return (
    <div className={cx("wrapper")}>
      {TAG_ITEMS.map((item, index) => (
        <div
          key={index}
          className={cx("tag")}
          onClick={() => handleClick(item)}
        >
          <div className={cx("icon")}>
            <FontAwesomeIcon icon={item.icon} />
          </div>
          <div className={cx("title")}>{item.name}</div>
        </div>
      ))}
    </div>
  );
}

export default TagsContent;
