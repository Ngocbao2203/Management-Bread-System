import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Button, Card, Checkbox, Typography, Space } from "antd";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";
import styled from "styled-components";

const { Text, Title } = Typography;

// Styled components để giữ giao diện giống MUI
const MuiStyleCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  
  .ant-card-body {
    padding: 16px;
    display: flex;
    align-items: center;
  }
`;

const MuiStyleButton = styled(Button)`
  &.ant-btn {
    border-radius: 4px;
    font-weight: 500;
    text-transform: none;
    box-shadow: none;
  }
`;

const PrimaryButton = styled(MuiStyleButton)`
  &.ant-btn {
    background-color: #1976d2;
    color: white;
    &:hover {
      background-color: #1565c0;
    }
  }
`;

const SecondaryButton = styled(MuiStyleButton)`
  &.ant-btn {
    background-color: #dc3545;
    color: white;
    &:hover {
      background-color: #c82333;
    }
  }
`;

const IconButton = styled(Button)`
  &.ant-btn {
    padding: 0;
    min-width: 32px;
    height: 32px;
    border: none;
    box-shadow: none;
  }
`;

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
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 16 }}>
        Giỏ hàng
      </Title>

      {cartItems.length === 0 ? (
        <Text>Giỏ hàng của bạn đang trống.</Text>
      ) : (
        <>
          <Space align="center" style={{ marginBottom: 16 }}>
            <Checkbox
              checked={selectedItems.length === cartItems.length}
              onChange={selectAllItems}
            />
            <Text>Chọn tất cả</Text>
          </Space>

          {cartItems.map((item) => (
            <MuiStyleCard key={`${item.id}-${item.type}`}>
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
              <div style={{ flex: 1, marginLeft: 16 }}>
                <Text strong style={{ fontSize: 16, display: 'block' }}>{item.name}</Text>
                <Text>Giá: {formatCurrency(item.price)}</Text>
                <Text>Số lượng: {item.quantity}</Text>
                <Text strong>Tổng: {formatCurrency(item.price * item.quantity)}</Text>
              </div>
              <Space>
                <IconButton 
                  icon={<PlusOutlined />} 
                  onClick={() => updateQuantity(item.id, item.quantity + 1, item.type)}
                />
                <IconButton 
                  icon={<MinusOutlined />} 
                  onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1, item.type)}
                />
                <IconButton 
                  icon={<DeleteOutlined />} 
                  onClick={() => removeFromCart(item.id, item.type)}
                />
              </Space>
            </MuiStyleCard>
          ))}

          {/* Hiển thị tổng giá nếu có sản phẩm được chọn */}
          {selectedItems.length > 0 && (
            <Title level={4} style={{ marginTop: 16, fontWeight: 'bold' }}>
              Tổng tiền: {formatCurrency(totalSelectedPrice)}
            </Title>
          )}

          <Space style={{ marginTop: 16 }}>
            <SecondaryButton
              onClick={() => setSelectedItems([])}
            >
              Bỏ chọn tất cả
            </SecondaryButton>

            <PrimaryButton
              onClick={handlePurchase}
            >
              Mua hàng
            </PrimaryButton>
          </Space>
        </>
      )}
    </div>
  );
};

export default CartPage;