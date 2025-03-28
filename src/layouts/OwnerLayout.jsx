'use client'

import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Layout,
  Typography,
  Avatar,
  Dropdown,
  Badge,
  Breadcrumb,
  Button,
} from 'antd'
import { UserOutlined, BellOutlined } from '@ant-design/icons'
import OwnerSidebar from '../components/owner/OwnerSidebar'
import './OwnerLayout.css'

const { Header, Content } = Layout
const { Title, Text } = Typography

const OwnerLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedMenu, setSelectedMenu] = useState('Dashboard')
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')
  const [notifications, setNotifications] = useState([])
  const [collapsed, setCollapsed] = useState(false)

  // Lấy thông tin người dùng từ localStorage khi component mount
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName')
    const storedRole =
      localStorage.getItem('role_name') || localStorage.getItem('role')

    if (storedUserName) setUserName(storedUserName)
    if (storedRole) setUserRole(storedRole)

    // Mẫu thông báo
    setNotifications([
      { id: 1, message: 'Đơn hàng mới #ORD-001', read: false },
      { id: 2, message: 'Sản phẩm sắp hết hàng: Cà phê sữa đá', read: false },
      { id: 3, message: 'Báo cáo doanh thu tháng đã sẵn sàng', read: true },
    ])
  }, [])

  // Cập nhật menu được chọn dựa trên đường dẫn hiện tại
  useEffect(() => {
    const path = location.pathname

    if (path === '/owner') {
      setSelectedMenu('Dashboard')
    } else if (path.includes('/owner/profile')) {
      setSelectedMenu('Profile')
    } else if (path.includes('/owner/staff')) {
      setSelectedMenu('Staff Management')
    } else if (path.includes('/owner/products')) {
      setSelectedMenu('Products')
    } else if (path.includes('/owner/combos')) {
      setSelectedMenu('Combos')
    } else if (path.includes('/owner/orders')) {
      setSelectedMenu('Orders')
    } else if (path.includes('/owner/reports')) {
      setSelectedMenu('Reports')
    } else if (path.includes('/owner/settings')) {
      setSelectedMenu('Settings')
    }
  }, [location])

  // Tạo breadcrumb dựa trên đường dẫn hiện tại
  const getBreadcrumbItems = () => {
    const path = location.pathname
    const items = [
      {
        title: <a onClick={() => navigate('/owner')}>Dashboard</a>,
        key: 'dashboard',
      },
    ]

    if (path !== '/owner') {
      const pathSegments = path.split('/').filter(Boolean)
      if (pathSegments.length > 1) {
        const segment = pathSegments[1]
        const title = segment.charAt(0).toUpperCase() + segment.slice(1)
        items.push({
          title,
          key: segment,
        })
      }
    }

    return items
  }

  // Dropdown menu cho user
  const userMenu = (
    <div className="user-dropdown-menu">
      <div className="user-dropdown-header">
        <Avatar size={48} icon={<UserOutlined />} />
        <div className="user-dropdown-info">
          <Text strong>{userName}</Text>
          <Text type="secondary">{userRole}</Text>
        </div>
      </div>
      <div className="user-dropdown-content">
        <Button type="text" block onClick={() => navigate('/owner/profile')}>
          Hồ sơ cá nhân
        </Button>
        <Button type="text" block onClick={() => navigate('/owner/settings')}>
          Cài đặt
        </Button>
        <Button
          type="text"
          danger
          block
          onClick={() => {
            localStorage.clear()
            navigate('/login')
          }}
        >
          Đăng xuất
        </Button>
      </div>
    </div>
  )

  // Dropdown menu cho thông báo
  const notificationMenu = (
    <div className="notification-dropdown-menu">
      <div className="notification-dropdown-header">
        <Text strong>Thông báo</Text>
        <Button type="link" size="small">
          Đánh dấu tất cả đã đọc
        </Button>
      </div>
      <div className="notification-dropdown-content">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <Text>{notification.message}</Text>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-notification">
            <Text type="secondary">Không có thông báo mới</Text>
          </div>
        )}
      </div>
      <div className="notification-dropdown-footer">
        <Button type="link" block onClick={() => {}}>
          Xem tất cả
        </Button>
      </div>
    </div>
  )

  // Đếm số thông báo chưa đọc
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Layout className="owner-layout">
      <OwnerSidebar
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
      />

      <Layout
        className="owner-layout-content"
        style={{ marginLeft: collapsed ? 80 : 250 }}
      >
        <Header className="owner-header">
          <div className="header-left">
            <Title level={4} className="header-title">
              {selectedMenu}
            </Title>
          </div>
          <div className="header-right">
            <Dropdown
              overlay={notificationMenu}
              trigger={['click']}
              placement="bottomRight"
              overlayClassName="notification-dropdown"
            >
              <Badge count={unreadCount} className="notification-badge">
                <Button
                  type="text"
                  icon={<BellOutlined className="notification-bell" />}
                  className="notification-button"
                />
              </Badge>
            </Dropdown>

            <Dropdown
              overlay={userMenu}
              trigger={['click']}
              placement="bottomRight"
              overlayClassName="user-dropdown"
            >
              <div className="user-dropdown-trigger">
                <Avatar icon={<UserOutlined />} />
                <div className="user-info">
                  <Text className="user-name">{userName}</Text>
                  <Text className="user-role">{userRole}</Text>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <div className="owner-breadcrumb-container">
          <Breadcrumb items={getBreadcrumbItems()} />
        </div>

        <Content className="owner-layout-main">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default OwnerLayout
