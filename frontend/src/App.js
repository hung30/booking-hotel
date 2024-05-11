import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HotelPage from "./pages/HotelPage";
import { HotelContext } from "./contexts/HotelContext";
import axios from "axios";
import { AdminUserPage } from "./pages/AdminUserPage";
import AdminRoomPage from "./pages/AdminRoomPage";
import BookingPage from "./pages/BookingPage";
import UserPage from "./pages/UserPage";
import BookingHistory from "./pages/BookingHistory";
import ChangePasswordPage from "./pages/ChangePasswordPage";

function App() {
  const [hotels, setHotels] = useState([]);
  const [districts, setDistricts] = useState([]);
  useEffect(() => {
    async function getHotel() {
      try {
        const res = await axios.get("/hotel");
        return res;
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        return null;
      }
    }
    getHotel().then((res) => {
      setHotels(res.data);
    });

    async function getDistrict() {
      try {
        const res = await axios.get("/hotel/district");
        return res;
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        return null;
      }
    }
    getDistrict().then((res) => {
      setDistricts(res.data);
    });
  }, []);
  return (
    <div className="App">
      <HotelContext.Provider value={{ hotels, districts }}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/khach-san" element={<HotelPage />} />
            <Route path="/admin-users" element={<AdminUserPage />} />
            <Route path="/admin-rooms" element={<AdminRoomPage />} />
            <Route path="/admin-bookings" element={<BookingPage />} />
            <Route path="/ca-nhan" element={<UserPage />} />
            <Route path="/booking-history" element={<BookingHistory />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </HotelContext.Provider>
    </div>
  );
}

export default App;
