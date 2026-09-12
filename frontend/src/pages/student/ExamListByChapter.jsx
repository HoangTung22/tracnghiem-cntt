import { useState, useEffect } from "react";
import { List, Card, Typography, Breadcrumb, Tag, Button, Spin, Empty } from "antd";
import { ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../api/axios";

const { Title } = Typography;

export default function ExamListByChapter() {
  const { subjectId, chapterId } = useParams();
  const [subject, setSubject] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAll = chapterId === "all";

  useEffect(() => {
    api.get("/subjects").then((res) => setSubject(res.data.find((s) => s.id === Number(subjectId))));

    if (!isAll) {
      api.get(`/chapters?subject_id=${subjectId}`).then((res) => setChapter(res.data.find((c) => c.id === Number(chapterId))));
    }

    const query = isAll
      ? `/exams?subject_id=${subjectId}&subject_wide=true`
      : `/exams?subject_id=${subjectId}&chapter_id=${chapterId}`;

    api.get(query).then((res) => {
      setExams(res.data);
      setLoading(false);
    });
  }, [subjectId, chapterId]);

  if (loading) return <Spin style={{ display: "block", margin: "60px auto" }} />;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <Breadcrumb
        items={[
          { title: <Link to="/subjects">Môn học</Link> },
          { title: <Link to={`/subjects/${subjectId}/chapters`}>{subject?.name || "..."}</Link> },
          { title: isAll ? "Đề tổng hợp" : chapter?.name || "..." },
        ]}
        style={{ marginBottom: 16 }}
      />
      <Title level={3}>Danh sách đề thi</Title>

      {exams.length === 0 && <Empty description="Chưa có đề thi nào" />}

      <List
        dataSource={exams}
        renderItem={(ex) => (
          <List.Item>
            <Card style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <FileTextOutlined style={{ marginRight: 8, color: "#1677ff" }} />
                  <b>{ex.title}</b>
                  <div style={{ marginTop: 6 }}>
                    <Tag>{ex.question_count} câu</Tag>
                    <Tag icon={<ClockCircleOutlined />}>{ex.duration_minutes} phút</Tag>
                  </div>
                </div>
                <Button type="primary" onClick={() => navigate(`/exams/${ex.id}/take`)}>
                  Bắt đầu làm bài
                </Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}