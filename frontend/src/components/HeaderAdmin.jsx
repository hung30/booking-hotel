import React from "react";
import { Link } from "react-router-dom";

const HeaderAdmin = () => {
  return (
    <div style={styles.header}>
      <nav style={styles.nav}>
        <ul style={styles.menu}>
          <li style={styles.menuItem}>
            <Link to="/admin" style={styles.link}>
              Quản lý khách sạn
            </Link>
          </li>
          <li style={styles.menuItem}>
            <Link to="/admin-user" style={styles.link}>
              Quản lý người dùng
            </Link>
          </li>
          <li style={styles.menuItem}>
            <Link to="/" style={styles.link}>
              Quản lý đặt phòng
            </Link>
          </li>
          <li style={styles.menuItem}>
            <Link to="/" style={styles.link}>
              Quản lý phòng
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

export default HeaderAdmin;
