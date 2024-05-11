import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import HeaderUser from "../components/HeaderUser";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

export default function UserPage() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    telephone: "",
  });
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");

  console.log(username, email, telephone);
  const navigate = useNavigate();
  useEffect(() => {
    async function getUser() {
      try {
        const res = await axios.get("/user/get-user");
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
  useEffect(() => {
    setUsername(user.username);
    setEmail(user.email);
    setTelephone(user.telephone);
  }, [user]);

  const formik = useFormik({
    initialValues: {
      username: username || "",
      email: email || "",
      telephone: telephone || "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Vui lòng nhập username")
        .min(5, "Username tối thiểu 5 ký tự"),
      email: Yup.string().matches(
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Vui lòng nhập đúng dạng của email (VD: a@gmail.com)"
      ),
      telephone: Yup.string()
        .required("Vui lòng nhập SĐT")
        .matches(
          /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
          "Vui lòng nhập đúng số điện thoại (VD: 0794567833)"
        ),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.put(
          `http://localhost:3000/user/update-user/${user._id}`,
          values
        );
        console.log(res);
        message.success("Sửa thông tin thành công");
      } catch (error) {
        console.error("Error fetching hotel data:", error);
      }
      message.success("Sửa thông tin thành công!");
      console.log(values);
    },
  });
  useEffect(() => {
    formik.setValues({
      username: username || "lo",
      email: email || "",
      telephone: telephone || "",
    });
  }, [username, email, telephone]);
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setUser({ ...user, [name]: value });
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.put("/user/update", user);
  //     alert("Thông tin đã được cập nhật thành công!");
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //     alert("Đã có lỗi xảy ra khi cập nhật thông tin người dùng.");
  //   }
  // };
  // console.log("formik.values");

  // console.log(formik.values);
  console.log(formik.errors);
  return (
    <div>
      <HeaderUser />
      <div className="min-h-96 pt-3 px-72">
        <h2 className="text-center text-3xl font-normal pb-3">Trang cá nhân</h2>
        {user ? (
          <form onSubmit={formik.handleSubmit}>
            <p className="text-center text-sm">
              {user.username}, bạn có thể chỉnh sửa thông tin cá nhân của mình ở
              đây
            </p>
            <label>Tên người dùng</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              placeholder="Nhập username"
              className="rounded-md"
            />
            {formik.errors.username && (
              <p className="text-sm text-red-500 p-1">
                {formik.errors.username}
              </p>
            )}
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="Nhập email"
              className="rounded-md"
            />
            {formik.errors.email && (
              <p className="text-sm text-red-500 p-1">{formik.errors.email}</p>
            )}
            <label>Số điện thoại</label>
            <input
              type="text"
              name="telephone"
              value={formik.values.telephone}
              onChange={formik.handleChange}
              placeholder="Nhập SĐT"
              className="rounded-md"
            />
            {formik.errors.telephone && (
              <p className="text-sm text-red-500 py-2">
                {formik.errors.telephone}
              </p>
            )}
            <button type="submit" className="rounded-md">
              Cập nhật
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
