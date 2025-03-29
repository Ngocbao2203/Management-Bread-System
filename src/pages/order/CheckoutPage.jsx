import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createOrder } from "../../services/orderService";
import Loading from "../../components/common/Loading";
import { Button, Table, Typography, Space, Card,  Image } from "antd";
import styled from "styled-components";
import Header from "../../components/Header";
import { CartContext } from "../../context/CartContext";


const { Text, Title } = Typography;

// Styled components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 24px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const CheckoutCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  .ant-card-body {
    padding: 24px;
  }
`;

const ActionButton = styled(Button)`
  &.ant-btn {
    padding: 0 16px;
    height: 40px;
    font-weight: 500;
    font-size: 16px;
  }
`;

const PrimaryButton = styled(ActionButton)`
  &.ant-btn {
    background-color: #1890ff;
    color: white;
    &:hover {
      background-color: #40a9ff;
    }
  }
`;

const CancelButton = styled(ActionButton)`
  &.ant-btn {
    color: #ff4d4f;
    border-color: #ff4d4f;
    &:hover {
      color: #ff7875;
      border-color: #ff7875;
    }
  }
`;

const ProductImage = styled(Image)`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { resetCart } = useContext(CartContext);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    if (items.length === 0) {
      toast.warning("Vui lòng chọn sản phẩm trước khi thanh toán", { autoClose: 2000 });
      navigate("/cart");
    }
    setCheckoutItems(items);
  }, [navigate]);

  const totalAmount = checkoutItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <ProductInfo>
          <ProductImage 
            src={record.imageUrl || 'https://via.placeholder.com/60'} 
            alt={record.name}
            preview={false}
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'cover',
              borderRadius: '2px',
              marginRight: '8px',
            }}
          />
          <div>
            <Text strong>{record.name}</Text>
            {record.type && <div style={{ color: '#666', fontSize: 12 }}>Phân loại: {record.type}</div>}
          </div>
        </ProductInfo>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => formatCurrency(price),
      align: 'right',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_, record) => formatCurrency(record.price * record.quantity),
      align: 'right',
    },
  ];

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
      localStorage.removeItem('CartStorage');
      resetCart();
      toast.success("🎉 Đặt hàng thành công!", { position: "top-center", autoClose: 3000 });
      navigate("/");
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
    <PageContainer>
      <Header />
      <ContentContainer>
        <Title level={2} style={{ marginBottom: 24 }}>Thanh toán</Title>
        
        <CheckoutCard>
          {loading && <Loading />}

          <Table
            columns={columns}
            dataSource={checkoutItems}
            pagination={false}
            rowKey={(record) => `${record.id}-${record.type}`}
            style={{ marginBottom: 24 }}
            footer={() => (
              <div style={{ textAlign: 'right', padding: '16px 0' }}>
                <Title level={4} style={{ margin: 0 }}>
                  Tổng cộng: {formatCurrency(totalAmount)}
                </Title>
              </div>
            )}
          />

          <Space size={16} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CancelButton
              onClick={handleCancelOrder}
              size="large"
            >
              Hủy đơn hàng
            </CancelButton>
            <PrimaryButton
              onClick={handlePlaceOrder}
              disabled={loading || checkoutItems.length === 0}
              size="large"
              loading={loading}
            >
              {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
            </PrimaryButton>
          </Space>
        </CheckoutCard>
      </ContentContainer>
    </PageContainer>
  );
};

export default CheckoutPage;