import classNames from "classnames/bind";

import styles from "./BannerGrid.module.scss";

const cx = classNames.bind(styles);

const bannerImages = [
  {
    image:
      "https://theme.hstatic.net/200000851307/1001229135/14/showinfobnnthongtinicon1.png?v=1168",
    title1: "Cam kết",
    title2: "Thuốc chính hãng",
  },
  {
    image:
      "https://theme.hstatic.net/200000851307/1001229135/14/showinfobnnthongtinicon2.png?v=1168",
    title1: "Thanh toán tiện lợi",
    title2: "Hỗ trợ nhiều phương thức",
  },
  {
    image:
      "https://theme.hstatic.net/200000851307/1001229135/14/showinfobnnthongtinicon3.png?v=1168",
    title1: "Miễn phí giao hàng",
    title2: "Đơn hàng từ 0 đồng",
  },
  {
    image:
      "https://theme.hstatic.net/200000851307/1001229135/14/showinfobnnthongtinicon4.png?v=1168",
    title1: "Đổi trả",
    title2: "trong vòng 3 ngày",
  },
];

function BannerGrid() {
  return (
    <div className={cx("banner-box")}>
      <div className={cx("grid-content")}>
        <div className={cx("grid-templait-on")}>
          <div className={cx("grid-item")}>
            <div className={cx("grid-item-text")}>
              <h2 className={cx("grid-item-title")}>
                Cùng Nhà thuốc PharHealth bảo vệ sức khỏe của bạn
              </h2>
              <div className={cx("grid-templait-grid")}>
                {bannerImages.map((item, index) => {
                  return (
                    <div className={cx("grid-templait-grid1")} key={index}>
                      <div className={cx("grid-icon")}>
                        <img src={item.image} alt={item.title1} />
                      </div>
                      <div className={cx("grid-box")}>
                        <div className={cx("grid-title1")}>{item.title1}</div>
                        <div className={cx("grid-title2")}>{item.title2}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={cx("grid-image")}>
            <img
              src="//theme.hstatic.net/200000851307/1001229135/14/tinvabannerimage.png?v=1168"
              alt="Cùng Nhà thuốc Pharceco bảo vệ sức khỏe của bạn"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BannerGrid;
