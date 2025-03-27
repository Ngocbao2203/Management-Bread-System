/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { toast } from 'react-toastify';

const CreateBranchModal = ({ visible, onOk, onCancel, form, error }) => {
  // Display detailed error message when modal is open
  useEffect(() => {
    if (visible && error) {
      console.log('Modal error details:', error);
      toast.error(error); // Hiển thị thông báo lỗi nếu có
    }
  }, [visible, error]);

  return (
    <Modal
      title="Create New Branch"
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Create"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Branch Name"
          name="branchName"
          rules={[{ required: true, message: 'Please enter branch name' }]}
        >
          <Input placeholder="Enter branch name" />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please enter address' }]}
        >
          <Input placeholder="Enter branch address" />
        </Form.Item>
        <Form.Item
          label="City"
          name="city"
          rules={[{ required: true, message: 'Please enter city' }]}
        >
          <Input placeholder="Enter city (e.g., Ho Chi Minh City)" />
        </Form.Item>
        <Form.Item
          label="District"
          name="district"
          rules={[{ required: true, message: 'Please enter district' }]}
        >
          <Input placeholder="Enter district (e.g., District 1)" />
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
        {error && (
          <div style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default CreateBranchModal;