/* eslint-disable react/prop-types */
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import styled from "styled-components";

// Styled component để giữ giao diện giống MUI
const MuiStyleButton = styled(Button)`
  &.ant-btn {
    border-radius: 4px;
    font-weight: 500;
    text-transform: none;
    box-shadow: none;
    background-color: #1976d2;
    color: white;
    &:hover {
      background-color: #1565c0;
      color: white;
    }
    &:focus {
      background-color: #1976d2;
      color: white;
    }
  }
`;

const AddToCartButton = ({ item, type = "product" }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(item, type);
  };

  return (
    <MuiStyleButton 
      type="primary"
      icon={<ShoppingCartOutlined />}
      onClick={handleAddToCart}
    >
      Thêm vào giỏ hàng
    </MuiStyleButton>
  );
};

export default AddToCartButton;