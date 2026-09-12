import { Layout, Menu } from "antd";
import { DashboardOutlined, BookOutlined, FileTextOutlined } from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Sider, Content } = Layout;

const menuItems = [
  { key: "", icon: <DashboardOutlined />, label: "Tổng quan" },
  { key: "subjects", icon: <BookOutlined />, label: "Môn học" },
  { key: "exams", icon: <FileTextOutlined />, label: "Đề thi" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  let selectedKey = "";
  if (location.pathname.startsWith("/admin/exams")) selectedKey = "exams";
  else if (location.pathname.startsWith("/admin/subjects")) selectedKey = "subjects";

  return (
    <Layout
      style={{
        background: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        minHeight: 600,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      <Sider
        width={220}
        theme="light"
        breakpoint="md"
        collapsedWidth={0}
        style={{ borderRight: "1px solid #f0f0f0" }}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={(e) => navigate(e.key === "" ? "/admin" : `/admin/${e.key}`)}
          style={{ height: "100%", borderRight: 0 }}
        />
      </Sider>
      <Content style={{ padding: 24, minWidth: 0 }}>
        <Outlet />
      </Content>
    </Layout>
  );
}