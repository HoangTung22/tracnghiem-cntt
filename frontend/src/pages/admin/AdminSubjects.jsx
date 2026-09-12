import { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Spin, Empty, Button, Modal, Form, Input, message, Tag } from "antd";
import { BookOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const { Title } = Typography;

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const loadSubjects = () => {
    setLoading(true);
    api.get("/admin/subjects/overview").then((res) => {
      setSubjects(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleAdd = async (values) => {
    try {
      await api.post("/subjects", values);
      message.success("Thêm môn học thành công");
      form.resetFields();
      setModalOpen(false);
      loadSubjects();
    } catch (err) {
      message.error(err.response?.data?.detail || "Có lỗi xảy ra");
    }
  };

  if (loading) return <Spin style={{ display: "block", margin: "60px auto" }} />;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Môn học</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          Thêm môn học
        </Button>
      </div>

      {subjects.length === 0 && <Empty description="Chưa có môn học nào" />}

      <Row gutter={[16, 16]}>
        {subjects.map((s) => (
          <Col xs={24} sm={12} md={8} key={s.id}>
            <Card hoverable onClick={() => navigate(`/admin/subjects/${s.id}`)}>
              <Card.Meta
                avatar={<BookOutlined style={{ fontSize: 24, color: "#1677ff" }} />}
                title={s.name}
                description={`Mã môn: ${s.code}`}
              />
              <div style={{ marginTop: 12 }}>
                <Tag color="blue">{s.total_chapters} chương</Tag>
                <Tag color="gold">{s.total_questions} câu hỏi</Tag>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Thêm môn học"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="name" label="Tên môn học" rules={[{ required: true, message: "Vui lòng nhập tên môn học" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="Mã môn" rules={[{ required: true, message: "Vui lòng nhập mã môn" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}