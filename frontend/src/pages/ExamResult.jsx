import { useLocation, useNavigate } from "react-router-dom";
import { Card, Result, Statistic, Row, Col, List, Tag, Button, Typography } from "antd";
import { TrophyOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function ExamResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div style={{ textAlign: "center", marginTop: 60 }}>
        <p>Không có dữ liệu kết quả.</p>
        <Button onClick={() => navigate("/subjects")}>Về danh sách môn học</Button>
      </div>
    );
  }

  const isPass = result.score >= 5;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Card style={{ marginBottom: 24, textAlign: "center" }}>
        <Result
          icon={<TrophyOutlined style={{ color: isPass ? "#faad14" : "#999" }} />}
          title={`Điểm số: ${result.score} / 10`}
          subTitle={`Bạn trả lời đúng ${result.correct_count}/${result.total_questions} câu`}
        />
        <Row gutter={16} justify="center">
          <Col span={8}>
            <Statistic title="Điểm" value={result.score} suffix="/ 10" />
          </Col>
          <Col span={8}>
            <Statistic title="Câu đúng" value={result.correct_count} valueStyle={{ color: "#3f8600" }} />
          </Col>
          <Col span={8}>
            <Statistic title="Câu sai" value={result.total_questions - result.correct_count} valueStyle={{ color: "#cf1322" }} />
          </Col>
        </Row>
      </Card>

      <Title level={4}>Chi tiết từng câu</Title>
      <List
        dataSource={result.details}
        renderItem={(d, index) => (
          <List.Item>
            <Card
              style={{ width: "100%", borderLeft: `4px solid ${d.is_correct ? "#52c41a" : "#ff4d4f"}` }}
              size="small"
            >
              <p><b>Câu {index + 1}:</b> {d.question_content}</p>
              <Tag
                icon={d.is_correct ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                color={d.is_correct ? "success" : "error"}
              >
                {d.is_correct ? "Trả lời đúng" : "Trả lời sai"}
              </Tag>
            </Card>
          </List.Item>
        )}
      />

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Button type="primary" onClick={() => navigate("/subjects")}>
          Về danh sách môn học
        </Button>
      </div>
    </div>
  );
}