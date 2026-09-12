import { Layout } from "antd";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminSubjects from "./pages/admin/AdminSubjects";
import AdminSubjectDetail from "./pages/admin/AdminSubjectDetail";
import CreateExam from "./pages/admin/CreateExam";
import SubjectList from "./pages/student/SubjectList";
import ChapterList from "./pages/student/ChapterList";
import ExamListByChapter from "./pages/student/ExamListByChapter";
import StatsPage from "./pages/student/StatsPage";
import AttemptHistory from "./pages/student/AttemptHistory";
import AttemptDetail from "./pages/student/AttemptDetail";
import TakeExam from "./pages/TakeExam";
import ExamResult from "./pages/ExamResult";
import ProtectedRoute from "./components/ProtectedRoute";

const { Content } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: "100vh", width: "100%" }}>
      <Navbar />
      <Content className="site-content" style={{ background: "#f5f7fa", width: "100%" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="subjects" element={<AdminSubjects />} />
            <Route path="subjects/:subjectId" element={<AdminSubjectDetail />} />
            <Route path="exams" element={<CreateExam />} />
          </Route>

          <Route path="/subjects" element={<ProtectedRoute><SubjectList /></ProtectedRoute>} />
          <Route path="/subjects/:subjectId/chapters" element={<ProtectedRoute><ChapterList /></ProtectedRoute>} />
          <Route path="/subjects/:subjectId/chapters/:chapterId/exams" element={<ProtectedRoute><ExamListByChapter /></ProtectedRoute>} />

          <Route path="/history" element={<ProtectedRoute><AttemptHistory /></ProtectedRoute>} />
          <Route path="/history/:attemptId" element={<ProtectedRoute><AttemptDetail /></ProtectedRoute>} />
          <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />

          <Route path="/exams/:examId/take" element={<ProtectedRoute><TakeExam /></ProtectedRoute>} />
          <Route path="/exams/:examId/result" element={<ProtectedRoute><ExamResult /></ProtectedRoute>} />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;