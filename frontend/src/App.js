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

function App() {
  const [hotels, setHotels] = useState([]);
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
      console.log(res.data);
    });

    async function getDistrict() {
      try {
        const res = await axios.get("/auth/muahang");
        return res;
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        return null;
      }
    }
    getDistrict().then((res) => {
      // setHotels(res.data);
      console.log(res.data);
    });
    getDistrict().catch((err) => {
      console.log(err);
    });
  }, []);
  return (
    <div className="App">
      <HotelContext.Provider value={{ hotels }}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/khach-san" element={<HotelPage />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </HotelContext.Provider>
    </div>
  );
}

export default App;
