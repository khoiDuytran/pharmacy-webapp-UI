import classNames from "classnames/bind";

import styles from "./BlogCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function BlogCard({ data }) {
  return (
    <div className={cx("wrapper")}>
      <img src={data.image} alt={data.title} className={cx("image")} />
      <div className={cx("container")}>
        <div className={cx("content")}>
          <h3 className={cx("title")}>{data.title}</h3>
          <p className={cx("description")}>{data.description}</p>
          <button className={cx("read-more-btn")}>
            {"TÌM HIỂU THÊM "}
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
}
export default BlogCard;
