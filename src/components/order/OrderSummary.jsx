import { useContext } from 'react';
import { 
  Typography, 
  Input, 
  List, 
  Button, 
  Tag 
} from 'antd';
import { 
  MinusOutlined, 
  PlusOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import styled from 'styled-components';
import { CartContext } from '../../context/CartContext';

const { Text, Title } = Typography;

const TotalBox = styled.div`
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  margin-top: 16px;
`;

const OrderSummary = ({ 
  customerName, 
  setCustomerName, 
  handleCheckout, 
  handleClearOrder, 
  loading 
}) => {
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleIncreaseQuantity = (itemId, type) => {
    const item = cartItems.find(item => item.id === itemId && item.type === type);
    if (item) updateQuantity(itemId, item.quantity + 1, type);
  };

  const handleDecreaseQuantity = (itemId, type) => {
    const item = cartItems.find(item => item.id === itemId && item.type === type);
    if (item) {
      if (item.quantity > 1) {
        updateQuantity(itemId, item.quantity - 1, type);
      } else {
        removeFromCart(itemId, type);
      }
    }
  };

  return (
    <>
      <Title level={4} style={{ marginBottom: 16 }}>
        ORDER SUMMARY
      </Title>
      
      <Input
        placeholder="Tên khách hàng"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      
      {cartItems.length === 0 ? (
        <Text 
          type="secondary"
          style={{ 
            padding: '32px 0',
            textAlign: 'center',
            fontStyle: 'italic',
            display: 'block'
          }}
        >
          Chưa có món nào được chọn
        </Text>
      ) : (
        <>
          <List
            style={{ maxHeight: '50vh', overflow: 'auto' }}
            dataSource={cartItems}
            renderItem={(item, index) => (
              <List.Item
                key={`${item.type}-${item.id}-${index}`}
                style={{ padding: '8px 0' }}
              >
                <List.Item.Meta
                  title={<Text strong>{item.name}</Text>}
                  description={`${formatCurrency(item.price)} × ${item.quantity}`}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Text strong style={{ color: '#1890ff' }}>
                    {formatCurrency(item.price * item.quantity)}
                  </Text>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                    <Button 
                      size="small" 
                      icon={<MinusOutlined />} 
                      onClick={() => handleDecreaseQuantity(item.id, item.type)}
                      danger
                    />
                    <Tag style={{ margin: '0 4px' }}>{item.quantity}</Tag>
                    <Button 
                      size="small" 
                      icon={<PlusOutlined />} 
                      onClick={() => handleIncreaseQuantity(item.id, item.type)}
                      type="primary"
                    />
                    <Button 
                      size="small" 
                      icon={<DeleteOutlined />} 
                      onClick={() => removeFromCart(item.id, item.type)}
                      danger
                      style={{ marginLeft: 8 }}
                    />
                  </div>
                </div>
              </List.Item>
            )}
          />
          
          <TotalBox>
            <Title 
              level={5} 
              style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                margin: 0
              }}
            >
              <span>Thành tiền:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </Title>
          </TotalBox>
        </>
      )}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: 24,
        gap: 16
      }}>
        <Button
          type="primary"
          danger
          onClick={handleClearOrder}
          disabled={cartItems.length === 0 || loading}
          block
          style={{
            height: 40,
            fontWeight: 'bold'
          }}
        >
          Xóa đơn
        </Button>
        <Button
          type="primary"
          onClick={handleCheckout}
          disabled={cartItems.length === 0 || loading}
          block
          style={{
            height: 40,
            fontWeight: 'bold',
            background: '#52c41a',
            borderColor: '#52c41a'
          }}
        >
          {loading ? 'Đang xử lý...' : 'Thanh toán'}
        </Button>
      </div>
    </>
  );
};

export default OrderSummary;