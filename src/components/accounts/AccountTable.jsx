import { Table, Button, Switch, Space } from 'antd';

const AccountTable = ({ accounts, onStatusChange, onEdit, onEditPassword }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Active',
      key: 'isActive',
      render: (_, record) => (
        <Switch
          checked={record.isActive === 1}
          onChange={() => onStatusChange(record.id, record.isActive)}
        />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Button type="default" onClick={() => onEditPassword(record.id)}>
            Edit Password
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={accounts}
      rowKey="id"
      pagination={false}
      locale={{ emptyText: 'No accounts found.' }}
    />
  );
};

export default AccountTable;