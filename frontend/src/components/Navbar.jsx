import { Layout, Menu, Dropdown, Avatar, Space } from "antd";
import { UserOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReadOutlined } from "@ant-design/icons";


const { Header } = Layout;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const menuItems =
    user.role === "admin"
      ? [{ key: "admin", label: <Link to="/admin">Quản trị</Link> }]
      : [
          { key: "exams", label: <Link to="/subjects">Đề thi</Link> },
          { key: "history", label: <Link to="/history">Lịch sử</Link> },
          { key: "stats", label: <Link to="/stats">Thống kê</Link> },
        ];

  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: () => {
        logout();
        navigate("/login");
      },
    },
  ];

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(90deg, #1677ff 0%, #0958d9 100%)",
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: "0 0 8px 8px",
      }}
    >
     <Link
  to="/"
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 700,
    fontSize: 18,
    color: "#fff",
  }}
>
  <ReadOutlined style={{ fontSize: 22 }} />
  TN CNTT
</Link>

      <Menu
        mode="horizontal"
        theme="dark"
        items={menuItems}
        style={{ flex: 1, marginLeft: 40, borderBottom: "none", background: "transparent" }}
      />

      <Dropdown menu={{ items: userMenuItems }}>
        <Space style={{ cursor: "pointer", color: "#fff" }}>
          <Avatar icon={<UserOutlined />} size="small" style={{ background: "rgba(255,255,255,0.25)" }} />
          <span style={{ color: "#fff" }}>{user.name}</span>
          <DownOutlined style={{ fontSize: 10, color: "#fff" }} />
        </Space>
      </Dropdown>
    </Header>
  );
}