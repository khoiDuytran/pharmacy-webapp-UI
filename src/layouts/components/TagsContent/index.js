import classNames from "classnames/bind";
import styles from "./TagsContent.module.scss";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxArchive,
  faCapsules,
  faHeartPulse,
  faHouseMedicalCircleCheck,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getAllTags } from "../../../services/tagService";

const cx = classNames.bind(styles);

// Map type từ API → icon + action
const TAG_CONFIG = {
  openProductList: {
    icon: faCapsules,
    name: "Cần mua thuốc",
    action: (navigate) => navigate("/products"),
  },
  openChatbot: {
    icon: faHeartPulse,
    name: "Tư vấn trực tuyến",
    action: () => window.dispatchEvent(new Event("open-chatbot")),
  },
  openMyOrders: {
    icon: faBoxArchive,
    name: "Đơn của tôi",
    action: (navigate) => navigate("/profile/don-hang"),
  },
  openSuperDeal: {
    icon: faTags,
    name: "Deal siêu hot",
    action: (navigate) => navigate("/super-hot-deal"),
  },
  openLocation: {
    icon: faHouseMedicalCircleCheck,
    name: "Tìm nhà thuốc",
    action: (navigate) => navigate("/location"),
  },
};

function TagsContent() {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const getTags = async () => {
      try {
        const res = await getAllTags();

        if (!res?.success) return;
        setTags(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy tags:", error);
        setTags([]);
      }
    };
    getTags();
  }, []);

  const visibleTags = tags
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  return (
    <div className={cx("wrapper")}>
      {visibleTags.map((tag) => {
        const config = TAG_CONFIG[tag.type];
        if (!config) return null; // type không nhận dạng được → bỏ qua

        return (
          <div
            key={tag.id}
            className={cx("tag")}
            onClick={() => config.action(navigate)}
          >
            <div className={cx("icon")}>
              <FontAwesomeIcon icon={config.icon} />
            </div>
            <div className={cx("title")}>{tag.name}</div>
          </div>
        );
      })}
    </div>
  );
}

export default TagsContent;
