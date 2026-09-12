import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, InputNumber, message, Popconfirm, Tag, Space } from "antd";
import { PlusOutlined, DeleteOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import api from "../../api/axios";

export default function CreateExam() {
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const watchedSubject = Form.useWatch("subject_id", form);

  useEffect(() => {
    api.get("/subjects").then((res) => setSubjects(res.data));
    loadExams();
  }, []);

  useEffect(() => {
    if (watchedSubject) {
      api.get(`/chapters?subject_id=${watchedSubject}`).then((res) => setChapters(res.data));
    } else {
      setChapters([]);
    }
  }, [watchedSubject]);

  const loadExams = () => {
    setLoading(true);
    api.get("/exams?include_archived=true").then((res) => {
      setExams(res.data);
      setLoading(false);
    });
  };

  const openModal = () => {
    form.resetFields();
    form.setFieldsValue({ question_count: 10, duration_minutes: 30 });
    setModalOpen(true);
  };

  const handleCreate = async (values) => {
    try {
      const payload = { ...values };
      if (!payload.chapter_id) delete payload.chapter_id;
      if (!payload.difficulty) delete payload.difficulty;

      await api.post("/exams", payload);
      message.success("Tạo đề thi thành công");
      setModalOpen(false);
      loadExams();
    } catch (err) {
      message.error(err.response?.data?.detail || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/exams/${id}`);
      message.success("Đã xóa đề thi");
      loadExams();
    } catch (err) {
      message.error(err.response?.data?.detail || "Không thể xóa đề thi");
    }
  };

  const handleToggleArchive = async (id) => {
    try {
      const res = await api.patch(`/exams/${id}/archive`);
      message.success(res.data.is_archived ? "Đã ẩn đề thi" : "Đã hiện lại đề thi");
      loadExams();
    } catch (err) {
      message.error("Có lỗi xảy ra");
    }
  };

  const subjectName = (id) => subjects.find((s) => s.id === id)?.name || id;

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Tên đề", dataIndex: "title" },
    { title: "Môn học", dataIndex: "subject_id", render: subjectName },
    {
      title: "Phạm vi",
      dataIndex: "chapter_id",
      render: (c) => (c ? <Tag color="blue">Theo chương</Tag> : <Tag color="purple">Toàn môn</Tag>),
    },
    { title: "Số câu", dataIndex: "question_count", width: 90 },
    { title: "Thời gian", dataIndex: "duration_minutes", width: 100, render: (d) => `${d} phút` },
    {
      title: "Lượt làm",
      dataIndex: "attempts_count",
      width: 100,
      render: (c) => <Tag>{c} lượt</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_archived",
      width: 110,
      render: (archived) => (archived ? <Tag color="default">Đã ẩn</Tag> : <Tag color="green">Hoạt động</Tag>),
    },
    {
      title: "",
      width: 110,
      render: (_, record) =>
        record.attempts_count > 0 ? (
          <Popconfirm
            title={record.is_archived ? "Hiện lại đề thi này?" : "Ẩn đề thi này khỏi danh sách sinh viên?"}
            onConfirm={() => handleToggleArchive(record.id)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <Button icon={record.is_archived ? <EyeOutlined /> : <EyeInvisibleOutlined />} size="small">
              {record.is_archived ? "Hiện" : "Ẩn"}
            </Button>
          </Popconfirm>
        ) : (
          <Popconfirm title="Xóa đề thi này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        ),
    },
  ];

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={openModal} style={{ marginBottom: 16 }}>
        Tạo đề thi
      </Button>

      <Table columns={columns} dataSource={exams} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />

      <Modal
        title="Tạo đề thi"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="title" label="Tên đề thi" rules={[{ required: true, message: "Vui lòng nhập tên đề thi" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="subject_id" label="Môn học" rules={[{ required: true, message: "Vui lòng chọn môn học" }]}>
            <Select options={subjects.map((s) => ({ value: s.id, label: s.name }))} />
          </Form.Item>

          <Form.Item name="chapter_id" label="Chương (bỏ trống = đề tổng hợp cả môn)">
            <Select allowClear disabled={!watchedSubject} options={chapters.map((c) => ({ value: c.id, label: c.name }))} />
          </Form.Item>

          <Form.Item name="question_count" label="Số câu hỏi" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="duration_minutes" label="Thời gian (phút)" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="difficulty" label="Độ khó (bỏ trống = tất cả)">
            <Select
              allowClear
              options={[
                { value: "easy", label: "Dễ" },
                { value: "medium", label: "Trung bình" },
                { value: "hard", label: "Khó" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}