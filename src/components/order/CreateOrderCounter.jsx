import { useState, useEffect, useContext } from 'react';
import { Row, Col, Tabs, Typography } from 'antd';
import styled from 'styled-components';
import { CartContext } from '../../context/CartContext';
import { getProductList } from '../../services/productService';
import { getComboList } from '../../services/conboService';
import { createOrder } from '../../services/orderService';
import { toast } from 'react-toastify';
import ProductCard from './ProductCard';
import OrderSummary from './OrderSummary';

const { Title } = Typography;

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

const CreateOrderCounter = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

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

  const handleAddItem = (item, type) => {
    addToCart(item, type);
    toast.success(`${item.name} added to order`);
  };

  const handleClearOrder = () => {
    cartItems.forEach(item => removeFromCart(item.id, item.type));
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

  return (
    <StyledContainer>
      <Title 
        level={2} 
        style={{ 
          fontWeight: 'bold', 
          color: '#1890ff',
          textAlign: 'center',
          marginBottom: 24
        }}
      >
        ORDER COUNTER
      </Title>
      
      <Row gutter={16}>
        <Col xs={24} md={16}>
          <StyledPaper>
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab} 
              centered
            >
              <Tabs.TabPane tab="Sản phẩm" key="1">
                <Row gutter={[16, 16]} style={{ marginTop: 16, maxHeight: '75vh', overflow: 'auto' }}>
                  {products.map(product => (
                    <Col xs={24} sm={12} md={8} key={`product-${product.id}`}>
                      <ProductCard 
                        item={product} 
                        type="product" 
                        onAdd={handleAddItem}
                      />
                    </Col>
                  ))}
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Combo" key="2">
                <Row gutter={[16, 16]} style={{ marginTop: 16, maxHeight: '75vh', overflow: 'auto' }}>
                  {combos.map(combo => (
                    <Col xs={24} sm={12} md={8} key={`combo-${combo.id}`}>
                      <ProductCard 
                        item={combo} 
                        type="combo" 
                        onAdd={handleAddItem}
                      />
                    </Col>
                  ))}
                </Row>
              </Tabs.TabPane>
            </Tabs>
          </StyledPaper>
        </Col>
        
        <Col xs={24} md={8}>
          <StyledPaper>
            <OrderSummary
              customerName={customerName}
              setCustomerName={setCustomerName}
              handleCheckout={handleCheckout}
              handleClearOrder={handleClearOrder}
              loading={loading}
            />
          </StyledPaper>
        </Col>
      </Row>
    </StyledContainer>
  );
};

export default CreateOrderCounter;
