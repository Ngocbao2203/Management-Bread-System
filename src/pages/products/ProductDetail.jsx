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


const { Title, Text } = Typography

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
  
  // Add formatted price calculation
  const formattedPrice = product
    ? (product.price * quantity).toLocaleString('vi-VN') + 'đ'
    : ''

  const handleQuantityChange = (value) => {
    if (value && value > 0) {
      setQuantity(value)
    }
  }

  useEffect(() => {
    if (!id) return

    const fetchProduct = async () => {
      setLoading(true)
      try {
        const response = await getProductById(id)
        setProduct(response)
        console.log(response)
        setError(null)
      } catch (err) {
        setError(err.message)
        toast.error(err.message)
      } finally {
        setLoading(false)
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

            <Col xs={24} md={10}>
              <div className="product-info">
                <Title level={2}>{product.name}</Title>
                <Text className="product-price">{formattedPrice}</Text>
                <p>{product.description}</p>

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

                    <span key={product.category}>
                      {/* Thêm dấu "|" để cách nhau */}
                      <Text className="category">{product.category}</Text>
                    </span>
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
