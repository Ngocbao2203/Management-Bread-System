/* eslint-disable react/prop-types */
import { useState } from "react";
import { Table, Button, Select, Space } from "antd";
import { updateOrderStatus } from "../../services/orderService";

const OrderTable = ({ orders, reloadOrders }) => {
  const [statusUpdates, setStatusUpdates] = useState({});

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

  const handleUpdateStatus = async (orderId) => {
    if (statusUpdates[orderId]) {
      await updateOrderStatus(orderId, statusUpdates[orderId]);
      reloadOrders();
      setStatusUpdates((prev) => ({
        ...prev,
        [orderId]: undefined, // Reset state sau khi cập nhật
      }));
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 90,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      width: 150,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      width: 120,
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 200,
      render: (_, record) => (
        <Space>
          <Select
            value={statusUpdates[record.id] || record.status}
            onChange={(value) => handleStatusChange(record.id, value)}
            style={{ width: 120 }}
            size="small"
          >
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="Processing">Processing</Select.Option>
            <Select.Option value="Completed">Completed</Select.Option>
            <Select.Option value="Cancelled">Cancelled</Select.Option>
          </Select>
          <Button
            type="primary"
            size="small"
            onClick={() => handleUpdateStatus(record.id)}
            disabled={
              !statusUpdates[record.id] || 
              statusUpdates[record.id] === record.status
            }
          >
            Update Status
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={orders}
      columns={columns}
      pagination={{ pageSize: 5 }}
      scroll={{ y: "calc(100vh - 300px)" }}
      rowKey="id"
      bordered
      size="small"
    />
  );
};

export default OrderTable;