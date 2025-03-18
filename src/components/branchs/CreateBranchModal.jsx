import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { toast } from 'react-toastify';

const { Option } = Select;

const CreateAccountModal = ({ visible, onOk, onCancel, form, branches, error }) => {
  console.log('Branches received in CreateAccountModal:', branches);

  // Display detailed error message when modal is open
  useEffect(() => {
    if (visible && error) {
      // Avoid duplicate toast messages by only showing on initial render
      console.log('Modal error details:', error);
    }
  }, [visible, error]);

  return (
    <Modal
      title="Create New Account"
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Create"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: 'Please enter full name' }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please enter username' }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="Enter email (e.g., user@example.com)" />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            { required: true, message: 'Please enter phone number' },
            { pattern: /^\d{10,15}$/, message: 'Phone number must be 10-15 digits' },
          ]}
        >
          <Input placeholder="Enter phone number (e.g., 1234567890)" />
        </Form.Item>
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select placeholder="Select a role">
            <Option value={1}>Staff</Option>
            <Option value={2}>Owner</Option>
            <Option value={3}>Admin</Option>
            <Option value={4}>Customer</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Branch ID"
          name="branchId"
          rules={[{ required: true, message: 'Please select a branch' }]}
        >
          <Select placeholder="Select a branch">
            {branches && branches.length > 0 ? (
              branches.map((branch) => (
                <Option key={branch.id} value={branch.id}>
                  {branch.branchName || `Branch ${branch.id}`}
                </Option>
              ))
            ) : (
              <Option disabled value={null}>
                No branches available
              </Option>
            )}
          </Select>
        </Form.Item>
        {error && (
          <div style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default CreateAccountModal;