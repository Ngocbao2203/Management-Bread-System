import { useState, useEffect, useContext } from 'react';
import { 
  Grid, 
  Button,
  Card,
  Typography,
  Tabs,
  Input,
  List,
  Tag
} from 'antd';
import { 
  PlusOutlined, 
  MinusOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import styled from 'styled-components';
import { CartContext } from '../../context/CartContext';
import { getProductList } from '../../services/productService';
import { getComboList } from '../../services/conboService';
import { createOrder } from '../../services/orderService';
import { toast } from 'react-toastify';

const { TabPane } = Tabs;
const { Text } = Typography;

// Styled components
const StyledContainer = styled.div`
  padding: 16px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const StyledPaper = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  height: 100%;
`;

const StyledCard = styled(Card)`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .ant-card-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
`;

const ProductImage = styled.img`
  height: 140px;
  object-fit: cover;
  width: 100%;
`;

const AddButton = styled(Button)`
  background-color: #ff5722;
  border-color: #ff5722;
  color: white;
  
  &:hover {
    background-color: #e64a19;
    border-color: #e64a19;
    color: white;
  }
`;

const TotalBox = styled.div`
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  margin-top: 16px;
`;

const CreateOrderCounter = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { products } = await getProductList(1, 100);
        setProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      }
    };

    const fetchCombos = async () => {
      try {
        const { combos } = await getComboList(1, 100);
        setCombos(combos);
      } catch (error) {
        console.error('Error fetching combos:', error);
        toast.error('Failed to load combos');
      }
    };

    fetchProducts();
    fetchCombos();
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleAddItem = (item, type) => {
    addToCart(item, type);
    toast.success(`${item.name} added to order`);
  };

  const handleIncreaseQuantity = (itemId, type) => {
    const item = cartItems.find(item => item.id === itemId && item.type === type);
    if (item) {
      updateQuantity(itemId, item.quantity + 1, type);
    }
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

  const handleRemoveItem = (itemId, type) => {
    removeFromCart(itemId, type);
    toast.info('Item removed from order');
  };

  const handleClearOrder = () => {
    cartItems.forEach(item => {
      removeFromCart(item.id, item.type);
    });
    toast.info('Order cleared');
  };

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      toast.error('Please enter customer name');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Please add items to the order');
      return;
    }

    setLoading(true);
    try {
      const orderDetails = cartItems.map(item => ({
        productId: item.type === 'product' ? item.id : null,
        comboId: item.type === 'combo' ? item.id : null,
        quantity: item.quantity,
        unitPrice: item.price,
        orderToppings: []
      }));

      const orderData = {
        customerName: customerName.trim(),
        paymentMethod: 'cash',
        orderType: 'counter',
        branchId: 1,
        orderDetails
      };

      await createOrder(orderData);
      handleClearOrder();
      setCustomerName('');
      toast.success('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(`Failed to create order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <StyledContainer>
      <Typography.Title 
        level={2} 
        style={{ 
          fontWeight: 'bold', 
          color: '#1890ff',
          textAlign: 'center',
          marginBottom: 24
        }}
      >
        ORDER COUNTER
      </Typography.Title>
      
      <Grid container spacing={16}>
        {/* Left Side - Product/Combo Selection */}
        <Grid item xs={24} md={16}>
          <StyledPaper>
            <Tabs 
              activeKey={activeTab} 
              onChange={handleTabChange} 
              centered
            >
              <TabPane tab="Sản phẩm" key="1">
                <Grid container spacing={16} style={{ marginTop: 16, maxHeight: '75vh', overflow: 'auto' }}>
                  {products.map(product => (
                    <Grid item xs={24} sm={12} md={8} key={`product-${product.id}`}>
                      <StyledCard
                        cover={
                          <ProductImage
                            alt={product.name}
                            src={product.imageUrl || '/placeholder-product.jpg'}
                          />
                        }
                      >
                        <Typography.Text 
                          strong
                          style={{ 
                            color: '#1890ff',
                            marginBottom: 8,
                            display: 'block'
                          }}
                        >
                          {product.name}
                        </Typography.Text>
                        <Typography.Text 
                          strong
                          style={{ 
                            color: '#1890ff',
                            fontSize: 16
                          }}
                        >
                          {formatCurrency(product.price)}
                        </Typography.Text>
                        <div style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: 16 }}>
                          <AddButton 
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() => handleAddItem(product, 'product')}
                          >
                            Thêm
                          </AddButton>
                        </div>
                      </StyledCard>
                    </Grid>
                  ))}
                </Grid>
              </TabPane>
              <TabPane tab="Combo" key="2">
                <Grid container spacing={16} style={{ marginTop: 16, maxHeight: '75vh', overflow: 'auto' }}>
                  {combos.map(combo => (
                    <Grid item xs={24} sm={12} md={8} key={`combo-${combo.id}`}>
                      <StyledCard
                        cover={
                          <ProductImage
                            alt={combo.name}
                            src={combo.imageUrl || '/placeholder-combo.jpg'}
                          />
                        }
                      >
                        <Typography.Text 
                          strong
                          style={{ 
                            color: '#1890ff',
                            marginBottom: 8,
                            display: 'block'
                          }}
                        >
                          {combo.name}
                        </Typography.Text>
                        <Typography.Text 
                          strong
                          style={{ 
                            color: '#1890ff',
                            fontSize: 16
                          }}
                        >
                          {formatCurrency(combo.price)}
                        </Typography.Text>
                        <div style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: 16 }}>
                          <AddButton 
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() => handleAddItem(combo, 'combo')}
                          >
                            Thêm
                          </AddButton>
                        </div>
                      </StyledCard>
                    </Grid>
                  ))}
                </Grid>
              </TabPane>
            </Tabs>
          </StyledPaper>
        </Grid>
        
        {/* Right Side - Order Summary */}
        <Grid item xs={24} md={8}>
          <StyledPaper>
            <Typography.Title level={4} style={{ marginBottom: 16 }}>
              ORDER SUMMARY
            </Typography.Title>
            
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
                            onClick={() => handleRemoveItem(item.id, item.type)}
                            danger
                            style={{ marginLeft: 8 }}
                          />
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
                
                <TotalBox>
                  <Typography.Title 
                    level={5} 
                    style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      margin: 0
                    }}
                  >
                    <span>Thành tiền:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </Typography.Title>
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
          </StyledPaper>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default CreateOrderCounter;