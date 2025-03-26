import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';
import { getProductById } from '../services/productService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Load cart from localStorage khi component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('CartStorage');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage khi cartItems thay đổi
  useEffect(() => {
    localStorage.setItem('CartStorage', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (productId) => {
    try {
      const existingItem = cartItems.find(item => item.id === productId);
      
      if (existingItem) {
        updateQuantity(productId, existingItem.quantity + 1);
      } else {
        const productDetails = await getProductById(productId);
        setCartItems(prev => [
          ...prev,
          {
            id: productId,
            name: productDetails.name,
            price: productDetails.price,
            imageUrl: productDetails.imageUrl,
            quantity: 1
          }
        ]);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    setSelectedItems(prev => prev.filter(id => id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleSelectItem = (productId) => {
    setSelectedItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const selectAllItems = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  const removeSelectedItems = () => {
    setCartItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedItems([]);
  };

  const getTotalPrice = () => {
    return selectedItems.reduce((total, productId) => {
      const item = cartItems.find(item => item.id === productId);
      return total + (item ? item.price * item.quantity : 0);
    }, 0);
  };

  const prepareCheckoutItems = () => {
    return cartItems.filter(item => selectedItems.includes(item.id));
  };

  const clearSelectedItems = () => {
    setSelectedItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSelectItem,
        selectAllItems,
        removeSelectedItems,
        clearCart,
        getTotalPrice,
        shippingAddress,
        paymentMethod,
        prepareCheckoutItems,
        clearSelectedItems,
        setShippingAddress,
        setPaymentMethod
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// PropTypes cho CartProvider
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// PropTypes cho giá trị context
CartContext.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      imageUrl: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ),
  selectedItems: PropTypes.arrayOf(PropTypes.string),
  addToCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  updateQuantity: PropTypes.func.isRequired,
  toggleSelectItem: PropTypes.func.isRequired,
  selectAllItems: PropTypes.func.isRequired,
  removeSelectedItems: PropTypes.func.isRequired,
  clearCart: PropTypes.func.isRequired,
  getTotalPrice: PropTypes.func.isRequired,
  shippingAddress: PropTypes.object,
  paymentMethod: PropTypes.string,
  prepareCheckoutItems: PropTypes.func.isRequired,
  clearSelectedItems: PropTypes.func.isRequired,
  setShippingAddress: PropTypes.func.isRequired,
  setPaymentMethod: PropTypes.func.isRequired,
};