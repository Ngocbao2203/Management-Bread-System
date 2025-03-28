import { useState, useEffect } from "react";
import { Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OrderTable from "../../components/order/OrderTable";
import { getOrders } from "../../services/orderService";

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
    <Container>
      <h2>Quản lý Đơn Hàng</h2>
      <Button 
        variant="contained" 
        onClick={handleCreateOrder}
      >
        Tạo Đơn Hàng
      </Button>
      <OrderTable orders={orders} reloadOrders={loadOrders} />
    </Container>
  );
};

export default Order;