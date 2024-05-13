import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Popconfirm,
  Form,
  message,
  Space,
  Modal,
  Select,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import HeaderAdmin from "../components/HeaderAdmin";
import "../css_class/BookingPage.css";
import numeral from "numeral";

function BookingPage() {
  const navigate = useNavigate();
  const [bookings, setDataBookings] = React.useState([]);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [refresh, setRefresh] = React.useState(0);
  const [editFormVisible, setEditFormVisible] = React.useState(false);
  const [updateForm] = Form.useForm();
  const [status, setStatus] = React.useState([]);

  useEffect(() => {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (!accessToken) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/booking/getAll`)
      .then((response) => {
        setDataBookings(response.data);
      });
  }, [refresh]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/booking/status`)
      .then((response) => {
        setStatus(response.data);
      });
  }, [setStatus]);

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: ["user", "username"],
      key: "user",
      className: "wrap-text",
      render: (text, record) => {
        return <strong>{text}</strong>;
      },
    },
    {
      title: "Tên khách sạn",
      dataIndex: ["hotel", "nameHotel"],
      key: "hotel",
      className: "wrap-text",
      render: (text) => {
        return <strong>{text}</strong>;
      },
    },
    {
      title: "Khu vực",
      dataIndex: ["hotel", "district", "name"],
      key: "district",
      className: "wrap-text",
      render: (text) => {
        return <strong>{text}</strong>;
      },
    },
    {
      title: "Phòng đã đặt",
      dataIndex: "room",
      key: "room",
      className: "wrap-text",
      render: (text) => {
        return <strong>{text.name}</strong>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      className: "wrap-text",
      render: (statusData) => {
        return <strong>{statusData.status}</strong>;
      },
    },
    {
      title: "Ngày đặt phòng",
      dataIndex: "dayStay",
      key: "dayStay",
      className: "wrap-text",
      render: (text) => {
        return <strong>{text}</strong>;
      },
    },
    {
      title: "Thời gian cư trú",
      dataIndex: "hourStay",
      key: "hourStay",
      className: "wrap-text",
      render: (text) => {
        return <strong>{text}</strong>;
      },
    },
    {
      title: "Giá phòng",
      dataIndex: "price",
      key: "price",
      className: "wrap-text",
      render: (text) => {
        return <span>{numeral(text).format("0,0")}VND</span>;
      },
    },
    {
      title: "",
      key: "action",
      render: (text, record) => {
        if (record.images) {
          return (
            <Button
              onClick={() => {
                console.log("selectedRecord", record);
                // setSelectedRecord(record);
              }}
            >
              Xem
            </Button>
          );
        }
        return <React.Fragment></React.Fragment>;
      },
    },
    {
      title: "",
      key: "actions",
      width: "1%",
      render: (text, record) => {
        return (
          <Space>
            {/*BUTTON XÓA DỮ LIỆU */}
            <Popconfirm
              style={{ width: 800 }}
              title="Are you sure to delete?"
              onConfirm={() => {
                const id = record._id;
                axios
                  .delete(`${process.env.REACT_APP_API_URL}/booking/` + id)
                  .then((response) => {
                    message.success("Xóa thành công!");
                    setRefresh((f) => f + 1);
                  })
                  .catch((err) => {
                    message.error("Xóa bị lỗi!");
                  });
                console.log("DELETE", record);
              }}
              onCancel={() => {}}
              okText="Đồng ý"
              cancelText="Đóng"
            >
              <Button danger type="dashed" icon={<DeleteOutlined />} />
            </Popconfirm>
            {/*BUTTON UPDATE DỮ LIỆU */}
            <Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedRecord(record);
                updateForm.setFieldsValue(record);
                setEditFormVisible(true);
              }}
            />
          </Space>
        );
      },
    },
  ];

  const onUpdateFinish = async (values) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/booking/` + selectedRecord._id, {
        status: values.status,
      })
      .then((response) => {
        message.success("Cập nhật thành công!");
        updateForm.resetFields();
        setRefresh((f) => f + 1);
        setEditFormVisible(false);
      })
      .catch((err) => {
        message.error("Cập nhật bị lỗi!");
        updateForm.resetFields();
        setRefresh((f) => f + 1);
        setEditFormVisible(false);
      });
  };

  const onUpdateFinishFailed = (errors) => {
    console.log("🐣", errors);
  };

  return (
    <div>
      <HeaderAdmin />
      <h2 className="text-center text-3xl font-normal pb-3 text-red-500">
        Quản lý đặt phòng
      </h2>
      <Table
        rowKey="_id"
        dataSource={bookings}
        columns={columns}
        pagination={false}
        className="equal-width-columns"
      />
      <Modal
        centered
        open={editFormVisible}
        title="Cập nhật thông tin"
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setEditFormVisible(false);
        }}
        okText="Cập nhật trạng thái"
        cancelText="Đóng"
      >
        {/* FORM UPDATE ROOM */}
        <Form
          form={updateForm}
          name="update-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 26 }}
          initialValues={{ remember: true }}
          onFinish={onUpdateFinish}
          onFinishFailed={onUpdateFinishFailed}
          autoComplete="on"
        >
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Chưa chọn trạng thái" }]}
            hasFeedback
          >
            <Select
              style={{ width: 200 }}
              options={
                status &&
                status.map((c) => {
                  return {
                    value: c._id,
                    label: c.status,
                  };
                })
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default BookingPage;
