import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Button, 
  TextField, 
  Tabs, 
  Tab, 
  Card, 
  CardContent, 
  CardMedia, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  Divider,
  Paper,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { CartContext } from '../../context/CartContext';
import { getProductList} from '../../services/productService';
import { getComboList} from '../../services/conboService';
import { createOrder } from '../../services/orderService';
import { toast } from 'react-toastify';

const CreateOrderCounter = () => {
  const [activeTab, setActiveTab] = useState(0);
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
    <Box sx={{ p: 2, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 'bold', 
        color: 'primary.main',
        textAlign: 'center',
        mb: 3
      }}>
        ORDER COUNTER
      </Typography>
      
      <Grid container spacing={2}>
        {/* Left Side - Product/Combo Selection */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="Sản phẩm" />
              <Tab label="Combo" />
            </Tabs>
            
            <Box sx={{ mt: 2, maxHeight: '75vh', overflow: 'auto' }}>
              {activeTab === 0 ? (
                <Grid container spacing={2}>
                  {products.map(product => (
                    <Grid item xs={12} sm={6} md={4} key={`product-${product.id}`}>
                      <Card sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px'
                      }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={product.imageUrl || '/placeholder-product.jpg'}
                          alt={product.name}
                          sx={{ objectFit: 'cover' }}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography 
                            gutterBottom 
                            variant="subtitle1" 
                            component="div"
                            sx={{ 
                              fontWeight: 'bold',
                              color: 'primary.dark'
                            }}
                          >
                            {product.name}
                          </Typography>
                          <Typography 
                            variant="h6" 
                            color="primary" 
                            sx={{ fontWeight: 'bold' }}
                          >
                            {formatCurrency(product.price)}
                          </Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
                          <Button 
                            variant="contained" 
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => handleAddItem(product, 'product')}
                            sx={{
                              backgroundColor: '#ff5722',
                              '&:hover': { backgroundColor: '#e64a19' }
                            }}
                          >
                            Thêm
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  {combos.map(combo => (
                    <Grid item xs={12} sm={6} md={4} key={`combo-${combo.id}`}>
                      <Card sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px'
                      }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={combo.imageUrl || '/placeholder-combo.jpg'}
                          alt={combo.name}
                          sx={{ objectFit: 'cover' }}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography 
                            gutterBottom 
                            variant="subtitle1" 
                            component="div"
                            sx={{ 
                              fontWeight: 'bold',
                              color: 'primary.dark'
                            }}
                          >
                            {combo.name}
                          </Typography>
                          <Typography 
                            variant="h6" 
                            color="primary" 
                            sx={{ fontWeight: 'bold' }}
                          >
                            {formatCurrency(combo.price)}
                          </Typography>
                        </CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
                          <Button 
                            variant="contained" 
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => handleAddItem(combo, 'combo')}
                            sx={{
                              backgroundColor: '#ff5722',
                              '&:hover': { backgroundColor: '#e64a19' }
                            }}
                          >
                            Thêm
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Right Side - Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              ORDER SUMMARY
            </Typography>
            
            <TextField
              fullWidth
              label="Tên khách hàng"
              variant="outlined"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            {cartItems.length === 0 ? (
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  py: 4,
                  textAlign: 'center',
                  fontStyle: 'italic'
                }}
              >
                Chưa có món nào được chọn
              </Typography>
            ) : (
              <>
                <List sx={{ maxHeight: '50vh', overflow: 'auto' }}>
                  {cartItems.map((item, index) => (
                    <React.Fragment key={`${item.type}-${item.id}-${index}`}>
                      <ListItem sx={{ py: 1 }}>
                        <ListItemText
                          primary={
                            <Typography sx={{ fontWeight: 'bold' }}>
                              {item.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {formatCurrency(item.price)} × {item.quantity}
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            flexDirection: 'column'
                          }}>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: 'bold',
                                color: 'primary.main'
                              }}
                            >
                              {formatCurrency(item.price * item.quantity)}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <IconButton 
                                size="small" 
                                onClick={() => handleDecreaseQuantity(item.id, item.type)}
                                sx={{ color: 'error.main' }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <Chip 
                                label={item.quantity} 
                                size="small"
                                sx={{ mx: 0.5 }}
                              />
                              <IconButton 
                                size="small" 
                                onClick={() => handleIncreaseQuantity(item.id, item.type)}
                                sx={{ color: 'success.main' }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                edge="end" 
                                aria-label="delete"
                                onClick={() => handleRemoveItem(item.id, item.type)}
                                sx={{ ml: 1, color: 'error.main' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
                
                <Box sx={{ 
                  mt: 2, 
                  p: 2,
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px'
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 'bold'
                    }}
                  >
                    <span>Thành tiền:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </Typography>
                </Box>
              </>
            )}
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 3,
              gap: 2
            }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleClearOrder}
                disabled={cartItems.length === 0 || loading}
                fullWidth
                sx={{
                  py: 1.5,
                  fontWeight: 'bold'
                }}
              >
                Xóa đơn
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || loading}
                fullWidth
                sx={{
                  py: 1.5,
                  fontWeight: 'bold'
                }}
              >
                {loading ? 'Đang xử lý...' : 'Thanh toán'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateOrderCounter;