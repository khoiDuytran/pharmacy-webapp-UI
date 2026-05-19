import { useCallback, useEffect, useState } from "react";
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
import { getAllEvent } from "../../services/eventService";
import BannerGrid from "../../layouts/components/BannerGrid";
import { getAllSections } from "../../services/sectionService";

const cx = classNames.bind(styles);

const HeroImages = [webBanner, webBanner2];

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
  const [eventTime, setEventTime] = useState(null);
  const [eventStartDate, setEventStartDate] = useState(null);
  const [eventProducts, setEventProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getSections = async () => {
      try {
        const res = await getAllSections();

        console.log(res);

        if (!res?.success) return;
        setSections(res.data);
      } catch (error) {
        console.error(error);
        setSections([]);
      }
    };
    getSections();
  }, []);

  const visibleSections = sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  // useEffect(() => {
  //   const getAllProducts = async () => {
  //     try {
  //       const res = await getProduct();
  //       if (!res) return;
  //       setProducts(res.data);
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getAllProducts();
  // }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const [productRes, eventsRes] = await Promise.all([
        getProduct(),
        getAllEvent(),
      ]);

      if (!productRes?.success || !productRes?.data?.length) {
        return setProducts([]);
      }

      const AllProducts = Array.isArray(productRes)
        ? productRes
        : Array.isArray(productRes.data)
          ? productRes.data
          : [];
      const AllEvents = Array.isArray(eventsRes) ? eventsRes : [];
      const EventActive = AllEvents.filter((e) => e.active);

      if (EventActive.length === 0) return null;

      const activeEvent = EventActive[0];

      setEventTime(activeEvent.endDate);
      setEventStartDate(activeEvent.startDate || null);

      // Lấy sản phẩm trong event, override percentDiscount bằng discountPercent của event
      const eventProducts = (activeEvent?.productIds || [])
        .map((id) => {
          const product = AllProducts.find((p) => (p._id || p.id) === id);
          if (!product) return null;
          return {
            ...product,
            percentDiscount:
              activeEvent.discountPercent || product.percentDiscount,
          };
        })
        .filter(Boolean);

      setEventProducts([...eventProducts]);

      const listProducts = AllProducts.filter(
        (p) =>
          !eventProducts.some((ep) => (ep._id || ep.id) === (p._id || p.id)),
      );

      setProducts([...listProducts]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const discountProduct = products
    ? products.sort((p, q) => q.percentDiscount - p.percentDiscount).slice(0, 8)
    : [];
  const otherProduct = products
    ? products.filter((p) => p.purchaseCount < 11).slice(8)
    : [];

  const renderSection = (section) => {
    switch (section.type) {
      case "tags":
        return (
          <section className={cx("section")}>
            <TagsContent />
          </section>
        );

      case "discount":
        return (
          <section className={cx("section")}>
            {loading ? (
              <Loading />
            ) : (
              <CardContent
                column
                title={section.title}
                products={discountProduct}
              />
            )}
          </section>
        );

      case "event":
        return (
          <section className={cx("section")}>
            {loading ? (
              <Loading />
            ) : (
              <Event
                eventProducts={eventProducts || []}
                activeTime={eventTime || null}
                startDate={eventStartDate}
              />
            )}
          </section>
        );

      case "other":
        return (
          <section className={cx("section")}>
            {loading ? (
              <Loading />
            ) : (
              <CardContent
                slide
                title={section.title}
                products={otherProduct}
              />
            )}
          </section>
        );

      case "topSeller":
        return (
          <section className={cx("section")}>
            {loading ? (
              <Loading />
            ) : (
              <CardContent
                topseller
                title={section.title}
                products={products}
              />
            )}
          </section>
        );

      case "bannerGrid":
        return <BannerGrid />;

      case "blog":
        return <BlogContent title={"Bài viết nổi bật"} blogs={blogs} />;

      default:
        return null;
    }
  };

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
          {/* <section className={cx("section")}>
            <TagsContent />
          </section>

          <section className={cx("section")}>
            {loading ? (
              <Loading />
            ) : (
              <Event
                eventProducts={eventProducts || []}
                activeTime={eventTime || null}
              />
            )}
          </section>

          <section className={cx("section")}>
            {loading ? (
              <Loading />
            ) : (
              <CardContent
                column
                title={"Sản phẩm ưu đãi"}
                products={discountProduct}
              />
            )}
          </section>

          <BannerGrid />

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
          </section> */}
          {visibleSections.map((section) => (
            <div key={section.id}>{renderSection(section)}</div>
          ))}
        </div>
      </div>

      <BlogContent title={"Bài viết nổi bật"} blogs={blogs} />
    </div>
  );
}

export default Home;
