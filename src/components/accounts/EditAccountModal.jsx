import { Modal, Form, Input } from 'antd';

const EditAccountModal = ({ visible, onOk, onCancel, initialValues, form }) => {
  return (
    <Modal
      title="Edit Account"
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Save"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: 'Please enter full name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please enter username' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditAccountModal;