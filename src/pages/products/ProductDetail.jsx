import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col, Card, Button, InputNumber, Typography, Carousel } from 'antd'
import {
  ShoppingCartOutlined,
  FacebookOutlined,
  TwitterOutlined,
  MailOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import '../../styles/ProductDetail.css'
import Header from '../../components/Header' // Import Header

const { Title, Text } = Typography

// Mock dữ liệu sản phẩm (Bạn có thể thay bằng API fetch)
const mockProduct = {
  id: 1,
  name: 'Tiramisu R',
  price: 520000, // Giá gốc của sản phẩm (đơn vị: VNĐ)
  description: 'Bánh Tiramisu hình trái tim thơm ngon, mềm mịn.',
  images: [
    'https://breadtalkvietnam.com/wp-content/uploads/2023/06/dsc02621_optimized.png',
    'https://breadtalkvietnam.com/wp-content/uploads/2023/06/dsc02627_optimized.png',
  ],
  category: ['Cakes', 'Sản phẩm nổi bật'],
}

// Mock danh sách sản phẩm liên quan
const relatedProducts = [
  {
    id: 2,
    name: 'Tropicoco',
    price: '470.000đ',
    image:
      'https://breadtalkvietnam.com/wp-content/uploads/2024/11/Banh-kem-update_tropicoco-1024x1024.png',
  },
  {
    id: 3,
    name: 'Cream Chez Garlic Bread',
    price: '390.000đ',
    image:
      'https://breadtalkvietnam.com/wp-content/uploads/2024/11/Banh-kem-update_blueberry-1024x1024.png',
  },
  {
    id: 4,
    name: 'Berry Rhapsody R',
    price: '420.000đ',
    image:
      'https://breadtalkvietnam.com/wp-content/uploads/2024/11/Banh-kem-update_BERRY-RHAPSODY-1024x1024.png',
  },
  {
    id: 5,
    name: 'Les Opera R',
    price: '690.000đ',
    image:
      'https://breadtalkvietnam.com/wp-content/uploads/2024/11/Banh-kem-update_Mocha-Choco-C.png',
  },
]

const ProductDetail = () => {
  const { id } = useParams() // Lấy ID sản phẩm từ URL
  const [quantity, setQuantity] = useState(1)

  // Cập nhật giá theo số lượng
  const formattedPrice =
    (mockProduct.price * quantity).toLocaleString('vi-VN') + 'đ'

  const handleQuantityChange = (value) => {
    if (value && value > 0) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    console.log(`Thêm ${quantity} sản phẩm ${mockProduct.name} vào giỏ hàng`)
  }

  return (
    <div>
      <Header /> {/* Thêm Header vào đầu trang */}
      <div className="product-detail-container">
        {/* Chi tiết sản phẩm */}
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} md={10}>
            <Carousel autoplay className="product-carousel">
              {mockProduct.images.map((img, index) => (
                <div key={index}>
                  <img
                    src={img}
                    alt={mockProduct.name}
                    className="product-image"
                  />
                </div>
              ))}
            </Carousel>
          </Col>

          <Col xs={24} md={10}>
            <div className="product-info">
              <Title level={2}>{mockProduct.name}</Title>
              <Text className="product-price">{formattedPrice}</Text>
              <p>{mockProduct.description}</p>

              {/* Chọn số lượng */}
              <div className="quantity-selector">
                <InputNumber
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <Button
                  style={{
                    backgroundColor: '#ff9800',
                    color: '#fff',
                    borderColor: '#ff9800',
                  }}
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>

              {/* Danh mục */}
              <div className="product-category">
                <Text strong>Danh mục:</Text>{' '}
                {mockProduct.category.map((cat, index) => (
                  <span key={cat}>
                    {index > 0 && <span> | </span>}{' '}
                    {/* Thêm dấu "|" để cách nhau */}
                    <Text className="category">{cat}</Text>
                  </span>
                ))}
              </div>

              {/* Chia sẻ */}
              <div className="product-share">
                <FacebookOutlined className="social-icon" />
                <TwitterOutlined className="social-icon" />
                <MailOutlined className="social-icon" />
                <ShareAltOutlined className="social-icon" />
              </div>
            </div>
          </Col>
        </Row>

        {/* Sản phẩm liên quan */}
        <div className="related-products">
          <Title level={3} className="related-title">
            CÁC SẢN PHẨM KHÁC
          </Title>
          <Row gutter={[16, 16]} justify="center">
            {relatedProducts.map((product) => (
              <Col key={product.id} xs={12} sm={8} md={6} lg={5}>
                <Card
                  hoverable
                  cover={<img alt={product.name} src={product.image} />}
                  actions={[
                    <Button
                      style={{
                        backgroundColor: '#ff9800',
                        color: '#fff',
                        borderColor: '#ff9800',
                      }}
                    >
                      Thêm vào giỏ hàng
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={product.name}
                    description={
                      <span className="product-price">{product.price}</span>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
