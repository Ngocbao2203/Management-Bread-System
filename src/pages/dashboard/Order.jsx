import { useState, useEffect } from "react";
import { Button, Container } from "@mui/material";
import OrderTable from "../components/order/OrderTable";
import CreateOrderModal from "../components/order/CreateOrderModal";
import { getOrders } from "../../services/orderService";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const handleOrderCreated = (newOrder) => {
    setOrders((prev) => [...prev, newOrder]);
  };

  return (
    <Container>
      <h2>Quản lý Đơn Hàng</h2>
      <Button variant="contained" onClick={() => setOpenCreate(true)}>Tạo Đơn Hàng</Button>
      <OrderTable orders={orders} reloadOrders={loadOrders} />
      <CreateOrderModal open={openCreate} onClose={() => setOpenCreate(false)} onOrderCreated={handleOrderCreated} />
    </Container>
  );
};

export default Order;
