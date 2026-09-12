import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Progress, Typography, Spin, Empty } from "antd";
import { TrophyOutlined, FileDoneOutlined, RiseOutlined } from "@ant-design/icons";
import api from "../../api/axios";

const { Title } = Typography;

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/stats/me").then((res) => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spin style={{ display: "block", margin: "60px auto" }} />;
  if (!stats) return <Empty description="Chưa có dữ liệu thống kê" />;

  const columns = [
    { title: "Môn học", dataIndex: "subject_name", width: 160 },
    { title: "Chương", dataIndex: "chapter_name" },
    { title: "Số câu đã làm", dataIndex: "total_answered", width: 130 },
    { title: "Số câu đúng", dataIndex: "correct_count", width: 120 },
    {
      title: "Tỉ lệ đúng",
      dataIndex: "accuracy",
      render: (a) => <Progress percent={a} size="small" status={a >= 50 ? "success" : "exception"} />,
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <Title level={3}>Thống kê kết quả học tập</Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Số lần làm bài" value={stats.total_attempts} prefix={<FileDoneOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Điểm trung bình" value={stats.average_score} suffix="/ 10" prefix={<RiseOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Điểm cao nhất"
              value={stats.highest_score}
              suffix="/ 10"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      <Title level={4}>Chi tiết theo chương</Title>
      {stats.by_chapter.length === 0 ? (
        <Empty description="Chưa có dữ liệu theo chương" />
      ) : (
        <Table columns={columns} dataSource={stats.by_chapter} rowKey="chapter_id" pagination={false} />
      )}
    </div>
  );
}