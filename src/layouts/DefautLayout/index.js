import { useState } from "react";
import ChatBot from "../components/ChatBot";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import styles from "./DefaultLayout.module.scss";

import classNames from "classnames/bind";
import PropTypes from "prop-types";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={cx("wrapper")}>
      <Header onMenuToggle={() => setMobileMenuOpen((p) => !p)} />
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        onMenuClose={() => setMobileMenuOpen(false)}
      />
      <main className={cx("content")}>{children}</main>
      <Footer />
      <ChatBot />
    </div>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DefaultLayout;
