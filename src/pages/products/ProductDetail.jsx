import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col, Card, Button, InputNumber, Typography, Carousel, Skeleton, Alert, Badge, Image, Divider, Tag, Rate } from 'antd'
import {
  ShoppingCartOutlined,
  FacebookOutlined,
  TwitterOutlined,
  MailOutlined,
  ShareAltOutlined,
  HeartOutlined,
  TagsOutlined,
  HeartFilled,
} from '@ant-design/icons'
import '../../styles/ProductDetail.css'
import Header from '../../components/Header' // Import Header
import { getProductById } from '../../services/productService'
import { toast } from 'react-toastify'

const { Title, Text, Paragraph } = Typography

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
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [favorite, setFavorite] = useState(false)
  // Add formatted price calculation
  const formattedPrice = product ? 
    (product.price * quantity).toLocaleString('vi-VN') + 'đ' : 
    ''

  const handleQuantityChange = (value) => {
    if (value && value > 0) {
      setQuantity(value)
    }
  }

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await getProductById(id);
        setProduct(response);
        console.log(response);
        setError(null);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return

    toast.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }
  const toggleFavorite = () => {
    setFavorite(!favorite)
    toast.info(
      `${!favorite ? 'Đã thêm' : 'Đã xóa'} ${product?.name} ${!favorite ? 'vào' : 'khỏi'} danh sách yêu thích`
    )
  }
  return (
    <div className="detail-page-container">
      <Header />
      <div className="product-detail-container">
        {/* Add breadcrumb navigation */}
        <div className="breadcrumb">
          <span onClick={() => (window.location.href = '/')}>Trang chủ</span>
          <span className="separator">/</span>
          <span onClick={() => (window.location.href = '/products')}>Sản phẩm</span>
          <span className="separator">/</span>
          <span className="current">{product?.name}</span>
        </div>

        {loading ? (
          <Card className="product-card-detail">
            <Row gutter={[24, 32]}>
              <Col xs={24} md={10}>
                <Skeleton.Image className="skeleton-image" active />
              </Col>
              <Col xs={24} md={14}>
                <Skeleton active paragraph={{ rows: 10 }} />
              </Col>
            </Row>
          </Card>
        ) : error ? (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            action={
              <Button size="small" type="primary" onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            }
          />
        ) : product ? (
          <Card className="product-card-detail">
            <Row gutter={[32, 32]} align="top">
              <Col xs={24} md={10}>
                <div className="image-container">
                  <Badge.Ribbon text="Mới" color="green" className="product-count-ribbon">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      className="product-image"
                      preview={{
                        mask: <div className="image-preview-mask">Xem ảnh lớn</div>,
                      }}
                    />
                  </Badge.Ribbon>
                  {/* <div className="product-rating">
                    <Rate disabled defaultValue={4} />
                    <span className="rating-count">(12 đánh giá)</span>
                  </div> */}
                </div>
              </Col>

              <Col xs={24} md={14}>
                <div className="product-text-section">
                  <div className="product-title-section">
                    <Title level={2} className="product-name">
                      {product.name}
                    </Title>
                    <Button
                        type="text"
                        shape="circle"
                        icon={
                          favorite ? (
                            <HeartFilled className="favorite-icon active" />
                          ) : (
                            <HeartOutlined className="favorite-icon" />
                          )
                        }
                        onClick={toggleFavorite}
                        className="favorite-button"
                      />
                  </div>

                  <div className="product-price-display">
                    <Text className="product-price-label">Giá:</Text>
                    <Text className="product-price-value">{product.price}</Text>
                  </div>

                  <Divider className="section-divider" />

                  <Paragraph className="product-description">
                    {product.description}
                  </Paragraph>

                  <Divider className="section-divider">
                    <TagsOutlined /> Chi tiết sản phẩm
                  </Divider>

                  <div className="product-category">
                    <Text strong>Danh mục: </Text>
                    <Tag color="blue">{product.category}</Tag>
                  </div>

                  <Divider className="section-divider" />

                  <div className="product-actions">
                    <div className="product-quantity">
                      <Text strong className="quantity-label">
                        Số lượng:
                      </Text>
                      <div className="quantity-control">
                        <Button
                          onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                          className="quantity-button"
                        >
                          -
                        </Button>
                        <InputNumber
                          min={1}
                          value={quantity}
                          onChange={handleQuantityChange}
                          className="quantity-input"
                        />
                        <Button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          className="quantity-button"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <div className="product-price-wrapper">
                      <div className="total-price">
                        <Text className="total-label">Tổng tiền:</Text>
                        <Text className="total-value">{formattedPrice}</Text>
                      </div>
                      <Button
                        type="primary"
                        size="large"
                        className="add-cart-button"
                        onClick={handleAddToCart}
                        icon={<ShoppingCartOutlined />}
                      >
                        Thêm vào giỏ hàng
                      </Button>
                    </div>
                  </div>

                  <Divider className="section-divider" />

                  <div className="product-share">
                    <Text strong className="share-label">Chia sẻ:</Text>
                    <div className="share-buttons">
                      <FacebookOutlined className="share-icon facebook" />
                      <TwitterOutlined className="share-icon twitter" />
                      <MailOutlined className="share-icon mail" />
                      <ShareAltOutlined className="share-icon share" />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        ) : null}

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
