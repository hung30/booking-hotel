import React, { useEffect, useState } from "react";
import HeaderUser from "./../components/HeaderUser";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
export default function ChangePasswordPage() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    telephone: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    async function getUser() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/get-user`
        );
        return res;
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        return setUser({});
      }
    }
    getUser().then((res) => {
      setUser(res.data);
    });
  }, [navigate]);
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required("Vui lòng nhập mật khẩu")
        .min(6, "Password tối thiểu 6 ký tự"),
      confirmPassword: Yup.string()
        .required("Vui lòng nhập lại mật khẩu")
        .oneOf([Yup.ref("password"), null], "Mật khẩu phải trùng nhau"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL}/user/change-password/${user._id}`,
          values
        );
        message.success("Đổi mật khẩu thành công");
        navigate("/");
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        message.error("không thể đổi mật khẩu");
      }
    },
  });
  return (
    <div>
      <HeaderUser />
      <div className="min-h-96 pt-3 px-[500px]">
        <h2 className="text-center text-3xl font-normal pb-3">Đổi mật khẩu:</h2>
        <form onSubmit={formik.handleSubmit}>
          <label>Mật khẩu</label>
          <input
            type="password"
            id="password"
            name="password"
            className="rounded-md"
            onChange={formik.handleChange}
            placeholder="Nhập mật khẩu"
          />
          {formik.errors.password && (
            <p className="text-sm text-red-500 p-1">{formik.errors.password}</p>
          )}
          <label>Nhập lại mật khẩu:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="rounded-md"
            onChange={formik.handleChange}
            placeholder="Nhập lại mật khẩu"
          />
          {formik.errors.confirmPassword && (
            <p className="text-sm text-red-500 py-2">
              {formik.errors.confirmPassword}
            </p>
          )}
          <button type="submit" className="rounded-md">
            Đổi mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
}
