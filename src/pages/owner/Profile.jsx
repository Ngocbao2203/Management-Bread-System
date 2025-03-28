'use client'

import { useState, useEffect } from 'react'
import {
  Typography,
  Button,
  Form,
  Card,
  Row,
  Col,
  Avatar,
  Input,
  Divider,
} from 'antd'
import { UserOutlined, EditOutlined, LockOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import EditPasswordModal from '../../components/accounts/EditPasswordModal'
import axios from 'axios'

const { Title, Text } = Typography
const { TextArea } = Input
const baseURL = import.meta.env.VITE_API_BASE_URL

const ProfileOwner = () => {
  // Profile state
  const [profileForm] = Form.useForm()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // Password modal state
  const [passwordForm] = Form.useForm()
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [passwordAccountId, setPasswordAccountId] = useState(null)

  // Load user data from localStorage
  useEffect(() => {
    const loadUserFromLocalStorage = () => {
      try {
        const userName = localStorage.getItem('userName')
        const email = localStorage.getItem('email')
        const role = localStorage.getItem('role')
        const roleName = localStorage.getItem('role_name')
        const token = localStorage.getItem('token')
        const phoneNumber = localStorage.getItem('phoneNumber')
        const bio = localStorage.getItem('bio')

        // If we have the basic user info in localStorage
        if (userName && email && role) {
          // Create a user object from localStorage data
          const user = {
            id: getUserIdFromToken(token), // Extract user ID from token if possible
            fullName: userName,
            username: userName,
            email: email,
            role: role,
            roleName: roleName,
            phoneNumber: phoneNumber || '',
            bio: bio || '',
          }

          setCurrentUser(user)

          // Set form values
          profileForm.setFieldsValue({
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            bio: user.bio,
          })
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error)
      }
    }

    loadUserFromLocalStorage()
  }, [profileForm])

  // Helper function to extract user ID from JWT token
  const getUserIdFromToken = (token) => {
    if (!token) return null

    try {
      // JWT tokens are in the format: header.payload.signature
      const payload = token.split('.')[1]
      // Decode the base64 payload
      const decodedPayload = JSON.parse(atob(payload))
      // Most JWT tokens include a user ID as 'sub' or 'id' or 'userId'
      return (
        decodedPayload.sub || decodedPayload.id || decodedPayload.userId || null
      )
    } catch (error) {
      console.error('Error extracting user ID from token:', error)
      return null
    }
  }

  // Profile handlers
  const handleSaveProfile = async () => {
    try {
      const values = await profileForm.validateFields()

      // Update profile in the backend
      if (currentUser?.id) {
        await handleUpdateAccount(currentUser.id, values)
      }

      // Update localStorage with new values
      if (values.fullName) localStorage.setItem('userName', values.fullName)
      if (values.email) localStorage.setItem('email', values.email)
      if (values.phoneNumber)
        localStorage.setItem('phoneNumber', values.phoneNumber)
      if (values.bio) localStorage.setItem('bio', values.bio)

      // Update current user state
      setCurrentUser((prev) => ({
        ...prev,
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        bio: values.bio,
      }))

      setIsEditingProfile(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to update profile')
    }
  }

  const handleUpdateAccount = async (id, data) => {
    try {
      await axios.put(`${baseURL}api/account/update/${id}`, data)
      return true
    } catch (error) {
      console.error('Error updating account:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to update account'
      )
    }
  }

  const handleEditPassword = (id) => {
    setPasswordAccountId(id)
    passwordForm.resetFields()
    setIsPasswordModalOpen(true)
  }

  const handleUpdatePasswordSubmit = async () => {
    try {
      const values = await passwordForm.validateFields()
      if (values.newPassword !== values.retypeNewPassword) {
        toast.error('Passwords do not match')
        return
      }

      await handleUpdatePassword(passwordAccountId, values)
      setIsPasswordModalOpen(false)
      toast.success('Password updated')
    } catch (error) {
      toast.error(error.message || 'Failed to update password')
    }
  }

  const handleUpdatePassword = async (id, data) => {
    try {
      await axios.put(`${baseURL}api/account/update-password/${id}`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      return true
    } catch (error) {
      console.error('Error updating password:', error)
      throw new Error(
        error.response?.data?.message || 'Failed to update password'
      )
    }
  }

  return (
    <div className="profile-page">
      <Title level={2}>My Profile</Title>

      <Card className="profile-card">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8} className="profile-avatar-section">
            <Avatar
              size={120}
              icon={<UserOutlined />}
              src={currentUser?.avatarUrl}
              className="profile-avatar"
            />
            <Title level={4} className="profile-name">
              {currentUser?.fullName}
            </Title>
            <Text type="secondary">
              {currentUser?.roleName || currentUser?.role}
            </Text>
          </Col>
          <Col xs={24} md={16}>
            <div className="profile-header">
              <Title level={3}>Profile Information</Title>
              <Button
                type={isEditingProfile ? 'primary' : 'default'}
                icon={<EditOutlined />}
                onClick={() => setIsEditingProfile(!isEditingProfile)}
              >
                {isEditingProfile ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
            <Divider />

            <Form
              form={profileForm}
              layout="vertical"
              disabled={!isEditingProfile}
              onFinish={handleSaveProfile}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="fullName"
                    label="Full Name"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter your full name',
                      },
                    ]}
                  >
                    <Input placeholder="Enter your full name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter your username',
                      },
                    ]}
                  >
                    <Input placeholder="Enter your username" disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter your phone number',
                      },
                    ]}
                  >
                    <Input placeholder="Enter your phone number" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter your email',
                      },
                      {
                        type: 'email',
                        message: 'Please enter a valid email',
                      },
                    ]}
                  >
                    <Input placeholder="Enter your email" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="bio" label="Bio">
                <TextArea rows={4} placeholder="Tell us about yourself" />
              </Form.Item>

              {isEditingProfile && (
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save Changes
                  </Button>
                  <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      setIsEditingProfile(false)
                      profileForm.resetFields()
                    }}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              )}
            </Form>

            <Divider />

            <div className="password-section">
              <Title level={4}>Security</Title>
              <Button
                icon={<LockOutlined />}
                onClick={() => handleEditPassword(currentUser?.id)}
              >
                Change Password
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Password Modal */}
      <EditPasswordModal
        visible={isPasswordModalOpen}
        onOk={handleUpdatePasswordSubmit}
        onCancel={() => setIsPasswordModalOpen(false)}
        form={passwordForm}
      />
    </div>
  )
}

export default ProfileOwner
