import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import styles from "./Button.module.scss";

const cx = classNames.bind(styles);

function Button({
  to,
  primary,
  disable = false,
  outline = false,
  text = false,
  small = false,
  medium = false,
  large = false,
  onClick,
  children,
  leftIcon,
  className,
  badge, // thêm prop badge
  ...passProps
}) {
  let Comp = "button";

  const props = {
    onClick,
    ...passProps,
  };

  if (disable) {
    Object.keys(props).forEach((key) => {
      if (key.startsWith("on") && typeof props[key] === "function") {
        delete props[key];
      }
    });
  }

  if (to) {
    props.to = to;
    Comp = Link;
  }

  const classes = cx("wrapper", {
    primary,
    outline,
    small,
    medium,
    large,
    text,
    disable,
    leftIcon,
    [className]: className,
  });

  return (
    <Comp className={classes} {...props}>
      {leftIcon && (
        <span className={cx("icon")}>
          {leftIcon}
          {badge > 0 && (
            <span className={cx("badge")}>{badge > 99 ? "99+" : badge}</span>
          )}
        </span>
      )}
      <span className={cx("title")}>{children}</span>
    </Comp>
  );
}

Button.propTypes = {
  primary: PropTypes.bool,
  disable: PropTypes.bool,
  outline: PropTypes.bool,
  text: PropTypes.bool,
  small: PropTypes.bool,
  medium: PropTypes.bool,
  large: PropTypes.bool,
  to: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  leftIcon: PropTypes.node,
  className: PropTypes.string,
  badge: PropTypes.number,
};

export default Button;
