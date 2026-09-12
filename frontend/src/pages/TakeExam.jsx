import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Radio, Row, Col, Typography, Progress, Space, Button, Spin, Modal, Tag } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import api from "../api/axios";

const { Title, Text } = Typography;

export default function TakeExam() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);
  const questionRefs = useRef({});

  useEffect(() => {
    api.get(`/exams/${examId}`).then((res) => {
      setExam(res.data);
      setSecondsLeft(res.data.duration_minutes * 60);
    });
  }, [examId]);

  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) {
      doSubmit();
      return;
    }
    timerRef.current = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [secondsLeft]);

  const handleSelect = (questionId, answerId) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const scrollToQuestion = (questionId) => {
    questionRefs.current[questionId]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const doSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    clearTimeout(timerRef.current);

    const answers = Object.entries(selectedAnswers).map(([question_id, selected_answer_id]) => ({
      question_id: Number(question_id),
      selected_answer_id: Number(selected_answer_id),
    }));

    try {
      const res = await api.post(`/exams/${examId}/submit`, { answers });
      navigate(`/exams/${examId}/result`, { state: { result: res.data } });
    } catch (err) {
      Modal.error({
        title: "Nộp bài thất bại",
        content: err.response?.data?.detail || err.message || "Có lỗi không xác định, vui lòng thử lại.",
      });
      setSubmitting(false);
    }
  };

  const handleSubmitClick = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    const unanswered = exam.questions.length - answeredCount;

    if (unanswered > 0) {
      Modal.confirm({
        title: "Xác nhận nộp bài",
        content: `Bạn còn ${unanswered} câu chưa trả lời. Bạn có chắc muốn nộp bài không?`,
        okText: "Nộp bài",
        cancelText: "Tiếp tục làm",
        onOk: doSubmit,
      });
    } else {
      doSubmit();
    }
  };

  if (!exam) return <Spin style={{ display: "block", margin: "60px auto" }} />;

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = exam.questions.length;
  const percentDone = Math.round((answeredCount / totalQuestions) * 100);
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>{exam.title}</Title>
        <Tag icon={<ClockCircleOutlined />} color={secondsLeft < 60 ? "red" : "blue"} style={{ fontSize: 16, padding: "4px 12px" }}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </Tag>
      </div>

      <Row gutter={24}>
        <Col xs={24} md={7}>
          <Card
            style={{ position: "sticky", top: 24, borderRadius: 12, overflow: "hidden" }}
            styles={{ header: { background: "#f0f5ff", fontWeight: 600 } }}
            title="Danh sách câu hỏi"
          >
            <Text type="secondary">Đã làm {answeredCount}/{totalQuestions} câu</Text>
            <Progress percent={percentDone} size="small" style={{ marginBottom: 16, marginTop: 8 }} />

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {exam.questions.map((q, index) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                return (
                  <Button
                    key={q.id}
                    shape="circle"
                    size="small"
                    type={isAnswered ? "primary" : "default"}
                    onClick={() => scrollToQuestion(q.id)}
                  >
                    {index + 1}
                  </Button>
                );
              })}
            </div>

            <Button type="primary" danger block size="large" loading={submitting} onClick={handleSubmitClick}>
              Nộp bài
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={17}>
          {exam.questions.map((q, index) => (
            <Card
              key={q.id}
              ref={(el) => (questionRefs.current[q.id] = el)}
              style={{ marginBottom: 16, borderRadius: 12, overflow: "hidden" }}
              styles={{
                header: { background: "#1677ff", fontWeight: 600 },
                body: { paddingTop: 16 },
              }}
              title={`Câu ${index + 1}: ${q.content}`}
            >
              <Radio.Group
                onChange={(e) => handleSelect(q.id, e.target.value)}
                value={selectedAnswers[q.id]}
                style={{ width: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  {q.answers.map((a) => (
                    <Radio key={a.id} value={a.id} style={{ width: "100%", padding: "4px 0" }}>
                      {a.content}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Card>
          ))}
        </Col>
      </Row>
    </div>
  );
}