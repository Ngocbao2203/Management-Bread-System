import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Typography, IconButton, Checkbox, Box } from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";

// Hàm định dạng tiền sang VND
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

const CartPage = () => {
  const {
    cartItems,
    selectedItems,
    removeFromCart,
    updateQuantity,
    setSelectedItems,
    selectAllItems,
  } = useContext(CartContext);

  const navigate = useNavigate();

  // Tính tổng giá của các sản phẩm đã chọn
  const totalSelectedPrice = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  // Xử lý khi nhấn nút "Mua hàng"
  const handlePurchase = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để mua.");
      return;
    }

    // Lọc ra các sản phẩm đã chọn và lưu vào Local Storage
    const selectedCheckoutItems = cartItems
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => ({
        id: item.id, 
        type: item.type, 
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

    localStorage.setItem("checkoutItems", JSON.stringify(selectedCheckoutItems));
    navigate("/checkout");
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Giỏ hàng
      </Typography>

      {cartItems.length === 0 ? (
        <Typography>Giỏ hàng của bạn đang trống.</Typography>
      ) : (
        <>
          <Box display="flex" alignItems="center" mb={2}>
            <Checkbox
              checked={selectedItems.length === cartItems.length}
              onChange={selectAllItems}
            />
            <Typography>Chọn tất cả</Typography>
          </Box>

          {cartItems.map((item) => (
            <Card key={`${item.id}-${item.type}`} sx={{ marginBottom: 2 }}>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onChange={() =>
                    setSelectedItems((prev) =>
                      prev.includes(item.id)
                        ? prev.filter((id) => id !== item.id)
                        : [...prev, item.id]
                    )
                  }
                />
                <Box flexGrow={1}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography>Giá: {formatCurrency(item.price)}</Typography>
                  <Typography>Số lượng: {item.quantity}</Typography>
                  <Typography fontWeight="bold">
                    Tổng: {formatCurrency(item.price * item.quantity)}
                  </Typography>
                </Box>
                <IconButton onClick={() => updateQuantity(item.id, item.quantity + 1, item.type)}>
                  <Add />
                </IconButton>
                <IconButton
                  onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1, item.type)}
                >
                  <Remove />
                </IconButton>
                <IconButton onClick={() => removeFromCart(item.id, item.type)}>
                  <Delete />
                </IconButton>
              </CardContent>
            </Card>
          ))}

          {/* Hiển thị tổng giá nếu có sản phẩm được chọn */}
          {selectedItems.length > 0 && (
            <Typography variant="h6" mt={2} fontWeight="bold">
              Tổng tiền: {formatCurrency(totalSelectedPrice)}
            </Typography>
          )}

          <Button
            variant="contained"
            color="secondary"
            onClick={() => setSelectedItems([])}
            sx={{ marginRight: 2, mt: 2 }}
          >
            Bỏ chọn tất cả
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handlePurchase}
            sx={{ mt: 2 }}
          >
            Mua hàng
          </Button>
        </>
      )}
    </div>
  );
};

export default CartPage;
