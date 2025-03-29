import { useContext } from 'react'
import { CartContext } from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  /*Card,*/ Checkbox,
  Typography,
  Space,
  Table,
  InputNumber,
  Image,
} from 'antd'
import {
  /* PlusOutlined, MinusOutlined, */ DeleteOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'
import Header from '../../components/Header'

const { Text, Title } = Typography

// Styled components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
`

const ContentContainer = styled.div`
  flex: 1;
  padding: 24px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`

// const CartHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 16px;
//   padding-bottom: 16px;
//   border-bottom: 1px solid #e8e8e8;
// `;

const CartFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
`

// const ProductName = styled.div`
//   font-weight: 500;
//   margin-bottom: 4px;
// `;

// const ProductVariant = styled.div`
//   color: #666;
//   font-size: 12px;
// `;

const ActionButton = styled(Button)`
  &.ant-btn {
    padding: 0 8px;
    height: 32px;
    font-weight: 500;
  }
`

const DeleteButton = styled(Button)`
  &.ant-btn {
    color: #ff4d4f;
    border-color: #ff4d4f;
    &:hover {
      color: #ff7875;
      border-color: #ff7875;
    }
  }
`

const ProductImage = styled(Image)`
  width: 10px;
  height: 10px;
  object-fit: cover;
  border-radius: 2px;
  margin-right: 8px;
`

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

const CartPage = () => {
  const {
    cartItems,
    selectedItems,
    removeFromCart,
    updateQuantity,
    setSelectedItems,
    selectAllItems,
  } = useContext(CartContext)

  const navigate = useNavigate()

  const totalSelectedPrice = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.price * item.quantity, 0)

  const handlePurchase = () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để mua.')
      return
    }

    const selectedCheckoutItems = cartItems
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => ({
        id: item.id,
        type: item.type,
        name: item.name,
        imageUrl: item.imageUrl,
        price: item.price,
        quantity: item.quantity,
      }))

    localStorage.setItem('checkoutItems', JSON.stringify(selectedCheckoutItems))
    navigate('/checkout')
  }

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <ProductInfo>
          <ProductImage
            src={record.imageUrl || 'https://via.placeholder.com/80'}
            alt={record.name}
            preview={false}
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'cover',
              borderRadius: '2px',
              marginRight: '8px',
            }}
          />
          <div>
            <Text strong>{record.name}</Text>
            {record.type && (
              <div style={{ color: '#666', fontSize: 12 }}>
                Phân loại: {record.type}
              </div>
            )}
          </div>
        </ProductInfo>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => formatCurrency(price),
      align: 'right',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => updateQuantity(record.id, value, record.type)}
        />
      ),
      align: 'center',
    },
    {
      title: 'Số tiền',
      key: 'total',
      render: (_, record) => formatCurrency(record.price * record.quantity),
      align: 'right',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <DeleteButton
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record.id, record.type)}
        >
          Xóa
        </DeleteButton>
      ),
      align: 'center',
    },
  ]

  const rowSelection = {
    selectedRowKeys: selectedItems,
    onChange: (selectedRowKeys) => {
      setSelectedItems(selectedRowKeys)
    },
    getCheckboxProps: (record) => ({
      id: record.id,
    }),
  }

  return (
    <PageContainer>
      <Header />
      <ContentContainer>
        <Title level={2} style={{ marginBottom: 24 }}>
          Giỏ hàng
        </Title>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text>Giỏ hàng của bạn đang trống.</Text>
          </div>
        ) : (
          <>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={cartItems}
              rowSelection={{
                type: 'checkbox',
                ...rowSelection,
              }}
              pagination={false}
              style={{ marginBottom: 24 }}
            />

            <CartFooter>
              <Space>
                <Checkbox
                  checked={selectedItems.length === cartItems.length}
                  onChange={selectAllItems}
                >
                  Chọn tất cả ({selectedItems.length})
                </Checkbox>
                <ActionButton onClick={() => setSelectedItems([])}>
                  Bỏ chọn tất cả
                </ActionButton>
              </Space>

              <Space align="end" style={{ gap: '24px' }}>
                <div style={{ textAlign: 'right' }}>
                  <Text>Tổng tiền hàng:</Text>
                  <Title level={4} style={{ margin: 0 }}>
                    {formatCurrency(totalSelectedPrice)}
                  </Title>
                </div>
                <Button
                  type="primary"
                  size="large"
                  onClick={handlePurchase}
                  disabled={selectedItems.length === 0}
                >
                  Mua hàng
                </Button>
              </Space>
            </CartFooter>
          </>
        )}
      </ContentContainer>
    </PageContainer>
  )
}

export default CartPage;
