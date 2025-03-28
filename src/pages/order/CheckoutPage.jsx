import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createOrder } from "../../services/orderService";
import Loading from "../../components/common/Loading";
import { Card, Button, List, Typography, Divider, Space } from "antd";
import styled from "styled-components";

const { Text, Title } = Typography;

// Styled components để giữ giao diện giống MUI
const MuiStyleCard = styled(Card)`
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  .ant-card-body {
    padding: 24px;
  }
`;

const MuiStyleButton = styled(Button)`
  &.ant-btn {
    border-radius: 4px;
    font-weight: 500;
    text-transform: none;
    box-shadow: none;
  }
`;

const PrimaryButton = styled(MuiStyleButton)`
  &.ant-btn {
    background-color: #1976d2;
    color: white;
    &:hover {
      background-color: #1565c0;
    }
  }
`;

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    if (items.length === 0) {
      toast.warning("Vui lòng chọn sản phẩm trước khi thanh toán", { autoClose: 2000 });
      navigate("/cart");
    }
    setCheckoutItems(items);
  }, [navigate]);

  const totalAmount = checkoutItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const customerName = localStorage.getItem("userName")?.trim() || "Khách hàng";
  
      const orderDetails = checkoutItems.map(item => ({
        productId: item.type === "product" ? parseInt(item.id) : null,
        comboId: item.type === "combo" ? parseInt(item.id) : null,
        quantity: item.quantity,
        unitPrice: item.price,
        orderToppings: []
      }));
  
      const orderData = {
        customerName,
        paymentMethod: "cash",
        orderType: "online",
        branchId: 1,
        orderDetails
      };
  
      await createOrder(orderData);
      localStorage.removeItem("checkoutItems");
      toast.success("🎉 Đặt hàng thành công!", { position: "top-center", autoClose: 3000 });
      navigate("/order-success");
    } catch (error) {
      toast.error(`😢 Đặt hàng thất bại: ${error?.message || "Lỗi không xác định"}`, { 
        position: "top-center", 
        autoClose: 5000 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = () => {
    localStorage.removeItem("checkoutItems");
    toast.info("🚀 Đã hủy đơn hàng", { autoClose: 2000 });
    navigate("/");
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <MuiStyleCard>
        <Title level={2} style={{ marginBottom: 24 }}>Thanh toán</Title>
        {loading && <Loading />}

        <List
          dataSource={checkoutItems}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <div style={{ width: '100%' }}>
                <Text strong>{`${item.name} (${item.quantity} x ${formatCurrency(item.price)})`}</Text>
                <br />
                <Text type="secondary">{`Tổng: ${formatCurrency(item.price * item.quantity)}`}</Text>
                {index < checkoutItems.length - 1 && <Divider />}
              </div>
            </List.Item>
          )}
          style={{ marginBottom: 24 }}
        />

        <Title level={4} style={{ textAlign: 'right', marginBottom: 24 }}>
          Tổng cộng: {formatCurrency(totalAmount)}
        </Title>

        <Space size={16} style={{ width: '100%', marginTop: 24 }}>
          <PrimaryButton
            onClick={handlePlaceOrder}
            disabled={loading || checkoutItems.length === 0}
            block
            size="large"
          >
            {loading ? "Đang xử lý..." : "Đặt hàng"}
          </PrimaryButton>
          <Button
            onClick={handleCancelOrder}
            block
            size="large"
            style={{ borderColor: '#dc3545', color: '#dc3545' }}
          >
            Hủy
          </Button>
        </Space>
      </MuiStyleCard>
    </div>
  );
};

export default CheckoutPage;