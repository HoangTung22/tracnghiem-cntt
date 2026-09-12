import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Result, Statistic, Row, Col, List, Tag, Button, Typography, Spin, Breadcrumb } from "antd";
import { TrophyOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const { Title } = Typography;

export default function AttemptDetail() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/attempts/${attemptId}`).then((res) => {
      setAttempt(res.data);
      setLoading(false);
    });
  }, [attemptId]);

  if (loading) return <Spin style={{ display: "block", margin: "60px auto" }} />;
  if (!attempt) return null;

  const isPass = attempt.score >= 5;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Breadcrumb items={[{ title: <Link to="/history">Lịch sử làm bài</Link> }, { title: attempt.exam_title }]} style={{ marginBottom: 16 }} />

      <Card style={{ marginBottom: 24, textAlign: "center" }}>
        <Result
          icon={<TrophyOutlined style={{ color: isPass ? "#faad14" : "#999" }} />}
          title={attempt.exam_title}
          subTitle={`Làm lúc: ${new Date(attempt.started_at).toLocaleString("vi-VN")}`}
        />
        <Row gutter={16} justify="center">
          <Col span={8}>
            <Statistic title="Điểm" value={attempt.score} suffix="/ 10" />
          </Col>
          <Col span={8}>
            <Statistic title="Câu đúng" value={attempt.correct_count} valueStyle={{ color: "#3f8600" }} />
          </Col>
          <Col span={8}>
            <Statistic title="Câu sai" value={attempt.total_questions - attempt.correct_count} valueStyle={{ color: "#cf1322" }} />
          </Col>
        </Row>
      </Card>

      <Title level={4}>Chi tiết từng câu</Title>
      <List
        dataSource={attempt.details}
        renderItem={(d, index) => (
          <List.Item>
            <Card style={{ width: "100%", borderLeft: `4px solid ${d.is_correct ? "#52c41a" : "#ff4d4f"}` }} size="small">
              <p><b>Câu {index + 1}:</b> {d.question_content}</p>
              <p>Bạn chọn: {d.selected_answer_content}</p>
              {!d.is_correct && <p>Đáp án đúng: {d.correct_answer_content}</p>}
              <Tag icon={d.is_correct ? <CheckCircleOutlined /> : <CloseCircleOutlined />} color={d.is_correct ? "success" : "error"}>
                {d.is_correct ? "Trả lời đúng" : "Trả lời sai"}
              </Tag>
            </Card>
          </List.Item>
        )}
      />

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Button type="primary" onClick={() => navigate("/history")}>Về lịch sử làm bài</Button>
      </div>
    </div>
  );
}