import { message } from "antd";
import axios from "axios";
import { useFormik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const formmik = useFormik({
    initialValues: {
      username: "",
      telephone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Vui lòng nhập tên người dùng")
        .min(5, "Username tối thiểu 5 ký tự"),
      telephone: Yup.string()
        .required("Vui lòng nhập SĐT")
        .matches(
          /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
          "Vui lòng nhập đúng số điện thoại (VD: 0794567833)"
        ),
      password: Yup.string()
        .required("Vui lòng nhập mật khẩu")
        .min(6, "Password tối thiểu 6 ký tự"),
      confirmPassword: Yup.string()
        .required("Vui lòng nhập lại mật khẩu")
        .oneOf([Yup.ref("password"), null], "Mật khẩu phải trùng nhau"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post("/auth/forgot-password", values);
        message.success("Đổi mật khẩu thành công");
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/login");
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        message.error("Nhập sai username hoặc SĐT");
      }
    },
  });
  const handleBack = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };
  return (
    <div>
      <h2 className="text-center text-3xl font-normal py-3">Quên mật khẩu</h2>
      <form onSubmit={formmik.handleSubmit}>
        <label>Nhập username:</label>
        <input
          type="text"
          id="username"
          name="username"
          onChange={formmik.handleChange}
          placeholder="Nhập tên người dùng"
          required
        />
        {formmik.errors.username && (
          <p className="text-sm text-red-500 p-1">{formmik.errors.username}</p>
        )}
        <label>Nhập số điện thoại:</label>
        <input
          type="text"
          id="telephone"
          name="telephone"
          onChange={formmik.handleChange}
          placeholder="Nhập số điện thoại"
          required
        />
        {formmik.errors.telephone && (
          <p className="text-sm text-red-500 p-1">{formmik.errors.telephone}</p>
        )}
        <label>Nhập mật khẩu</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={formmik.handleChange}
          placeholder="Nhập mật khẩu mới"
          required
        />
        {formmik.errors.password && (
          <p className="text-sm text-red-500 p-1">{formmik.errors.password}</p>
        )}
        <label>Nhập lại mật khẩu</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          onChange={formmik.handleChange}
          placeholder="Nhập lại mật khẩu"
          required
        />
        {formmik.errors.confirmPassword && (
          <p className="text-sm text-red-500 pb-3">
            {formmik.errors.confirmPassword}
          </p>
        )}
        <div className="flex">
          <button type="submit" className="rounded-md">
            Đổi mật khẩu
          </button>
          <button className="rounded-md" type="button" onClick={handleBack}>
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );
}
