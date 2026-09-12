import { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Breadcrumb, Spin, Tag } from "antd";
import { FolderOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../api/axios";

const { Title } = Typography;

export default function ChapterList() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/subjects").then((res) => setSubject(res.data.find((s) => s.id === Number(subjectId))));
    api.get(`/chapters?subject_id=${subjectId}`).then((res) => {
      setChapters(res.data);
      setLoading(false);
    });
  }, [subjectId]);

  if (loading) return <Spin style={{ display: "block", margin: "60px auto" }} />;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <Breadcrumb
        items={[{ title: <Link to="/subjects">Môn học</Link> }, { title: subject?.name || "..." }]}
        style={{ marginBottom: 16 }}
      />
      <Title level={3}>{subject?.name} — Danh sách chương</Title>

      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} sm={12} md={8} style={{ display: "flex" }}>
          <Card
            hoverable
            onClick={() => navigate(`/subjects/${subjectId}/chapters/all/exams`)}
            style={{ width: "100%" }}
            styles={{ body: { height: "100%" } }}
          >
            <Card.Meta
              avatar={<AppstoreOutlined style={{ fontSize: 24, color: "#1677ff" }} />}
              title={
                <>
                  Đề thi tổng hợp <Tag color="blue">Toàn môn</Tag>
                </>
              }
              description="Bao quát toàn bộ môn học"
            />
          </Card>
        </Col>

        {chapters.map((c) => (
          <Col xs={24} sm={12} md={8} key={c.id} style={{ display: "flex" }}>
            <Card
              hoverable
              onClick={() => navigate(`/subjects/${subjectId}/chapters/${c.id}/exams`)}
              style={{ width: "100%" }}
              styles={{ body: { height: "100%" } }}
            >
              <Card.Meta
                avatar={<FolderOutlined style={{ fontSize: 24, color: "#faad14" }} />}
                title={c.name}
                description="Xem đề thi theo chương"
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}