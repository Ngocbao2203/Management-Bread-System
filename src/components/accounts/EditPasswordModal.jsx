import { Modal, Form, Input } from 'antd';

const EditPasswordModal = ({ visible, onOk, onCancel, form }) => {
  return (
    <Modal
      title="Change Password"
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Save"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true, message: 'Please enter current password' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true, message: 'Please enter new password' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Retype New Password"
          name="retypeNewPassword"
          rules={[{ required: true, message: 'Please retype new password' }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPasswordModal;