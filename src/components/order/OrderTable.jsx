/* eslint-disable react/prop-types */
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, MenuItem, Select, Box } from "@mui/material";
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
    { field: "id", headerName: "ID", width: 90 },
    { field: "customer", headerName: "Khách hàng", width: 150 },
    { field: "total", headerName: "Tổng tiền", width: 120 },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 200,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Select
            value={statusUpdates[params.row.id] || params.row.status}
            onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
            size="small"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Processing">Processing</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleUpdateStatus(params.row.id)}
            disabled={!statusUpdates[params.row.id] || statusUpdates[params.row.id] === params.row.status}
          >
            Update Status
          </Button>
        </Box>
      ),
    },
  ];

  return <DataGrid rows={orders} columns={columns} pageSize={5} autoHeight />;
};

export default OrderTable;
