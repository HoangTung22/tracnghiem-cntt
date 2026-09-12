import { useState, useEffect } from "react";
import { Table, Typography, Tag, Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const { Title } = Typography;

export default function AttemptHistory() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/attempts/me").then((res) => {
      setAttempts(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spin style={{ display: "block", margin: "60px auto" }} />;

  const columns = [
    { title: "Đề thi", dataIndex: "exam_title" },
    {
      title: "Điểm",
      dataIndex: "score",
      width: 100,
      render: (score) => (
        <Tag color={score >= 5 ? "success" : "error"} style={{ fontSize: 14 }}>
          {score} / 10
        </Tag>
      ),
    },
    {
      title: "Thời gian làm bài",
      dataIndex: "started_at",
      render: (v) => new Date(v).toLocaleString("vi-VN"),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <Title level={3}>Lịch sử làm bài</Title>
      {attempts.length === 0 ? (
        <Empty description="Bạn chưa làm bài thi nào" />
      ) : (
        <Table
          columns={columns}
          dataSource={attempts}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => navigate(`/history/${record.id}`),
            style: { cursor: "pointer" },
          })}
        />
      )}
    </div>
  );
}