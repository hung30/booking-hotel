import React from "react";
import "../css_class/ContactPage.css";
import { message } from "antd";
export default function ContactPage() {
  const handleSubmit = () => {
    message.success("Gửi thành công!");
  };
  return (
    <div>
      <header>
        <h1>Liên hệ về khách sạn</h1>
      </header>
      <section className="content">
        <div className="text-center">
          <h2 className="text-center text-3xl font-normal pb-3">
            Thông tin liên hệ
          </h2>
          <p className="text-center text-sm py-1">
            Địa chỉ: Số 123, Đường ABC, Thành phố XYZ
          </p>
          <p className="text-center text-sm py-1">Điện thoại: 0123 456 789</p>
          <p className="text-center text-sm py-1">Email: info@example.com</p>
          <h2 className="text-center text-3xl font-normal pb-3">
            Form liên hệ
          </h2>
        </div>
        <form>
          <label htmlFor="name">Họ và tên:</label>
          <br />
          <input type="text" id="name" name="name" />
          <br />
          <label htmlFor="email">Email:</label>
          <br />
          <input type="email" id="email" name="email" />
          <br />
          <label htmlFor="message">Nội dung:</label>
          <br />
          <textarea id="message" name="message" rows="4"></textarea>
          <br />
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-md w-20"
          >
            Gửi
          </button>
        </form>
      </section>
    </div>
  );
}
