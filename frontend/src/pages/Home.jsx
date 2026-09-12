import { Link, Navigate } from "react-router-dom";
import { Button, Row, Col, Typography, Card } from "antd";
import { BookOutlined, ThunderboltOutlined, BarChartOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

const { Title, Paragraph } = Typography;

const features = [
  {
    icon: <BookOutlined />,
    title: "Ngân hàng câu hỏi phong phú",
    desc: "Câu hỏi được tổ chức theo môn học và chương, dễ dàng ôn tập đúng trọng tâm.",
  },
  {
    icon: <ThunderboltOutlined />,
    title: "Đề thi trộn ngẫu nhiên",
    desc: "Mỗi lần làm bài là một đề khác nhau, tránh học tủ, học vẹt.",
  },
  {
    icon: <ClockCircleOutlined />,
    title: "Thi có tính giờ",
    desc: "Rèn luyện tốc độ làm bài với đồng hồ đếm ngược, tự nộp khi hết giờ.",
  },
  {
    icon: <BarChartOutlined />,
    title: "Thống kê chi tiết",
    desc: "Theo dõi tiến bộ học tập theo từng môn, từng chương theo thời gian.",
  },
];

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/subjects"} replace />;
  }

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
          borderRadius: 16,
          padding: "64px 24px",
          textAlign: "center",
          color: "#fff",
          marginBottom: 40,
        }}
      >
        <Title style={{ color: "#fff", marginBottom: 12 }}>Ôn tập trắc nghiệm CNTT</Title>
        <Paragraph
          style={{
            color: "rgba(255,255,255,0.88)",
            fontSize: 16,
            maxWidth: 620,
            margin: "0 auto 32px",
          }}
        >
          Nền tảng luyện thi trắc nghiệm dành cho sinh viên ngành Công nghệ thông tin — làm bài,
          chấm điểm tự động và theo dõi kết quả học tập theo thời gian thực.
        </Paragraph>
        <Link to="/register">
          <Button
            type="primary"
            size="large"
            style={{ marginRight: 12, background: "#fff", color: "#1677ff", borderColor: "#fff" }}
          >
            Bắt đầu ngay
          </Button>
        </Link>
        <Link to="/login">
          <Button size="large" ghost>
            Đăng nhập
          </Button>
        </Link>
      </div>

      <Row gutter={[24, 24]} style={{ maxWidth: 1100, margin: "0 auto" }}>
        {features.map((f) => (
          <Col xs={24} sm={12} md={6} key={f.title} style={{ display: "flex" }}>
            <Card style={{ width: "100%", textAlign: "center" }} styles={{ body: { height: "100%" } }}>
              <div style={{ fontSize: 32, color: "#1677ff", marginBottom: 12 }}>{f.icon}</div>
              <Title level={5}>{f.title}</Title>
              <Paragraph type="secondary" style={{ fontSize: 13, marginBottom: 0 }}>
                {f.desc}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}