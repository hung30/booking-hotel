import React from "react";
import { Link } from "react-router-dom";

const HeaderUser = () => {
  return (
    <div style={styles.header}>
      <nav style={styles.nav}>
        <ul style={styles.menu}>
          <li style={styles.menuItem}>
            <Link to="/ca-nhan" style={styles.link}>
              Trang cá nhân
            </Link>
          </li>
          <li style={styles.menuItem}>
            <Link to="/booking-history" style={styles.link}>
              Đơn đặt
            </Link>
          </li>
          <li style={styles.menuItem}>
            <Link to="/change-password" style={styles.link}>
              Đổi mật khẩu
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const styles = {
  header: {
    backgroundColor: "#e0e0e0",
    padding: "10px 20px",
    margin: "0px 0px 20px 0px",
  },
  nav: {
    display: "flex",
    justifyContent: "center",
  },
  menu: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    display: "flex",
  },
  menuItem: {
    marginRight: "20px",
  },
  link: {
    color: "#333",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "16px",
  },
};

export default HeaderUser;
