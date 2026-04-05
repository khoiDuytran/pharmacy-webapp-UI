import { useEffect, useState } from "react";
import classNames from "classnames/bind";

import CardContent from "../../layouts/components/CardContent";
import styles from "./Home.module.scss";
import BlogContent from "../../layouts/components/BlogContent";
import { getProduct } from "../../services/productService";
import Loading from "../../components/Loading";
import webBanner from "../../assets/images/web-banner.png";
import webBanner2 from "../../assets/images/web-banner2.png";
import mobileBanner from "../../assets/images/mobile-banner.png";
import HeroBanner from "../../layouts/components/HeroBanner";
import Event from "../../layouts/components/Event";
import TagsContent from "../../layouts/components/TagsContent";

const cx = classNames.bind(styles);

const HeroImages = [webBanner, webBanner2];

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

const blogs = [
  {
    image:
      "https://cdn.hstatic.net/files/200000851307/article/web_8__945f33fbaebb46fc97a466d5f0fecce9_master.jpg",
    title: "Bổ thận, giảm tiểu đêm",
    description:
      "Bổ thận, giảm tiểu đêm là một trong những vấn đề phổ biến mà nhiều người gặp phải, đặc biệt là khi tuổi tác tăng lên.",
  },
  {
    image:
      "https://cdn.hstatic.net/files/200000851307/article/web_9__10f03e8dd2d4493f933899fdaba5f9ec_master.jpg",
    title: " Niềm vui trọn vẹn khi tiêu hóa khỏe mạnh",
    description:
      "Tiêu hóa khỏe mạnh không chỉ giúp cơ thể hấp thụ dinh dưỡng tốt hơn mà còn mang lại niềm vui trọn vẹn trong cuộc sống hàng ngày.",
  },
  {
    image:
      "https://cdn.hstatic.net/files/200000851307/article/web_7__84049a62481c49f780f115cdf25845e4_master.jpg",
    title: "GIẢM CÂN, THANH LỌC, CHĂM SÓC CƠ THỂ ĐÚNG CÁCH",
    description:
      "Giảm cân, thanh lọc và chăm sóc cơ thể đúng cách là một trong những mục tiêu quan trọng mà nhiều người hướng tới.",
  },
  {
    image:
      "https://cdn.hstatic.net/files/200000851307/article/pcc_bao_ve_la_phoi_2_web_ea648eea12ab4c23838130a2fd5d75f9_master.jpg",
    title: "Bảo vệ lá phổi, nâng cao sức khỏe hô hấp",
    description:
      "Bảo vệ lá phổi và nâng cao sức khỏe hô hấp là một trong những yếu tố quan trọng để duy trì một cuộc sống khỏe mạnh và năng động.",
  },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await getProduct();
        if (!res) return;
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getAllProducts();
  }, []);

  const discountProduct = products
    ? products.sort((p, q) => q.percentDiscount - p.percentDiscount).slice(0, 8)
    : [];
  const otherProduct = products
    ? products.filter((p) => p.purchaseCount < 11).slice(8)
    : [];

  return (
    <div className={cx("wrapper")}>
      <div className={cx("hero")}>
        <div className={cx("hero-section")}>
          {isMobile ? (
            <img src={mobileBanner} alt="hero" className={cx("hero-image")} />
          ) : (
            <HeroBanner images={HeroImages} />
          )}
          {/* {!isMobile && (
            <div className={cx("hero-content")}>
              <h3 className={cx("hero-subtitle")}>
                Hệ thống
                <span className={cx("highlight")}> NHÀ THUỐC </span>
              </h3>
              <h1 className={cx("hero-title")}>PHARHEALTH</h1>
              <Link to={"/products"}>
                <Button medium className={cx("hero-button")}>
                  Khám phá ngay
                </Button>
              </Link>
            </div>
          )} */}
        </div>
      </div>

      <div className={cx("container")}>
        <div className={cx("content")}>
          <section className={cx("section")}>
            <TagsContent />
          </section>

          <section className={cx("section")}>
            {loading ? <Loading /> : <Event products={products} />}
          </section>

          <section className={cx("section")}>
            {loading ? (
              <Loading />
            ) : (
              <CardContent
                column
                title={"Khuyến mại siêu hời"}
                products={discountProduct}
              />
            )}
          </section>

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
                          <div
                            className={cx("grid-templait-grid1")}
                            key={index}
                          >
                            <div className={cx("grid-icon")}>
                              <img src={item.image} alt={item.title1} />
                            </div>
                            <div className={cx("grid-box")}>
                              <div className={cx("grid-title1")}>
                                {item.title1}
                              </div>
                              <div className={cx("grid-title2")}>
                                {item.title2}
                              </div>
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

          <section className={cx("section")}>
            {loading ? (
              <Loading />
            ) : (
              <CardContent
                topseller
                title={"Sản phẩm phổ biến"}
                products={products}
              />
            )}
          </section>

          <section className={cx("section")}>
            {loading ? (
              <Loading />
            ) : (
              <CardContent
                slide
                title={"Sản phẩm khác"}
                products={otherProduct}
              />
            )}
          </section>
        </div>
      </div>

      <BlogContent title={"Bài viết nổi bật"} blogs={blogs} />
    </div>
  );
}

export default Home;
