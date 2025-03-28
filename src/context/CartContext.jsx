/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { getProductById } from "../services/productService";
import { getComboById } from "../services/conboService";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("CartStorage");
    try {
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng từ localStorage:", error);
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("CartStorage", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (item, type = "product") => {
    try {
      const existingItem = cartItems.find((cartItem) => cartItem.id === item.id && cartItem.type === type);
      if (existingItem) {
        updateQuantity(item.id, existingItem.quantity + 1, type);
      } else {
        let newItem;
        if (type === "product") {
          const productDetails = await getProductById(item.id);
          if (!productDetails) throw new Error("Sản phẩm không tồn tại");
          newItem = {
            id: item.id,
            name: productDetails.name,
            price: productDetails.price,
            imageUrl: productDetails.imageUrl,
            quantity: 1,
            type,
          };
        } else if (type === "combo") {
          const comboDetails = await getComboById(item.id);
          if (!comboDetails) throw new Error("Combo không tồn tại");
          newItem = {
            id: item.id,
            name: comboDetails.name,
            price: comboDetails.price,
            imageUrl: comboDetails.imageUrl,
            quantity: 1,
            type,
            comboProducts: comboDetails.comboProducts,
          };
        } else {
          newItem = { ...item, quantity: 1, type };
        }
        setCartItems((prev) => [...prev, newItem]);
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ:", error);
    }
  };

  const removeFromCart = (itemId, type) => {
    if (!cartItems.some((item) => item.id === itemId && item.type === type)) {
      console.warn("Mục không có trong giỏ:", itemId);
      return;
    }
    setCartItems((prev) => prev.filter((item) => !(item.id === itemId && item.type === type)));
    setSelectedItems((prev) => prev.filter((id) => id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity, type) => {
    if (!Number.isInteger(newQuantity) || newQuantity < 1) {
      console.warn("Số lượng không hợp lệ:", newQuantity);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId && item.type === type ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return selectedItems.reduce((total, itemId) => {
      const item = cartItems.find((item) => item.id === itemId);
      return item ? total + item.price * item.quantity : total;
    }, 0);
  };

  const selectAllItems = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        setSelectedItems,
        selectAllItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
