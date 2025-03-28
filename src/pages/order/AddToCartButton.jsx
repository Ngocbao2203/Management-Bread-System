/* eslint-disable react/prop-types */
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { Button } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const AddToCartButton = ({ item, type = "product" }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(item, type);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddShoppingCartIcon />}
      onClick={handleAddToCart}
    >
      Thêm vào giỏ hàng
    </Button>
  );
};

export default AddToCartButton;
