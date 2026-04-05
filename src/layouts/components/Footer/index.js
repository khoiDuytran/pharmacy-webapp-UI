import styles from "./Footer.module.scss";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function Footer() {
  return (
    <footer className={cx("footer")}>
      <div className={cx("wrapper")}>
        {/* Main Footer Content */}
        <div className={cx("main-footer")}>
          <div className={cx("container")}>
            <div className={cx("footer-grid")}>
              {/* Column 1 - Contact */}
              <div className={cx("footer-column")}>
                <h4 className={cx("column-title")}>Tổng đài tư vấn</h4>
                <ul className={cx("link-list")}>
                  <li>
                    <FontAwesomeIcon icon={faPhone} />
                    <p>1900 1572</p>
                  </li>
                </ul>
              </div>

              {/* Column 2 - Pharmacy System */}
              <div className={cx("footer-column")}>
                <h4 className={cx("column-title")}>Chính sách</h4>
                <ul className={cx("link-list")}>
                  <li>
                    <p>Chính sách đổi trả</p>
                  </li>
                  <li>
                    <p>Chính sách giao hàng</p>
                  </li>
                  <li>
                    <p>Chính sách bảo mật</p>
                  </li>
                  <li>
                    <p>Chính sách kiểm hàng</p>
                  </li>
                </ul>
              </div>

              {/* Column 3 - Customer Support */}
              <div className={cx("footer-column")}>
                <h4 className={cx("column-title")}>Hỗ trợ khách hàng</h4>
                <ul className={cx("link-list")}>
                  <li>
                    <p>Địa chỉ nhà thuốc</p>
                  </li>
                  <li>
                    <p>Hướng dẫn mua hàng</p>
                  </li>
                  <li>
                    <p>Hướng dẫn thanh toán</p>
                  </li>
                </ul>
              </div>

              {/* Column 4 - Social */}
              <div className={cx("footer-column")}>
                <h4 className={cx("column-title")}>Kết nối với chúng tôi</h4>
                <ul className={cx("link-list")}>
                  <li>
                    <img
                      src="//theme.hstatic.net/200000851307/1001229135/14/showinfocheckicon1.png?v=1168"
                      alt="Facebook"
                    ></img>
                    <p>Facebook</p>
                  </li>
                  <li>
                    <img
                      src="//theme.hstatic.net/200000851307/1001229135/14/showinfocheckicon2.png?v=1168"
                      alt="Zalo"
                    ></img>
                    <p>Zalo</p>
                  </li>
                </ul>
              </div>

              {/* Column 5 - Certifications */}
              <div className={cx("footer-column")}>
                <h4 className={cx("column-title")}>CHỨNG NHẬN BỞI</h4>
                <div className={cx("link-list")}>
                  <p className={cx("cert-link")}>
                    <img
                      src="https://theme.hstatic.net/200000851307/1001229135/14/bo-cong-thuong.webp"
                      alt="bộ công thương"
                    ></img>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={cx("copyright")}>
          <div className={cx("container")}>
            <p>© 2026 Nhà Thuốc Trực Tuyến. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
