import React, { useContext, useEffect, useState } from "react";
import "../css_class/HomePage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HotelContext } from "../contexts/HotelContext";

function HomePage() {
  const { districts } = useContext(HotelContext);
  const navigate = useNavigate();
  const [district, setDistrict] = useState("");
  const [err, setErr] = useState(false);

  const searchHandle = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/hotel/get-by-district/${district}`
      );
      navigate("/khach-san", { state: { districtHotels: res.data } });
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      setErr(true);
      return null;
    }
  };
  useEffect(() => {
    if (err) {
      const timeoutId = setTimeout(() => {
        setErr(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [err]);
  return (
    <div>
      <div className="search">
        <div className="search-box">
          <h2 className="text-center text-3xl font-medium">
            Tìm kiếm ưu đãi khách sạn, chỗ nghỉ...
          </h2>
          <p>Đặt khách sạn quanh khu vực Đà Nẵng</p>
        </div>
        <div className="search-input px-96 text-center">
          <select
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full h-10 rounded-md mb-3"
          >
            <option>- Chọn quận bạn muốn thuê Hotel -</option>
            {districts.length !== 0 ? (
              districts.map((district) => {
                return (
                  <option key={district._id} value={district._id}>
                    {district.name}
                  </option>
                );
              })
            ) : (
              <option key={district._id} value="">
                no
              </option>
            )}
          </select>
          {err ? (
            <>
              <p className="text-red-600 text-base mb-1">
                Chưa có khách sạn nào ở đây
              </p>
              <button className="rounded-md" onClick={searchHandle}>
                Tìm kiếm
              </button>
            </>
          ) : (
            <button className="rounded-md" onClick={searchHandle}>
              Tìm kiếm
            </button>
          )}
        </div>
      </div>
      <div className="px-72 pt-4">
        <div>
          <h2 className="text-2xl font-medium">Ưu đãi</h2>
          <p className="text-sm">
            Khuyến mãi, giảm giá và ưu đãi đặc biệt dành riêng cho bạn
          </p>
          <div className="relative pt-3">
            <h3 className="absolute text-xl font-medium text-white top-5 left-4">
              Đặt liền tay, bắt ngay ưu đãi
            </h3>
            <p className="absolute text-sm text-white top-14 left-4">
              Tiết kiệm từ 15% trở lên khi đặt và lưu trú trước 1/10/2024
            </p>
            <button className="absolute top-24 left-4 text-sm rounded-md">
              Tìm ưu đãi mùa du lịch
            </button>
            <img
              src="https://r-xx.bstatic.com/xdata/images/xphoto/714x300/316455553.jpeg?k=33c0362560b6aa7ff9ba2afc3ef8d120728107cf56cd1c006fcf0da8c1821735&o="
              alt="Hai người trò chuyện bên hồ bơi"
              className="h-40 w-full rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="px-72 pt-10">
        <div className="pb-3">
          <h3 className="text-2xl font-medium">Điểm đến đang thịnh hành</h3>
          <p className="text-sm">
            Các lựa chọn phổ biến nhất cho du khách từ Đà Nẵng
          </p>
        </div>
        <div className="flex flex-row relative">
          <h3 className="absolute text-2xl font-medium text-white top-3 left-3">
            Liên Chiểu
          </h3>
          <img
            src="https://cf.bstatic.com/xdata/images/city/600x600/688956.jpg?k=fc88c6ab5434042ebe73d94991e011866b18ee486476e475a9ac596c79dce818&o="
            alt=""
            className="h-56 w-full rounded-md"
          />
          <div className="m-2"></div>
          <h3 className="absolute text-2xl font-medium text-white top-3 left-[495px]">
            Cẩm Lệ
          </h3>
          <img
            src="https://cf.bstatic.com/xdata/images/city/600x600/688844.jpg?k=02892d4252c5e4272ca29db5faf12104004f81d13ff9db724371de0c526e1e15&o="
            alt=""
            className="h-56 w-full rounded-md"
          />
        </div>

        <div className="flex flex-row relative pt-3">
          <h3 className="absolute text-2xl font-medium text-white top-5 left-3">
            Hải Châu
          </h3>
          <img
            src="https://cf.bstatic.com/xdata/images/city/600x600/688893.jpg?k=d32ef7ff94e5d02b90908214fb2476185b62339549a1bd7544612bdac51fda31&o="
            alt=""
            className="h-56 w-full rounded-md"
          />
          <div className="m-2"></div>
          <h3 className="absolute text-2xl font-medium text-white top-5 left-[330px]">
            Sơn Trà
          </h3>
          <img
            src="https://cf.bstatic.com/xdata/images/city/600x600/688831.jpg?k=7b999c7babe3487598fc4dd89365db2c4778827eac8cb2a47d48505c97959a78&o="
            alt=""
            className="h-56 w-full rounded-md"
          />
          <div className="m-2"></div>
          <h3 className="absolute text-2xl font-medium text-white top-5 left-[650px]">
            Thanh Khê
          </h3>
          <img
            src="https://cf.bstatic.com/xdata/images/city/600x600/688853.jpg?k=f6427c8fccdf777e4bbc75fcd245e7c66204280181bea23350388c76c57348d1&o="
            alt=""
            className="h-56 w-full rounded-md"
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
