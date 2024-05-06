import React, { useEffect, useState } from "react";
import "../css_class/Header.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Button from "@mui/material/Button";

function Header() {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1500);
    window.location.reload();
  };

  useEffect(() => {
    const tokenCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (!tokenCookie) {
      navigate("/login");
    } else {
      setToken(tokenCookie);
    }
  }, [navigate]);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setDecoded(decodedToken);
      console.log(decodedToken.admin);
    }
  }, [token, navigate]);

  return (
    <header className="header">
      <div className="logo">
        <h1>NICE DREAM</h1>
        <p>-HOTEL & VILLAS-</p>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <a href="/">TRANG CHỦ</a>
          </li>
          <li>
            <a href="/khach-san">KHÁCH SẠN</a>
          </li>
          <li>
            <a href="/ca-nhan">CÁ NHÂN</a>
          </li>
          <li>
            <a href="/tin-tuc">TIN TỨC</a>
          </li>
          <li>
            <a href="/lien-he">LIÊN HỆ</a>
          </li>
          {decoded.admin === true ? (
            <li>
              <a href="/admin">ADMIN</a>
            </li>
          ) : null}
        </ul>
      </nav>
      <div className="user">
        {decoded.admin === true || decoded.admin === false ? (
          <div>
            <span>Chào {decoded.username}.</span>
            <Button
              variant="text"
              style={{
                padding: 10,
                border: "none",
                marginRight: 10,
                backgroundColor: "rgb(66, 135, 232)",
                color: "white",
              }}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
