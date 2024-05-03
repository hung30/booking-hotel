import React, {useEffect, useState} from 'react';
import '../css_class/Header.css'
import { useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

function Header() {
    const [accessToken, setAccessToken] = useState('');
    const [decoded, setDecoded] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setTimeout(() => {
            setLoading(false);
            navigate("/login")
        }, 1500);
            window.location.reload()
    };

    useEffect(() => {
        const accessTokenCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')[1];
        if (!accessTokenCookie) {
            navigate('/login');
        } else {
            setAccessToken(accessTokenCookie);
        }
    }, [navigate]);

    useEffect(() => {
        if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            setDecoded(decodedToken);
            console.log(decodedToken.admin);
        }
    }, [accessToken, navigate]);

    return (
        <header className="header">
            <div className="logo">
                <h1>NICE DREAM</h1>
                <p>-HOTEL & VILLAS-</p>
            </div>
            <nav className="nav">
                <ul>
                    <li><a href="/">TRANG CHỦ</a></li>
                    <li><a href="/khach-san">KHÁCH SẠN</a></li>
                    <li><a href="/ca-nhan">CÁ NHÂN</a></li>
                    <li><a href="/tin-tuc">TIN TỨC</a></li>
                    <li><a href="/lien-he">LIÊN HỆ</a></li>
                    {decoded.admin === true ? (
                        <li>
                            <a href="/admin">ADMIN</a>
                        </li>
                    ) : null}
                </ul>
            </nav>
            <div className="user">
                {decoded.admin === true || decoded.admin===false ? (
                    <button onClick={handleLogout}>Đăng xuất</button>
                ) : null}

            </div>
        </header>
    );
}

export default Header;