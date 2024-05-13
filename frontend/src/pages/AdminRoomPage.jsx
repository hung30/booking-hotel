import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Image,
  Table,
  Button,
  Popconfirm,
  Form,
  Input,
  message,
  Space,
  Modal,
  InputNumber,
  Select,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import HeaderAdmin from "../components/HeaderAdmin";
import "../css_class/AdminPage.css"
import numeral from 'numeral';

function AdminRoomPage() {
  const navigate = useNavigate();
  const [districts, setDistrict] = React.useState([]);
  const [hotels, setHotels] = React.useState([]);
  const [rooms, setRooms] = React.useState([]);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [refresh, setRefresh] = React.useState(0);
  const [editFormVisible, setEditFormVisible] = React.useState(false);

  const [createForm] = Form.useForm();
  const [addForm] = Form.useForm();


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
    axios.get("/hotel/all-room").then((response) => {
      setRooms(response.data);
    });
  }, [refresh]);

  useEffect(() => {
    axios.get("/hotel/district").then((response) => {
      setDistrict(response.data);
  
    });
  }, [refresh]);

  const columns = [
    {
      title: "Khu vực",
      dataIndex: "district",
      key: "district",
      className: "wrap-text",
      render: (text, record) => {
        return <strong>{record?.district?.name}</strong>;
      },
    },
    {
      title: "Tên phòng",
      dataIndex: "name",
      key: "name",
      className: "wrap-text",
      render: (text) => {
        return <strong>{text}</strong>;
      },
    },
    {
      title: "Thông tin mô tả",
      dataIndex: "description",
      key: "description",
      className: "wrap-text",
      render: (text) => {
        return <strong>{text}</strong>;
      },
    },
    {
      title: "Khoảng cách",
      dataIndex: "area",
      key: "area",
      className: "wrap-text",
      render: (text) => {
        return <strong>{text}</strong>;
      },
    },
    {
      title: "Loại phòng",
      dataIndex: "suitableFor",
      key: "suitableFor",
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
            return <span>{numeral(text).format('0,0')}VND</span>;
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
                  .delete("/hotel/delete-room/" + id)
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
            {/*BUTTON ADD DỮ LIỆU */}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedRecord(record);
         
                getHotelByDistrict(record.district._id);
                addForm.setFieldsValue(record);
                setEditFormVisible(true);
              }}
            />
          </Space>
        );
      },
    },
  ];

  const onFinish = (values) => {
    axios
      .post("/hotel/new-room",{
        name:values.name,
        district:values.district,
        description:values.description,
        area:values.area,
        suitableFor:values.suitableFor,
        price:values.price,
      })
      .then((response) => {
   
        message.success("Thêm mới thành công!");
        createForm.resetFields();
        setRefresh((f) => f + 1);
      })
      .catch((err) => {
        // Xử lý lỗi
        console.log(err.message);
        message.error("Thêm mới bị lỗi!");
      });
  };

  const onFinishFailed = (errors) => {
    console.log("🐣", errors);
  };

  const getHotelByDistrict = async (id) => {
    try {
      const res = await axios.get(`/hotel/get-by-district/${id}`);
      setHotels(res.data.hotels);
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      message.error(error.response.data.message);
      setRooms([]);
      return null;
    }
  };

  // UPDATE DỮ LIỆU
  const onAddFinish = async (values) => {
    axios
      .put("/hotel/add-room-hotel/"+ selectedRecord._id , {
        hotel:values.data
      })
      .then((response) => {
        message.success("Thêm phòng cho khách sạn thành công!");
        addForm.resetFields();
        setRefresh((f) => f + 1);
        setEditFormVisible(false);
      })
      .catch((err) => {
        message.error(err.response.data.message);
        addForm.resetFields();
        setRefresh((f) => f + 1);
        setEditFormVisible(false);
      });
  };

  const onAddFinishFailed = (errors) => {
    console.log("🐣", errors);
  };

  return (
    <div>
      <HeaderAdmin />
      <h2 className="text-center text-3xl font-normal pb-3 text-red-500">
          Quản lý phòng
        </h2>
      {/* FROM INPUT SẢN PHẨM */}
      <Form
        style={{width:'100%', margin:'0 auto'}}
        form={createForm}
        name="create-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="on"
      >
        <Form.Item
          label="Khu vực"
          name="district"
          rules={[{ required: true, message: "Chưa chọn khu vực" }]}
          hasFeedback
        >
          <Select
            style={{ width: 200 }}
            options={
              districts &&
              districts.map((c) => {
                return {
                  value: c._id,
                  label: c.name,
                };
              })
            }
          />
        </Form.Item>

        <Form.Item
          label="Tên phòng"
          name="name"
          rules={[{ required: true, message: "Chưa nhập Tên phòng" }]}
          hasFeedback
        >
          <Input style={{ width: 300 }} />
        </Form.Item>

        <Form.Item
          label="Thông tin mô tả"
          name="description"
          rules={[{ required: true, message: "Chưa nhập mô tả" }]}
          hasFeedback
        >
          <Input style={{ width: 300 }} />
        </Form.Item>

        <Form.Item
          label="Khoảnh cách"
          name="area"
          rules={[{ required: true, message: "Chưa nhập khoảng cách" }]}
          hasFeedback
        >
          <Input style={{ width: 300, marginLeft: 50 }} />
        </Form.Item>

        <Form.Item
          label="Loại phòng"
          name="suitableFor"
          rules={[{ required: true, message: "Chưa nhập loại phòng" }]}
          hasFeedback
        >
          <Input
            style={{ width: 300, marginLeft: 50 }}
          />
        </Form.Item>

        <Form.Item
          label="Giá phòng"
          name="price"
          rules={[{ required: true, message: "Chưa nhập giá phòng" }]}
          hasFeedback
        >
          <Input
            style={{ width: 300, marginLeft: 50 }}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Lưu thông tin
          </Button>
        </Form.Item>
      </Form>
      <Table
        rowKey="_id"
        dataSource={rooms}
        columns={columns}
        pagination={false}
        className="equal-width-columns"
      />
      <Modal
        centered
        open={editFormVisible}
        title="Cập nhật thông tin"
        onOk={() => {
          addForm.submit();
        }}
        onCancel={() => {
          setEditFormVisible(false);
        }}
        okText="Thêm phòng vào khách sạn"
        cancelText="Đóng"
      >
        {/* FORM ADD ROOM */}
        <Form
          form={addForm}
          name="add-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 26 }}
          initialValues={{ remember: true }}
          onFinish={onAddFinish}
          onFinishFailed={onAddFinishFailed}
          autoComplete="on"
        >
          <Form.Item
          label="Tên khách sạn"
          name="data"
          rules={[{ required: true, message: "Chưa chọn khách sạn" }]}
          hasFeedback
        >
          <Select
            style={{ width: 200 }}
            options={
                hotels &&
                hotels.map((c) => {
                  return {
                    value: c._id,
                    label: c.nameHotel,
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

export default AdminRoomPage;
