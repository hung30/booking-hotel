import React, { useEffect } from "react";
import HeaderUser from "../components/HeaderUser";
import { Dialog, DialogActions, DialogTitle, Slide } from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import { message } from "antd";
import getCookie from "../hooks/getCookie";
import { jwtDecode } from "jwt-decode";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function BookingHistory() {
  const [open, setOpen] = React.useState(false);
  const [booking, setBooking] = React.useState([]);
  const [deleteBookingId, setDeleteBookingId] = React.useState("");

  useEffect(() => {
    async function getBooking() {
      try {
        const user = await jwtDecode(getCookie("token"));
        const res = await axios.get(`/booking/${user.id}`);
        return res;
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        return setBooking([]);
      }
    }
    getBooking().then((res) => {
      if (res?.data) {
        setBooking(res.data);
      } else {
        setBooking([]);
      }
    });
  }, [open]);
  const handleClickOpen = (id) => {
    setDeleteBookingId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBooking = async (id) => {
    try {
      const res = await axios.delete(`/booking/${id}`);
      message.success("Huỷ đơn đặt thành công");
      setOpen(false);
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      setOpen(false);
      return message.error("Xoá thất bại");
    }
  };
  return (
    <div>
      <HeaderUser />
      <div className="min-h-96 pt-3 px-72">
        <h2 className="text-center text-3xl font-normal pb-3">
          Lịch sử đặt phòng
        </h2>
        {booking.length === 0 ? (
          <p className="text-center">Chưa có đơn đặt phòng nào cả</p>
        ) : (
          booking.map((booking) => {
            return (
              <div
                key={booking._id}
                className="border border-solid  border-gray-400 rounded-md flex flex-wrap p-4 mb-3"
              >
                <div className="left-side flex-grow basis-60">
                  <h5 className="py-2">
                    <span className="text-green-800 font-medium text-lg">
                      {booking.room.name}
                    </span>{" "}
                    -{" "}
                    <span className="text-blue-600 font-medium text-base">
                      {booking.hotel?.nameHotel}
                    </span>
                  </h5>
                  <p className="text-base py-2">
                    Mô tả: {booking.room?.description}
                  </p>
                  <p className="text-base py-2">
                    Diện tích: {booking.room.area}m²
                  </p>
                  <p className="text-base py-2">
                    Phù hợp cho: {booking.room?.suitableFor}
                  </p>
                  <p className="text-base py-2">
                    Ngày đặt:{" "}
                    <span className="text-purple-500 font-medium">
                      {booking.createdAt.slice(8, 10) +
                        "-" +
                        booking.createdAt.slice(5, 7) +
                        "-" +
                        booking.createdAt.slice(0, 4)}
                    </span>
                  </p>
                  <p className="text-base py-2">
                    Ngày ở:{" "}
                    <span className="text-purple-500 font-medium">
                      {booking.dayStay.replace(
                        /(\d{4})(\d{2})(\d{2})/,
                        "$3-$2-$1"
                      )}
                    </span>
                  </p>
                  <p className="text-base py-2">
                    Đặt:{" "}
                    <span className="text-orange-500 font-medium">
                      {booking.hourStay}
                    </span>{" "}
                    tiếng
                  </p>
                  <p className="text-base py-2">
                    Tổng tiền:{" "}
                    <span className="text-red-500 font-medium">
                      {booking.price}
                    </span>
                    vnđ
                  </p>
                  <p className="text-base py-2">
                    Trạng thái:{" "}
                    <span className="text-pink-500 font-medium">
                      {booking.status.status}
                    </span>
                  </p>
                </div>
                <div className="right-side py-2">
                  <button
                    className="rounded-md"
                    onClick={() => handleClickOpen(booking._id)}
                  >
                    Huỷ đặt
                  </button>
                  <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                  >
                    <DialogTitle>{"Bạn muốn huỷ đơn đặt?"}</DialogTitle>
                    <DialogActions>
                      <Button onClick={handleClose}>Không</Button>
                      <Button onClick={() => handleBooking(deleteBookingId)}>
                        Có
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
