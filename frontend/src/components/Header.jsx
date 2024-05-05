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
            <a href="/">Trang chủ</a>
          </li>
          <li>
            <a href="/khach-san">Khách sạn</a>
          </li>
          <li>
            <a href="/ca-nhan">Cá nhân</a>
          </li>
          <li>
            <a href="/tin-tuc">Tin tức</a>
          </li>
          <li>
            <a href="/lien-he">Liên hệ</a>
          </li>
          {decoded.admin === true ? (
            <li>
              <a href="/admin">Admin</a>
            </li>
          ) : null}
        </ul>
      </nav>
      <div className="user">
        {decoded.admin === true || decoded.admin === false ? (
          <div>
            <span>Chào {decoded.username}.</span>
            <Button variant="text" color="secondary" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
