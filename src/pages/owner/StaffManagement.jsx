'use client'

import { useState, useEffect } from 'react'
import { Typography, Button, Form, Card } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import useAccounts from '../../hooks/useAccounts'
import AccountTable from '../../components/accounts/AccountTable'
import EditAccountModal from '../../components/accounts/EditAccountModal'
import EditPasswordModal from '../../components/accounts/EditPasswordModal'
import CreateAccountModal from '../../components/accounts/CreateAccountModal'
import Pagination from '../../components/Pagination'

const { Title } = Typography
const baseURL = import.meta.env.VITE_API_BASE_URL

const StaffManagement = () => {
  const {
    accounts,
    page,
    setPage,
    totalPages,
    role,
    setRole,
    branches,
    error,
    handleStatusChange,
    handleCreateAccount,
    handleUpdateAccount,
    handleUpdatePassword,
  } = useAccounts()

  // Set role to Staff when component mounts
  useEffect(() => {
    setRole('Staff')
  }, [setRole])

  // Staff management state
  const [editForm] = Form.useForm()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editAccount, setEditAccount] = useState(null)

  const [passwordForm] = Form.useForm()
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [passwordAccountId, setPasswordAccountId] = useState(null)

  const [createForm] = Form.useForm()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Staff handlers
  const handleEdit = (account) => {
    setEditAccount(account)
    editForm.setFieldsValue({
      fullName: account.fullName,
      username: account.username,
      phoneNumber: account.phoneNumber,
      email: account.email,
      branchId: account.branchId,
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateAccountSubmit = async () => {
    try {
      const values = await editForm.validateFields()
      await handleUpdateAccount(editAccount.id, values)
      setIsEditModalOpen(false)
      toast.success('Staff updated successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to update staff')
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

  const handleCreateAccountSubmit = async () => {
    try {
      const values = await createForm.validateFields()
      await handleCreateAccount({ ...values, role: 'Staff' })
      setIsCreateModalOpen(false)
      toast.success('Staff created successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to create staff')
    }
  }

  return (
    <div className="staff-management-page">
      <div className="section-header">
        <Title level={2}>Staff Management</Title>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create New Staff
        </Button>
      </div>

      <Card className="staff-table-card">
        <AccountTable
          accounts={accounts}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onEditPassword={handleEditPassword}
          loading={false}
        />

        <div className="pagination-container">
          <Pagination
            count={totalPages}
            page={page}
            onChange={setPage}
            color="primary"
          />
        </div>
      </Card>

      {/* Staff Modals */}
      <EditAccountModal
        visible={isEditModalOpen}
        onOk={handleUpdateAccountSubmit}
        onCancel={() => setIsEditModalOpen(false)}
        form={editForm}
        title="Edit Staff"
        showBranchSelect={true}
        branches={branches}
      />
      <EditPasswordModal
        visible={isPasswordModalOpen}
        onOk={handleUpdatePasswordSubmit}
        onCancel={() => setIsPasswordModalOpen(false)}
        form={passwordForm}
        title="Change Staff Password"
      />
      <CreateAccountModal
        visible={isCreateModalOpen}
        onOk={handleCreateAccountSubmit}
        onCancel={() => setIsCreateModalOpen(false)}
        form={createForm}
        branches={branches}
        error={error}
        title="Create New Staff"
        role="Staff"
      />
    </div>
  )
}

export default StaffManagement
