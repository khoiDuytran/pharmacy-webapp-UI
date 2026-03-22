import PropTypes from "prop-types";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

import styles from "./ItemPreview.module.scss";

const cx = classNames.bind(styles);
function ItemPreview({ data }) {
  return (
    <button className={cx("item-btn")}>
      <p>{data.name}</p>
      <div className={cx("arrow")}>
        <FontAwesomeIcon icon={faAngleRight} />
      </div>
    </button>
  );
}

ItemPreview.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default ItemPreview;
