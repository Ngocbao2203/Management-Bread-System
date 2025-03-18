import { Modal, Form, Input } from 'antd';

const EditBranchModal = ({ visible, onOk, onCancel, initialValues, form }) => {
  return (
    <Modal
      title="Edit Branch"
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Save"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          label="Branch Name"
          name="branchName"
          rules={[{ required: true, message: 'Please enter branch name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please enter address' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="City"
          name="city"
          rules={[{ required: true, message: 'Please enter city' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="District"
          name="district"
          rules={[{ required: true, message: 'Please enter district' }]}
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

export default EditBranchModal;