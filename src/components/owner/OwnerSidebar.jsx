import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserOutlined,
  TeamOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  SettingOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Button, Avatar, Typography, Divider } from 'antd'
import PropTypes from 'prop-types'
import './OwnerSidebar.css'

const { Sider } = Layout
const { Title, Text } = Typography

// Custom modal component không phụ thuộc vào Ant Design Modal
const LogoutModal = ({ visible, onOk, onCancel }) => {
  if (!visible) return null

  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal-content">
        <div className="logout-modal-header">
          <ExclamationCircleOutlined className="logout-modal-icon" />
          <h3>Đăng xuất</h3>
        </div>
        <div className="logout-modal-body">
          <p>Bạn có chắc chắn muốn đăng xuất?</p>
        </div>
        <div className="logout-modal-footer">
          <button className="logout-modal-button cancel" onClick={onCancel}>
            Hủy
          </button>
          <button className="logout-modal-button confirm" onClick={onOk}>
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  )
}

const OwnerSidebar = ({ selectedMenu, setSelectedMenu }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')
  const [logoutModalVisible, setLogoutModalVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const storedUserName = localStorage.getItem('userName')
    const storedRole =
      localStorage.getItem('role_name') || localStorage.getItem('role')

    if (storedUserName) setUserName(storedUserName)
    if (storedRole) setUserRole(storedRole)
  }, [])

  // Thay đổi cách xử lý menu item để đảm bảo navigation hoạt động trong cả hai trạng thái
  const handleMenuClick = (menuKey, path) => {
    setSelectedMenu(menuKey)
    navigate(path) // Sử dụng navigate trực tiếp thay vì dựa vào Link
  }

  const showLogoutModal = () => {
    console.log('Showing logout modal')
    setLogoutModalVisible(true)
  }

  const handleLogoutConfirm = () => {
    console.log('Logout confirmed')
    // Xóa tất cả dữ liệu trong localStorage
    localStorage.clear()
    // Chuyển hướng về trang chủ
    navigate('/')
  }

  const handleLogoutCancel = () => {
    setLogoutModalVisible(false)
  }

  const menuItems = [
    {
      key: 'Dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      path: '/owner',
    },
    {
      key: 'Profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ cá nhân',
      path: '/owner/profile',
    },
    {
      key: 'Staff Management',
      icon: <TeamOutlined />,
      label: 'Quản lý nhân viên',
      path: '/owner/staff',
    },
    {
      key: 'Products',
      icon: <ShoppingOutlined />,
      label: 'Sản phẩm',
      path: '/owner/products',
    },
    {
      key: 'Combos',
      icon: <AppstoreOutlined />,
      label: 'Combo',
      path: '/owner/combos',
    },
    {
      key: 'Orders',
      icon: <ShoppingCartOutlined />,
      label: 'Đơn hàng',
      path: '/owner/orders',
    },
    {
      key: 'Reports',
      icon: <BarChartOutlined />,
      label: 'Báo cáo',
      path: '/owner/reports',
    },
    {
      key: 'Settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      path: '/owner/settings',
    },
  ]

  return (
    <>
      <Sider
        width={250}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        trigger={null}
        className="owner-sidebar"
      >
        <div className="sidebar-header">
          {collapsed ? (
            <div className="logo-collapsed">
              <Avatar size={40} icon={<UserOutlined />} />
            </div>
          ) : (
            <div className="logo-expanded">
              <Avatar size={50} icon={<UserOutlined />} />
              <div className="user-info">
                <Title level={5} className="user-name">
                  {userName}
                </Title>
                <Text className="user-role">{userRole}</Text>
              </div>
            </div>
          )}
        </div>

        <Divider
          style={{ margin: '10px 0', borderColor: 'rgba(255, 255, 255, 0.1)' }}
        />

        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="collapse-button"
        />

        {/* Thay đổi cách render menu items */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenu]}
          className="sidebar-menu"
          style={{ backgroundColor: 'transparent' }}
        >
          {menuItems.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              onClick={() => handleMenuClick(item.key, item.path)}
            >
              {item.label}
            </Menu.Item>
          ))}
        </Menu>

        <div className="sidebar-footer">
          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            onClick={showLogoutModal}
            className="logout-button"
          >
            {!collapsed && 'Đăng xuất'}
          </Button>
        </div>
      </Sider>

      {/* Đặt LogoutModal bên ngoài Sider để đảm bảo nó hiển thị ở giữa màn hình */}
      <LogoutModal
        visible={logoutModalVisible}
        onOk={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  )
}

OwnerSidebar.propTypes = {
  selectedMenu: PropTypes.string.isRequired,
  setSelectedMenu: PropTypes.func.isRequired,
}

export default OwnerSidebar
