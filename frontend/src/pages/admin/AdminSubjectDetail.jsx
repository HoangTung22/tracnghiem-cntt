import { useState, useEffect } from "react";
import {
  Typography, Breadcrumb, Button, Modal, Form, Input, Select, Radio, Space,
  Collapse, Table, Tag, Popconfirm, message, Spin, Empty, Upload, Alert, List,
} from "antd";
import {
  PlusOutlined, DeleteOutlined, MinusCircleOutlined, FolderOutlined,
  UploadOutlined, DownloadOutlined,
} from "@ant-design/icons";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

const { Title } = Typography;
const { TextArea } = Input;
const difficultyColors = { easy: "green", medium: "gold", hard: "red" };
const difficultyLabels = { easy: "Dễ", medium: "Trung bình", hard: "Khó" };

export default function AdminSubjectDetail() {
  const { subjectId } = useParams();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [chapterForm] = Form.useForm();

  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [questionForm] = Form.useForm();

  const [questionsByChapter, setQuestionsByChapter] = useState({});
  const [loadingChapterId, setLoadingChapterId] = useState(null);

  // --- Import Excel ---
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importChapterId, setImportChapterId] = useState(null);
  const [fileToImport, setFileToImport] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [importing, setImporting] = useState(false);

  const loadOverview = () => {
    setLoading(true);
    api.get(`/subjects/${subjectId}/overview`).then((res) => {
      setOverview(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadOverview();
  }, [subjectId]);

  const handleAddChapter = async (values) => {
    try {
      await api.post("/chapters", { name: values.name, subject_id: Number(subjectId) });
      message.success("Thêm chương thành công");
      chapterForm.resetFields();
      setChapterModalOpen(false);
      loadOverview();
    } catch (err) {
      message.error(err.response?.data?.detail || "Có lỗi xảy ra");
    }
  };

  const loadQuestionsForChapter = (chapterId) => {
    setLoadingChapterId(chapterId);
    api.get(`/questions?chapter_id=${chapterId}`).then((res) => {
      setQuestionsByChapter((prev) => ({ ...prev, [chapterId]: res.data }));
      setLoadingChapterId(null);
    });
  };

  const handlePanelChange = (activeKeys) => {
    activeKeys.forEach((key) => {
      if (!questionsByChapter[key]) loadQuestionsForChapter(key);
    });
  };

  const openQuestionModal = (chapterId) => {
    setActiveChapterId(chapterId);
    questionForm.resetFields();
    questionForm.setFieldsValue({
      difficulty: "medium",
      answers: [{ content: "" }, { content: "" }],
      correctIndex: 0,
    });
    setQuestionModalOpen(true);
  };

  const handleAddQuestion = async (values) => {
    const answers = values.answers.map((a, i) => ({
      content: a.content,
      is_correct: i === values.correctIndex,
    }));

    if (!answers.some((a) => a.is_correct)) {
      message.error("Vui lòng chọn 1 đáp án đúng");
      return;
    }

    try {
      await api.post("/questions", {
        content: values.content,
        difficulty: values.difficulty,
        chapter_id: activeChapterId,
        answers,
      });
      message.success("Thêm câu hỏi thành công");
      setQuestionModalOpen(false);
      loadQuestionsForChapter(activeChapterId);
      loadOverview();
    } catch (err) {
      message.error(err.response?.data?.detail || "Có lỗi xảy ra");
    }
  };

  const handleDeleteQuestion = async (chapterId, questionId) => {
    try {
      await api.delete(`/questions/${questionId}`);
      message.success("Đã xóa câu hỏi");
      loadQuestionsForChapter(chapterId);
      loadOverview();
    } catch (err) {
      message.error(err.response?.data?.detail || "Không thể xóa câu hỏi");
    }
  };

  // --- Import Excel handlers ---
  const openImportModal = (chapterId) => {
    setImportChapterId(chapterId);
    setFileToImport(null);
    setImportResult(null);
    setImportModalOpen(true);
  };

  const handleDownloadTemplate = async () => {
    try {
      const res = await api.get("/questions/import-template", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "mau_import_cau_hoi.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      message.error("Không thể tải file mẫu");
    }
  };

  const handleImport = async () => {
    if (!fileToImport) {
      message.error("Vui lòng chọn file Excel");
      return;
    }
    setImporting(true);
    const formData = new FormData();
    formData.append("file", fileToImport);
    formData.append("chapter_id", importChapterId);

    try {
      const res = await api.post("/questions/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImportResult(res.data);
      message.success(`Đã nhập ${res.data.success_count} câu hỏi`);
      loadQuestionsForChapter(importChapterId);
      loadOverview();
    } catch (err) {
      message.error(err.response?.data?.detail || "Có lỗi khi nhập file");
    } finally {
      setImporting(false);
    }
  };

  if (loading) return <Spin style={{ display: "block", margin: "60px auto" }} />;
  if (!overview) return <Empty description="Không tìm thấy môn học" />;

  const questionColumns = (chapterId) => [
    { title: "Nội dung", dataIndex: "content" },
    {
      title: "Độ khó", dataIndex: "difficulty", width: 120,
      render: (d) => <Tag color={difficultyColors[d]}>{difficultyLabels[d]}</Tag>,
    },
    { title: "Số đáp án", dataIndex: "answers", width: 100, render: (a) => a.length },
    {
      title: "", width: 70,
      render: (_, record) => (
        <Popconfirm title="Xóa câu hỏi này?" onConfirm={() => handleDeleteQuestion(chapterId, record.id)} okText="Xóa" cancelText="Hủy">
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  const collapseItems = overview.chapters.map((c) => ({
    key: String(c.id),
    label: (
      <Space wrap>
        <FolderOutlined style={{ color: "#faad14" }} />
        <b>{c.name}</b>
        <Tag>{c.question_count} câu hỏi</Tag>
      </Space>
    ),
    extra: (
      <Space wrap onClick={(e) => e.stopPropagation()}>
        <Button size="small" icon={<UploadOutlined />} onClick={() => openImportModal(c.id)}>
          Import Excel
        </Button>
        <Button size="small" type="primary" icon={<PlusOutlined />} onClick={() => openQuestionModal(c.id)}>
          Thêm câu hỏi
        </Button>
      </Space>
    ),
    children:
      loadingChapterId === c.id ? (
        <Spin />
      ) : (
        <Table
          columns={questionColumns(c.id)}
          dataSource={questionsByChapter[c.id] || []}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          size="small"
          scroll={{ x: "max-content" }}
        />
      ),
  }));

  return (
    <div>
      <Breadcrumb items={[{ title: <Link to="/admin/subjects">Môn học</Link> }, { title: overview.subject_name }]} style={{ marginBottom: 16 }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>{overview.subject_name}</Title>
          <Space style={{ marginTop: 4 }}>
            <Tag color="blue">{overview.total_chapters} chương</Tag>
            <Tag color="gold">{overview.total_questions} câu hỏi</Tag>
          </Space>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setChapterModalOpen(true)}>
          Thêm chương
        </Button>
      </div>

      {overview.chapters.length === 0 ? (
        <Empty description="Chưa có chương nào" style={{ marginTop: 40 }} />
      ) : (
        <Collapse items={collapseItems} onChange={handlePanelChange} style={{ marginTop: 16 }} />
      )}

      {/* Modal thêm chương */}
      <Modal title="Thêm chương" open={chapterModalOpen} onCancel={() => setChapterModalOpen(false)} onOk={() => chapterForm.submit()} okText="Lưu" cancelText="Hủy">
        <Form form={chapterForm} layout="vertical" onFinish={handleAddChapter}>
          <Form.Item name="name" label="Tên chương" rules={[{ required: true, message: "Vui lòng nhập tên chương" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thêm câu hỏi thủ công */}
      <Modal title="Thêm câu hỏi" open={questionModalOpen} onCancel={() => setQuestionModalOpen(false)} onOk={() => questionForm.submit()} okText="Lưu" cancelText="Hủy" width={600}>
        <Form form={questionForm} layout="vertical" onFinish={handleAddQuestion}>
          <Form.Item name="content" label="Nội dung câu hỏi" rules={[{ required: true, message: "Vui lòng nhập câu hỏi" }]}>
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item name="difficulty" label="Độ khó">
            <Select options={[
              { value: "easy", label: "Dễ" },
              { value: "medium", label: "Trung bình" },
              { value: "hard", label: "Khó" },
            ]} />
          </Form.Item>

          <Form.Item label="Đáp án (chọn radio ở đáp án đúng)">
            <Form.Item name="correctIndex" noStyle>
              <Radio.Group style={{ width: "100%" }}>
                <Form.List name="answers">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <Space key={field.key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                          <Radio value={index} />
                          <Form.Item {...field} name={[field.name, "content"]} rules={[{ required: true, message: "Nhập nội dung đáp án" }]} style={{ marginBottom: 0, width: 380 }}>
                            <Input placeholder={`Đáp án ${index + 1}`} />
                          </Form.Item>
                          {fields.length > 2 && <MinusCircleOutlined onClick={() => remove(field.name)} />}
                        </Space>
                      ))}
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        Thêm đáp án
                      </Button>
                    </>
                  )}
                </Form.List>
              </Radio.Group>
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Import Excel */}
      <Modal
        title="Import câu hỏi từ Excel"
        open={importModalOpen}
        onCancel={() => setImportModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setImportModalOpen(false)}>Đóng</Button>,
          <Button key="import" type="primary" loading={importing} onClick={handleImport}>Tải lên</Button>,
        ]}
      >
        <Button icon={<DownloadOutlined />} onClick={handleDownloadTemplate} style={{ marginBottom: 16 }} block>
          Tải file mẫu Excel
        </Button>

        <Upload
          beforeUpload={(file) => {
            setFileToImport(file);
            return false;
          }}
          onRemove={() => setFileToImport(null)}
          maxCount={1}
          accept=".xlsx,.xls"
        >
          <Button icon={<UploadOutlined />}>Chọn file Excel</Button>
        </Upload>

        {importResult && (
          <div style={{ marginTop: 16 }}>
            <Alert
              type={importResult.error_count > 0 ? "warning" : "success"}
              message={`Đã nhập thành công ${importResult.success_count} câu hỏi${importResult.error_count > 0 ? `, ${importResult.error_count} dòng lỗi` : ""}`}
              showIcon
            />
            {importResult.errors.length > 0 && (
              <List
                size="small"
                header="Chi tiết lỗi"
                dataSource={importResult.errors}
                renderItem={(e) => <List.Item>{e}</List.Item>}
                style={{ marginTop: 8, maxHeight: 200, overflowY: "auto" }}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}