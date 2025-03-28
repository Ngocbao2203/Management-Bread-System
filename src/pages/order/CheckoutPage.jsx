import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createOrder } from "../../services/orderService";
import Loading from "../../components/common/Loading";
import {
  Card, CardContent, Typography, Button, Stack, List, ListItem, ListItemText, Divider
} from "@mui/material";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    if (items.length === 0) {
      toast.warning("Vui lòng chọn sản phẩm trước khi thanh toán", { autoClose: 2000 });
      navigate("/cart");
    }
    setCheckoutItems(items);
  }, [navigate]);

  const totalAmount = checkoutItems.reduce((total, item) => total + item.price * item.quantity, 0);

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
        branchId: 1, // Nên lấy từ state hoặc context nếu có
        orderDetails
      };
  
      await createOrder(orderData);
      localStorage.removeItem("checkoutItems");
      toast.success("🎉 Đặt hàng thành công!", { position: "top-center", autoClose: 3000 });
      navigate("/order-success"); // Chuyển đến trang xác nhận
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
    <div className="max-w-2xl mx-auto p-5">
      <Card sx={{ p: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>Thanh toán</Typography>
          {loading && <Loading />}

          <List sx={{ mb: 2 }}>
            {checkoutItems.map((item, index) => (
              <div key={index}>
                <ListItem>
                  <ListItemText
                    primary={`${item.name} (${item.quantity} x ${formatCurrency(item.price)})`}
                    secondary={`Tổng: ${formatCurrency(item.price * item.quantity)}`}
                  />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>

          <Typography variant="h6" align="right" sx={{ mb: 2 }}>
            Tổng cộng: {formatCurrency(totalAmount)}
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              onClick={handlePlaceOrder}
              disabled={loading || checkoutItems.length === 0}
              variant="contained"
              color="primary"
              fullWidth
            >
              {loading ? "Đang xử lý..." : "Đặt hàng"}
            </Button>
            <Button
              onClick={handleCancelOrder}
              variant="outlined"
              color="error"
              fullWidth
            >
              Hủy
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutPage;