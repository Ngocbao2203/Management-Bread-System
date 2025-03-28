import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Card,
  Typography,
  List,
  Image,
  Row,
  Col,
  InputNumber,
  Button,
  Badge,
  Collapse,
  Divider,
  Tag,
  Skeleton,
  Rate,
  Tooltip,
  Alert,
  Result,
} from 'antd'
import {
  ShoppingCartOutlined,
  FacebookOutlined,
  TwitterOutlined,
  MailOutlined,
  ShareAltOutlined,
  DownOutlined,
  TagsOutlined,
  ShoppingOutlined,
  InfoCircleOutlined,
  HeartOutlined,
  HeartFilled,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import Header from '../../components/Header'
import '../../styles/ComboDetail.css'
import { toast } from 'react-toastify'
import { getComboById } from '../../services/conboService'

const { Title, Paragraph, Text } = Typography
const { Panel } = Collapse

const ComboDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [combo, setCombo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [favorite, setFavorite] = useState(false)

  // Add formatted price calculation
  const formattedPrice = combo
    ? (combo.price * quantity).toLocaleString('vi-VN') + 'đ'
    : ''

  // Calculate total products in combo
  const totalProductsInCombo = combo
    ? combo.comboProducts.reduce((total, item) => total + item.quantity, 0)
    : 0

  const handleQuantityChange = (value) => {
    if (value && value > 0) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    if (!combo) return

    toast.success(`Đã thêm ${quantity} ${combo.name} vào giỏ hàng`, {
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
      `${!favorite ? 'Đã thêm' : 'Đã xóa'} ${combo?.name} ${!favorite ? 'vào' : 'khỏi'} danh sách yêu thích`
    )
  }

  useEffect(() => {
    if (!id) return

    const fetchCombo = async () => {
      setLoading(true)
      try {
        const response = await getComboById(id)
        setCombo(response)
        console.log(response)
        setError(null)
      } catch (err) {
        setError(err.message)
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCombo()
  }, [id])

  // If combo is not active, show inactive message
  if (combo && combo.isActive === false) {
    return (
      <div className="detail-page-container">
        <Header />
        <div className="combo-detail-container">
          <Result
            status="warning"
            title="Combo không khả dụng"
            subTitle="Combo này hiện không còn hoạt động. Vui lòng chọn combo khác."
            extra={
              <Button
                type="primary"
                onClick={() => navigate('/combo')}
                icon={<ArrowLeftOutlined />}
              >
                Quay lại danh sách combo
              </Button>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="detail-page-container">
      <Header />
      <div className="combo-detail-container">
        {loading ? (
          <Card className="combo-card">
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
              <Button
                size="small"
                type="primary"
                onClick={() => window.location.reload()}
              >
                Thử lại
              </Button>
            }
          />
        ) : combo ? (
          <>
            <div className="breadcrumb">
              <span onClick={() => (window.location.href = '/combo')}>
                Trang chủ
              </span>
              <span className="separator">/</span>
              <span onClick={() => (window.location.href = '/combo')}>
                Combo
              </span>
              <span className="separator">/</span>
              <span className="current">{combo.name}</span>
            </div>

            <Card className="combo-card">
              <Row gutter={[32, 32]} align="top">
                <Col xs={24} md={10}>
                  <div className="image-container">
                    <Badge.Ribbon
                      text={`${totalProductsInCombo} sản phẩm`}
                      color="green"
                      className="product-count-ribbon"
                    >
                      <Image
                        src={combo.imageUrl || '/placeholder.svg'}
                        alt={combo.name}
                        className="combo-image"
                        preview={{
                          mask: (
                            <div className="image-preview-mask">
                              Xem ảnh lớn
                            </div>
                          ),
                        }}
                      />
                    </Badge.Ribbon>

                    <div className="combo-rating">
                      <Rate disabled defaultValue={4} />
                      <span className="rating-count">(12 đánh giá)</span>
                    </div>
                  </div>
                </Col>

                <Col xs={24} md={14}>
                  <div className="combo-text-section">
                    <div className="combo-title-section">
                      <Title level={2} className="combo-name">
                        {combo.name}
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

                    <div className="combo-price-display">
                      <Text className="combo-price-label">Giá:</Text>
                      <Text className="combo-price-value">
                        {combo.price.toLocaleString('vi-VN')}đ
                      </Text>
                    </div>

                    <Divider className="section-divider" />

                    <Paragraph className="combo-description">
                      {combo.description ||
                        'Combo bánh mì đặc biệt với nhiều thành phần hấp dẫn, mang đến cho bạn trải nghiệm ẩm thực tuyệt vời.'}
                    </Paragraph>

                    <Divider className="section-divider">
                      <TagsOutlined /> Chi tiết sản phẩm
                    </Divider>

                    <Collapse
                      defaultActiveKey={['1']}
                      expandIcon={({ isActive }) => (
                        <DownOutlined rotate={isActive ? 180 : 0} />
                      )}
                      className="combo-collapse"
                      bordered={false}
                    >
                      <Panel
                        header={
                          <div className="panel-header">
                            <ShoppingOutlined className="panel-icon" />
                            <span>
                              Sản phẩm trong combo ({combo.comboProducts.length}
                              )
                            </span>
                          </div>
                        }
                        key="1"
                      >
                        <List
                          className="products-list"
                          itemLayout="horizontal"
                          dataSource={combo.comboProducts || []}
                          renderItem={(item, index) => (
                            <List.Item
                              key={index}
                              className="product-list-item"
                            >
                              <div className="product-item-content">
                                <div className="product-header">
                                  <Text strong className="product-name">
                                    {item.product.productName}
                                  </Text>
                                  <Badge
                                    count={`x${item.quantity}`}
                                    className="quantity-badge"
                                  />
                                </div>

                                {item.product.productIngredients &&
                                  item.product.productIngredients.length >
                                    0 && (
                                    <div className="ingredients-section">
                                      <Text
                                        type="secondary"
                                        className="ingredients-title"
                                      >
                                        <InfoCircleOutlined /> Thành phần:
                                      </Text>
                                      <div className="ingredients-tags">
                                        {item.product.productIngredients.map(
                                          (ingredient, idx) => (
                                            <Tooltip
                                              title={`${ingredient.quantity} ${ingredient.ingredient.unit}`}
                                              key={idx}
                                            >
                                              <Tag
                                                color="blue"
                                                className="ingredient-tag"
                                              >
                                                {
                                                  ingredient.ingredient
                                                    .ingredientName
                                                }
                                              </Tag>
                                            </Tooltip>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </List.Item>
                          )}
                        />
                      </Panel>
                    </Collapse>

                    <Divider className="section-divider" />

                    <div className="combo-actions">
                      <div className="combo-quantity">
                        <Text strong className="quantity-label">
                          Số lượng:
                        </Text>
                        <div className="quantity-control">
                          <Button
                            onClick={() =>
                              handleQuantityChange(Math.max(1, quantity - 1))
                            }
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

                      <div className="combo-price-wrapper">
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

                    <div className="combo-share">
                      <Text strong className="share-label">
                        Chia sẻ:
                      </Text>
                      <div className="share-buttons">
                        <Button
                          type="text"
                          shape="circle"
                          icon={
                            <FacebookOutlined className="share-icon facebook" />
                          }
                        />
                        <Button
                          type="text"
                          shape="circle"
                          icon={
                            <TwitterOutlined className="share-icon twitter" />
                          }
                        />
                        <Button
                          type="text"
                          shape="circle"
                          icon={<MailOutlined className="share-icon mail" />}
                        />
                        <Button
                          type="text"
                          shape="circle"
                          icon={
                            <ShareAltOutlined className="share-icon share" />
                          }
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default ComboDetail
