import { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Spin, Empty } from "antd";
import { BookOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const { Title } = Typography;

export default function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/subjects").then((res) => {
      setSubjects(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spin style={{ display: "block", margin: "60px auto" }} />;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <Title level={3}>Chọn môn học</Title>
      {subjects.length === 0 && <Empty description="Chưa có môn học nào" />}
      <Row gutter={[16, 16]} align="stretch">
        {subjects.map((s) => (
          <Col xs={24} sm={12} md={8} key={s.id} style={{ display: "flex" }}>
            <Card
              hoverable
              onClick={() => navigate(`/subjects/${s.id}/chapters`)}
              style={{ width: "100%" }}
              styles={{ body: { height: "100%" } }}
            >
              <Card.Meta
                avatar={<BookOutlined style={{ fontSize: 24, color: "#1677ff" }} />}
                title={s.name}
                description={`Mã môn: ${s.code}`}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}