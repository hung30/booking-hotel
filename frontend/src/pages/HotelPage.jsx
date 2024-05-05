import React, { useContext } from "react";
import StarIcon from "@mui/icons-material/Star";
import { HotelContext } from "../contexts/HotelContext";

export default function HotelPage() {
  const { hotels } = useContext(HotelContext);
  return (
    <div className="min-h-96 pt-3 px-72">
      <h2 className="text-center text-3xl font-normal pb-3">
        Các khách sạn tìm thấy
      </h2>
      {hotels.length === 0 ? (
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
              <div className="relative flex-shrink-0 w-[545px]">
                <h4 className="text-2xl font-medium text-blue-600">
                  {hotel.nameHotel}
                </h4>
                <p className="text-sm">
                  <span className="text-green-600 font-medium">
                    {hotel.district.name}
                  </span>{" "}
                  - {hotel.distanceFormCenter}
                </p>
                <p className="text-sm">{hotel?.description}</p>
                <button className="absolute bottom-0 left-0 rounded-md">
                  Đặt phòng
                </button>
              </div>
              <div className="m-4"></div>
              <div className="flex-shrink-0 w-[100px] text-center text-blue-800 ">
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
    </div>
  );
}
