import React, { useContext, useEffect, useRef, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import { HotelContext } from "../contexts/HotelContext";
import { useLocation } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { message } from "antd";

export default function HotelPage() {
  const { hotels } = useContext(HotelContext);
  const location = useLocation();
  const { districtHotels } = location.state || {};
  const [hideForm, setHideForm] = useState(true);
  const [hotel, setHotel] = useState({});

  const handleBooking = async (hotelId) => {
    setHideForm(false);
    try {
      const res = await axios.get(`/hotel/get-one-hotel/${hotelId}`);
      setHotel(res.data);
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      return null;
    }
  };

  const today = moment().utcOffset(7).format("YYYY-MM-DD");

  const [day, setDay] = useState("");
  const [roomId, setRoomId] = useState("");
  const [timeBegin, setTimeBegin] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [room, setRoom] = useState(null);
  const [price, setPrice] = useState(0);

  const time = Math.abs(
    parseInt(timeBegin.split(":")[0]) - parseInt(timeEnd.split(":")[0])
  );
  const data = {
    room: roomId,
    dayStay: moment(day).format("YYYYMMDD"),
    hourStay: time,
  };
  // Hàm xử lý khi form được submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(`/booking/${hotel._id}`, data);
      setHideForm(true);
      message.success("Đặt phòng khách sạn thành công!");
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      return null;
    }
  };

  const handleSelectRoom = async (e) => {
    setRoomId(e.target.value);
    try {
      const res = await axios.get(`/hotel/room/${e.target.value}`);
      setRoom(res.data);
    } catch (error) {
      console.error("Error fetching hotel data:", error);
    }
  };

  const formRef = useRef();
  useEffect(() => {
    const price1 = room?.price * time;
    if (price1) {
      setPrice(price1);
    }
  }, [room, time]);
  return (
    <div className={`relative min-h-96 pt-3 px-72 `}>
      {!hideForm && (
        <div
          className="absolute inset-0 bg-gray-500 opacity-50 z-10"
          onClick={() => {
            setHideForm(true);
            setRoom(null);
          }}
        ></div>
      )}
      {!districtHotels ? (
        <h2 className="text-center text-3xl font-normal pb-3">
          Tất cả khách sạn tìm thấy
        </h2>
      ) : (
        <h2 className="text-center text-3xl font-normal pb-3">
          Tất cả khách sạn tìm thấy ở quận{" "}
          <span className="text-red-500">{districtHotels.name}</span>
        </h2>
      )}

      {!districtHotels ? (
        hotels.length === 0 ? (
          <p className="text-center">Không có khách sạn nào</p>
        ) : (
          hotels.map((hotel) => {
            return (
              <div
                key={hotel._id.toString()}
                className="flex flex-row border border-gray-400 p-4 rounded-md mb-4"
              >
                <img
                  src={hotel.image.src}
                  alt={hotel.image.alt}
                  className="rounded-md w-[200px] h-[200px]"
                />
                <div className="m-4"></div>
                <div className="relative w-[500px]">
                  <h4 className="text-2xl font-medium text-blue-600">
                    {hotel.nameHotel}
                  </h4>
                  <p className="text-sm">
                    <span className="text-green-600 font-medium">
                      {hotel.district.name}
                    </span>{" "}
                    - {hotel.distanceFormCenter}
                  </p>
                  <p className="text-sm w-full max-h-[100px] overflow-hidden break-words">
                    {hotel?.description}
                  </p>
                  <button
                    className="absolute bottom-0 left-0 rounded-md"
                    onClick={handleBooking.bind(null, hotel._id)}
                  >
                    Đặt phòng
                  </button>
                </div>
                <div className="m-4"></div>
                <div className="text-center text-blue-800 ml-auto">
                  <h4 className="font-medium">Đánh giá</h4>
                  <p className="flex items-center justify-center">
                    {hotel.evaluate}
                    <span>
                      <StarIcon fontSize="medium" />
                    </span>
                  </p>
                </div>
              </div>
            );
          })
        )
      ) : (
        districtHotels?.hotels.map((hotel) => {
          return (
            <div
              key={hotel._id.toString()}
              className="flex flex-row border border-gray-400 p-4 rounded-md mb-4"
            >
              <img
                src={hotel.image.src}
                alt={hotel.image.alt}
                className="rounded-md w-[200px] h-[200px]"
              />
              <div className="m-4"></div>
              <div className="relative flex-shrink-0 w-[400px]">
                <h4 className="text-2xl font-medium text-blue-600">
                  {hotel.nameHotel}
                </h4>
                <p className="text-sm">
                  <span className="text-green-600 font-medium">
                    {districtHotels.name}
                  </span>{" "}
                  - {hotel.distanceFormCenter}
                </p>
                <p className="text-sm w-full max-h-[100px] overflow-hidden break-words">
                  {hotel?.description}
                </p>
                <button
                  className="absolute bottom-0 left-0 rounded-md"
                  onClick={handleBooking.bind(null, hotel._id)}
                >
                  Đặt phòng
                </button>
              </div>
              <div className="m-4"></div>
              <div className="text-center text-blue-800 ml-auto">
                <h4 className="font-medium">Đánh giá</h4>
                <p className="flex items-center justify-center">
                  {hotel.evaluate}
                  <span>
                    <StarIcon fontSize="medium" />
                  </span>
                </p>
              </div>
            </div>
          );
        })
      )}
      {!hideForm ? (
        <form
          onSubmit={handleSubmit}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-md shadow-lg max-h-[600px]"
          ref={formRef}
        >
          <h2 className="text-center text-3xl font-medium">
            Đặt phòng khách sạn
          </h2>
          <h2 className="text-center text-3xl font-medium text-red-500">
            {hotel.nameHotel}
          </h2>
          <div>
            <label htmlFor="selectedDate">Chọn ngày đặt:</label>
            <input
              type="date"
              id="selectedDate"
              onChange={(e) => setDay(e.target.value)}
              min={today}
              required
            />
          </div>
          <div className="p-4">
            <div>Chọn phòng:</div>
            <select
              id="selectedOption"
              onChange={handleSelectRoom}
              required
              className="border p-3 border-black rounded-md"
            >
              <option value="">--Chọn--</option>
              {hotel?.room?.map((item) => {
                return (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
          {room ? (
            <div className="p-1 mb-1">
              <span className="text-red-500">Giá phòng</span>: {room.price}
              vnđ/1h
            </div>
          ) : null}
          <div>
            <label htmlFor="selectedTime">Chọn giờ đặt phòng:</label>
            <input
              type="time"
              id="selectedTime"
              onChange={(e) => setTimeBegin(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="selectedTime">Chọn giờ trả phòng:</label>
            <input
              type="time"
              id="selectedTime"
              onChange={(e) => setTimeEnd(e.target.value)}
              required
            />
          </div>
          {room ? (
            <div className="p-2">
              <span className="text-blue-800">Tổng thiệt hại</span>: {price}vnđ
            </div>
          ) : null}
          <button type="submit" className="rounded-md">
            Đặt phòng
          </button>
        </form>
      ) : null}
    </div>
  );
}
