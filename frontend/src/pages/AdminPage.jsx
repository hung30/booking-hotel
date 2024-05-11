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
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import HeaderAdmin from "../components/HeaderAdmin";
import "../css_class/AdminPage.css"

function AdminPage() {
  const navigate = useNavigate();
  const [isPreview, setIsPreview] = React.useState(false);
  const [districts, setDistrict] = React.useState([]);
  const [hotels, setHotel] = React.useState([]);
  const [rooms, setRooms] = React.useState([]);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [refresh, setRefresh] = React.useState(0);
  const [editFormVisible, setEditFormVisible] = React.useState(false);

  const [file, setFile] = React.useState(null);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [updateImage, setUpdateImage] = React.useState(null);
  const [oldImage, setOldImage] = React.useState(null);

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
    axios.get("/hotel").then((response) => {
      setHotel(response.data);
      // console.log(response.data);
    });
  }, [refresh]);

  useEffect(() => {
    axios.get("/hotel/district").then((response) => {
      setDistrict(response.data);
      console.log(response.data);
    });
  }, [refresh]);

  // Hardcoded data for rooms
  const handleDistrictChange = async (id) => {
    try {
      const res = await axios.get(`/hotel/room-from-district/${id}`);
      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      message.error(error.response.data.message);
      setRooms([]);
      return null;
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      key: "image",
      dataIndex: "image",
      width: "1%",
      className: "w-full md:w-1/6",
      render: (text, record) => {
        return (
          <div>
            {text && (
              <React.Fragment>
                <Image
                  onClick={() => {
                    setSelectedRecord(record);
                    setIsPreview(true);
                  }}
                  preview={{
                    visible: false,
                  }}
                  width={60}
                  src={text.src}
                />
                <div
                  style={{
                    display: "none",
                  }}
                >
                  <Image.PreviewGroup
                    preview={{
                      visible: isPreview && record._id === selectedRecord?._id,
                      onVisibleChange: (vis) => setIsPreview(vis),
                    }}
                  >
                    <Image src={text.src} />
                    {record &&
                      record.images &&
                      record.images.map((image) => {
                        return <Image key={image} src={text.src} />;
                      })}
                  </Image.PreviewGroup>
                </div>
              </React.Fragment>
            )}
          </div>
        );
      },
    },
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
      title: "Tên khách sạn",
      dataIndex: "nameHotel",
      key: "nameHotel",
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
      title: "Khoảng cách đến trung tâm",
      dataIndex: "distanceFormCenter",
      key: "distanceFormCenter",
      className: "wrap-text",
      render: (text) => {
        return <strong>{text}</strong>;
      },
    },
    {
      title: "Điểm đánh giá",
      dataIndex: "evaluate",
      key: "evaluate",
      className: "wrap-text",
      render: (text) => {
        return <strong>{text}</strong>;
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
                  .delete("/hotel/delete-hotel/" + id)
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
                // console.log(record);
                setOldImage(record.image);
                updateForm.setFieldsValue(record);
                setEditFormVisible(true);
              }}
            />
          </Space>
        );
      },
    },
  ];

  const onFinish = (values) => {
    let data = new FormData();

    // Thêm dữ liệu vào FormData
    data.append("district", values.district);
    data.append("room", values.room);
    data.append("nameHotel", values.nameHotel);
    data.append("description", values.description);
    data.append("distanceFormCenter", values.distanceFormCenter);
    data.append("evaluate", values.evaluate);
    data.append("image", values.image.file);

    // Gửi yêu cầu POST bằng axios
    axios
      .post("/hotel/new-hotel", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        message.success("Thêm mới thành công!");
        createForm.resetFields();
        setRefresh((f) => f + 1);
      })
      .catch((err) => {
        // Xử lý lỗi
        console.log(err);
        message.error("Thêm mới bị lỗi!");
      });
  };

  const onFinishFailed = (errors) => {
    console.log("🐣", errors);
  };

  // UPDATE DỮ LIỆU
  async function urlToFile(url, filename, mimeType) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  }

  const onUpdateFinish = async (values) => {
    let data = new FormData();
    data.append("nameHotel", values.nameHotel);
    data.append("description", values.description);
    data.append("evaluate", values.evaluate);
    if (oldImage) {
      const filename = "image.jpg";
      const mimeType = "image/jpeg";

      try {
        const file = await urlToFile(oldImage.src, filename, mimeType);
        data.append("image", file);
      } catch (error) {
        console.error("Error converting oldImage URL to File:", error);
      }
    } else if (values.image && values.image.file) {
      data.append("image", values.image.file);
    }
    axios
      .put("/hotel/update-hotel/" + selectedRecord._id, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        message.success("Cập nhật thành công!");
        updateForm.resetFields();
        setRefresh((f) => f + 1);
        setEditFormVisible(false);
      })
      .catch((err) => {
        message.error("Cập nhật bị lỗi!");
      });
  };

  const onUpdateFinishFailed = (errors) => {
    console.log("🐣", errors);
  };

  return (
    <div>
      <HeaderAdmin />
      {/* FROM INPUT SẢN PHẨM */}
      <Form
        form={createForm}
        name="create-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="on"
      >
        <h2 className="text-center text-3xl font-normal pb-3 text-red-500">
          Quản lý khách sạn
        </h2>
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
            onChange={handleDistrictChange}
          />
        </Form.Item>

        <Form.Item
          label="Phòng"
          name="room"
          rules={[{ required: true, message: "Chưa chọn phòng" }]}
          hasFeedback
        >
          <Select
            style={{ width: 400 }}
            options={rooms.map((room) => {
              return {
                value: room._id,
                label: room.name,
              };
            })}
          />
        </Form.Item>

        <Form.Item
          label="Tên khách sạn"
          name="nameHotel"
          rules={[{ required: true, message: "Chưa nhập Tên khách sạn" }]}
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
          label="Khoảnh cách đến trung tâm"
          name="distanceFormCenter"
          rules={[{ required: true, message: "Chưa nhập khoảng cách" }]}
          hasFeedback
        >
          <Input style={{ width: 300, marginLeft: 50 }} />
        </Form.Item>

        <Form.Item
          label="Đánh giá"
          name="evaluate"
          rules={[{ required: true, message: "Chưa nhập đánh giá" }]}
          hasFeedback
        >
          <Input
            type="number"
            min={1}
            max={5}
            style={{ width: 300, marginLeft: 50 }}
          />
        </Form.Item>

        <Form.Item label="Hình minh họa" name="image">
          <Upload
            showUploadList={true}
            beforeUpload={(image) => {
              setFile(image);
              return false;
            }}
          >
            <Button style={{ marginLeft: 50 }} icon={<UploadOutlined />}>
              Chọn hình ảnh
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Lưu thông tin
          </Button>
        </Form.Item>
      </Form>
      <Table
        rowKey="_id"
        dataSource={hotels}
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
        okText="Lưu thông tin"
        cancelText="Đóng"
      >
        {/* FORM UPDATE SẢN PHẨM */}
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
            label="Tên khách sạn"
            name="nameHotel"
            rules={[{ required: true, message: "Chưa nhập Tên khách sạn" }]}
            hasFeedback
          >
            <Input style={{ width: 300 }} />
          </Form.Item>

          <Form.Item
            label="Thông tin mô tả"
            name="description"
            rules={[{ required: true, message: "Chưa chỉnh mô tả" }]}
            hasFeedback
          >
            <Input style={{ width: 300 }} />
          </Form.Item>

          <Form.Item
            label="Đánh giá"
            name="evaluate"
            rules={[{ required: true, message: "Chưa nhập đánh giá" }]}
            hasFeedback
          >
            <Input type="number" min={1} max={5} style={{ width: 300 }} />
          </Form.Item>

          <Form.Item label="Hình minh họa" name="image">
            <Upload
              showUploadList={true}
              beforeUpload={(image) => {
                setUpdateImage(image);
                return false;
              }}
            >
              <Button style={{ marginLeft: 50 }} icon={<UploadOutlined />}>
                Chọn hình ảnh
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminPage;
