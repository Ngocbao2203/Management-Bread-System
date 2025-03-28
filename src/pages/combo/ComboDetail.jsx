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
  Checkbox,
} from 'antd'
import {
  ShoppingCartOutlined,
  DownOutlined,
  TagsOutlined,
  ShoppingOutlined,
  InfoCircleOutlined,
  HeartOutlined,
  HeartFilled,
  ArrowLeftOutlined,
  PlusOutlined,
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
  const [selectedToppings, setSelectedToppings] = useState([])
  const [availableIngredients, setAvailableIngredients] = useState([])

  // Extract unique ingredients from combo products
  const extractIngredients = (comboData) => {
    if (!comboData || !comboData.comboProducts) return []

    const ingredients = []
    const ingredientIds = new Set()

    comboData.comboProducts.forEach((comboProduct) => {
      if (comboProduct.product && comboProduct.product.productIngredients) {
        comboProduct.product.productIngredients.forEach((productIngredient) => {
          if (
            productIngredient.ingredient &&
            !ingredientIds.has(productIngredient.ingredient.id)
          ) {
            ingredientIds.add(productIngredient.ingredient.id)
            ingredients.push({
              id: productIngredient.ingredient.id,
              name: productIngredient.ingredient.ingredientName,
              price: productIngredient.ingredient.price,
              unit: productIngredient.ingredient.unit,
              quantity: productIngredient.quantity,
            })
          }
        })
      }
    })

    return ingredients
  }

  // Handle topping selection
  const handleToppingChange = (toppingId) => {
    setSelectedToppings((prev) => {
      if (prev.includes(toppingId)) {
        return prev.filter((id) => id !== toppingId)
      } else {
        return [...prev, toppingId]
      }
    })
  }

  // Calculate total price including toppings
  const calculateTotalPrice = () => {
    if (!combo) return 0

    let total = combo.price * quantity

    // Add topping prices
    selectedToppings.forEach((toppingId) => {
      const topping = availableIngredients.find((t) => t.id === toppingId)
      if (topping) {
        total += topping.price
      }
    })

    return total
  }

  // Add formatted price calculation
  const formattedPrice = combo
    ? calculateTotalPrice().toLocaleString('vi-VN') + 'đ'
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

    const selectedToppingNames = selectedToppings
      .map((id) => availableIngredients.find((t) => t.id === id)?.name)
      .filter(Boolean)

    toast.success(
      `Đã thêm ${quantity} ${combo.name} vào giỏ hàng${
        selectedToppingNames.length > 0
          ? ` với topping: ${selectedToppingNames.join(', ')}`
          : ''
      }`,
      {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    )
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

        // Extract ingredients from the combo data
        const ingredients = extractIngredients(response)
        setAvailableIngredients(ingredients)

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
                              </div>
                            </List.Item>
                          )}
                        />
                      </Panel>
                    </Collapse>

                    {/* Add Topping Section */}
                    {availableIngredients.length > 0 && (
                      <>
                        <Divider className="section-divider">
                          <PlusOutlined /> Topping
                        </Divider>

                        <div className="topping-section">
                          <div className="topping-options">
                            {availableIngredients.map((ingredient) => (
                              <div
                                key={ingredient.id}
                                className="topping-option"
                              >
                                <Checkbox
                                  checked={selectedToppings.includes(
                                    ingredient.id
                                  )}
                                  onChange={() =>
                                    handleToppingChange(ingredient.id)
                                  }
                                >
                                  <span className="topping-name">
                                    {ingredient.name}
                                  </span>
                                  <span className="topping-price">
                                    (+{ingredient.price.toLocaleString('vi-VN')}
                                    đ)
                                  </span>
                                  <Tooltip
                                    title={`${ingredient.quantity} ${ingredient.unit}`}
                                  >
                                    <InfoCircleOutlined className="topping-info-icon" />
                                  </Tooltip>
                                </Checkbox>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

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
