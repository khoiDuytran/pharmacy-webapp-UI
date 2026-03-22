import classNames from "classnames/bind";

import styles from "./BannerSlider.module.scss";

const cx = classNames.bind(styles);
function BannerSlider({ images = [] }) {
  return (
    <div className={cx("slider")}>
      <div className={cx("track")}>
        {[...images, ...images].map((image, index) => {
          return (
            <div className={cx("slide")} key={index}>
              <img src={image.image} alt="Banner" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BannerSlider;
