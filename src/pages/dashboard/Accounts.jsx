import { useState } from 'react';
import { Typography, Select, Button, Form } from 'antd';
import useAccounts from '../../hooks/useAccounts';
import AccountTable from '../../components/accounts/AccountTable';
import EditAccountModal from '../../components/accounts/EditAccountModal';
import EditPasswordModal from '../../components/accounts/EditPasswordModal';
import CreateAccountModal from '../../components/accounts/CreateAccountModal';
import Pagination from '../../components/Pagination';
import { toast } from 'react-toastify'; // Giả định bạn đã cài đặt react-toastify

const { Title } = Typography;
const { Option } = Select;

const Accounts = () => {
  const {
    accounts,
    page,
    setPage,
    totalPages,
    role,
    setRole,
    branches,
    error, // Lấy lỗi từ useAccounts
    handleStatusChange,
    handleCreateAccount,
    handleUpdateAccount,
    handleUpdatePassword,
  } = useAccounts();

  const [editForm] = Form.useForm();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState(null);

  const [passwordForm] = Form.useForm();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordAccountId, setPasswordAccountId] = useState(null);

  const [createForm] = Form.useForm();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleEdit = (account) => {
    setEditAccount(account);
    editForm.setFieldsValue({
      fullName: account.fullName,
      username: account.username,
      phoneNumber: account.phoneNumber,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditAccount(null);
    editForm.resetFields();
  };

  const handleUpdateAccountSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      await handleUpdateAccount(editAccount.id, values);
      handleCloseEditModal();
      toast.success('Account updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(`Update failed: ${error.message || 'Please try again'}`);
    }
  };

  const handleEditPassword = (id) => {
    setPasswordAccountId(id);
    passwordForm.resetFields();
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordAccountId(null);
    passwordForm.resetFields();
  };

  const handleUpdatePasswordSubmit = async () => {
    try {
      const values = await passwordForm.validateFields();
      if (values.newPassword !== values.retypeNewPassword) {
        toast.error('New password and retype password do not match');
        return;
      }
      await handleUpdatePassword(passwordAccountId, values);
      handleClosePasswordModal();
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Password update failed:', error);
      toast.error(`Password update failed: ${error.message || 'Please try again'}`);
    }
  };

  const handleOpenCreateModal = () => {
    createForm.resetFields();
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  const handleCreateAccountSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      await handleCreateAccount(values);
      handleCloseCreateModal();
      toast.success('Account created successfully');
    } catch (error) {
      console.error('Create account failed:', error);
      toast.error(`Create account failed: ${error.message || 'Please check the data and try again'}`);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={2}>Account Management</Title>
        <Button type="primary" onClick={handleOpenCreateModal}>
          Create New Account
        </Button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <span>Filter by Role: </span>
        <Select
          value={role}
          onChange={(value) => {
            setRole(value);
            setPage(1);
          }}
          style={{ width: 200 }}
        >
          <Option value="">All</Option>
          <Option value="Staff">Staff</Option>
          <Option value="Owner">Owner</Option>
        </Select>
      </div>

      <AccountTable
        accounts={accounts}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
        onEditPassword={handleEditPassword}
      />

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(newPage) => setPage(newPage)}
            color="primary"
          />
        </div>
      )}

      <EditAccountModal
        visible={isEditModalOpen}
        onOk={handleUpdateAccountSubmit}
        onCancel={handleCloseEditModal}
        initialValues={editAccount}
        form={editForm}
      />

      <EditPasswordModal
        visible={isPasswordModalOpen}
        onOk={handleUpdatePasswordSubmit}
        onCancel={handleClosePasswordModal}
        form={passwordForm}
      />

      <CreateAccountModal
        visible={isCreateModalOpen}
        onOk={handleCreateAccountSubmit}
        onCancel={handleCloseCreateModal}
        form={createForm}
        branches={branches}
        error={error} // Truyền error vào CreateAccountModal để hiển thị thông báo lỗi
      />

      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>} {/* Hiển thị lỗi nếu có */}
    </div>
  );
};

export default Accounts;