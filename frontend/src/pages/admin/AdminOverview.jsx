import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Typography, Spin } from "antd";
import {
  TeamOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  SolutionOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import api from "../../api/axios";

const { Title } = Typography;

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats/overview").then((res) => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spin style={{ display: "block", margin: "60px auto" }} />;
  if (!stats) return null;

  const cards = [
    { title: "Sinh viên", value: stats.total_students, icon: <TeamOutlined />, color: "#1677ff" },
    { title: "Câu hỏi", value: stats.total_questions, icon: <QuestionCircleOutlined />, color: "#faad14" },
    { title: "Đề thi", value: stats.total_exams, icon: <FileTextOutlined />, color: "#722ed1" },
    { title: "Lượt làm bài", value: stats.total_attempts, icon: <SolutionOutlined />, color: "#13c2c2" },
  ];

  return (
    <div>
      <Title level={3}>Tổng quan hệ thống</Title>
      <Row gutter={[16, 16]} align="stretch">
        {cards.map((c) => (
          <Col xs={24} sm={12} md={6} key={c.title} style={{ display: "flex" }}>
            <Card style={{ width: "100%" }}>
              <Statistic
                title={c.title}
                value={c.value}
                prefix={<span style={{ color: c.color }}>{c.icon}</span>}
              />
            </Card>
          </Col>
        ))}

        <Col xs={24} sm={12} md={6} style={{ display: "flex" }}>
          <Card style={{ width: "100%" }}>
            <Statistic
              title="Điểm trung bình toàn hệ thống"
              value={stats.average_score}
              suffix="/ 10"
              prefix={<RiseOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}