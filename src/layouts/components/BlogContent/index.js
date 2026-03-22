import classNames from "classnames/bind";
import { useEffect, useRef } from "react";

import styles from "./BlogContent.module.scss";
import BlogCard from "../../../components/BlogCard";
const cx = classNames.bind(styles);
function BlogContent({ title, blogs }) {
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    let isScrolling = false;

    const handleWheel = (e) => {
      if (list.scrollWidth <= list.clientWidth) return;

      e.preventDefault();

      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          list.scrollLeft += e.deltaY;
          isScrolling = false;
        });

        isScrolling = true;
      }
    };

    list.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      list.removeEventListener("wheel", handleWheel);
    };
  }, []);
  return (
    <div className={cx("blog")}>
      <div className={cx("blog-content")}>
        <h2 className={cx("blog-title")}>{title}</h2>
        <div className={cx("list")} ref={listRef}>
          {blogs.map((blog, index) => (
            <BlogCard key={index} data={blog} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogContent;
