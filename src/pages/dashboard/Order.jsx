import { useState, useEffect } from "react";
import { Button, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import OrderTable from "../../components/order/OrderTable";
import { getOrders } from "../../services/orderService";
import styled from "styled-components";

// Styled components để giữ giao diện giống MUI
const MuiStyleContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const MuiStyleButton = styled(Button)`
  &.ant-btn {
    border-radius: 4px;
    font-weight: 500;
    text-transform: none;
    box-shadow: none;
    background-color: #1976d2;
    color: white;
    &:hover {
      background-color: #1565c0;
    }
  }
`;

const Order = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const handleCreateOrder = () => {
    navigate("/dashboard/order-counter");
  };

  return (
    <MuiStyleContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          Quản lý Đơn Hàng
        </Typography.Title>
        <MuiStyleButton 
          type="primary"
          onClick={handleCreateOrder}
        >
          Tạo Đơn Hàng
        </MuiStyleButton>
      </div>
      <Card
        bodyStyle={{ padding: 0 }}
        style={{
          borderRadius: 4,
          boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)'
        }}
      >
        <OrderTable orders={orders} reloadOrders={loadOrders} />
      </Card>
    </MuiStyleContainer>
  );
};

export default Order;