// import React from 'react'
import {
  Card,
  Button,
  Row,
  Col,
  Typography,
  Badge,
  Tag,
  Tooltip,
  Divider,
  Empty,
} from 'antd'
import Header from '../../components/Header'
import { useNavigate } from 'react-router-dom'
import '../../styles/ComboListCustomer.css'
import { getComboList } from '../../services/conboService'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Pagination from '../../components/Pagination'
import {
  // ShoppingCartOutlined,
  InfoCircleOutlined,
  // FireOutlined,
  TagOutlined,
  // ExclamationCircleOutlined,
} from '@ant-design/icons'
import AddToCartButton from '../order/AddToCartButton'

const { Title, Text, Paragraph } = Typography

const ComboListCustomer = () => {
  const navigate = useNavigate()
  const [combos, setCombos] = useState([])
  const [filteredCombos, setFilteredCombos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [size] = useState(5)
  const [totalItems, setTotalItems] = useState(0)

  const fetchCombos = async () => {
    setLoading(true)
    try {
      const result = await getComboList(page, size)
      console.log('Result from getComboList:', result)

      // Store all combos
      setCombos(result.combos || [])

      // Filter active combos
      const activeCombosList = (result.combos || []).filter(
        (combo) => combo.status === 'Active'
      )
      setFilteredCombos(activeCombosList)

      // Update total count for pagination based on active combos
      setTotalItems(activeCombosList.length)

      setError(null)
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalItems / size)) {
      setPage(newPage)
    }
  }

  // const handleAddToCart = (e, combo) => {
  //   e.stopPropagation() // Prevent navigating to detail page
  //   toast.success(`Đã thêm ${combo.name} vào giỏ hàng`)
  // }

  // Calculate total products in each combo
  const getTotalProductsCount = (combo) => {
    return combo.comboProducts.reduce((total, item) => total + item.quantity, 0)
  }

  // Format price with Vietnamese currency
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ'
  }

  useEffect(() => {
    fetchCombos()
  }, [page, size])

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    )

  if (error)
    return (
      <div className="error-container">
        <InfoCircleOutlined className="error-icon" />
        <p>Lỗi: {error}</p>
        <Button type="primary" onClick={fetchCombos}>
          Thử lại
        </Button>
      </div>
    )

  return (
    <div className="page-container">
      <Header />
      <div className="combo-container">
        <div className="combo-header">
          <Title level={2} className="combo-title">
            Danh sách Combo Bánh Mì
          </Title>
          <Paragraph className="combo-subtitle">
            Khám phá các combo bánh mì đặc biệt của chúng tôi với nhiều lựa chọn
            hấp dẫn
          </Paragraph>
        </div>

        {filteredCombos.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span>
                Hiện tại không có combo nào đang hoạt động. Vui lòng quay lại
                sau!
              </span>
            }
          />
        ) : (
          <Row gutter={[24, 24]} justify="center">
            {filteredCombos.map((combo) => (
              <Col key={combo.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  className="combo-card"
                  onClick={() => navigate(`/combo/${combo.id}`)}
                  cover={
                    <div className="combo-image-container">
                      <img
                        alt={combo.name}
                        src={combo.imageUrl || '/placeholder.svg'}
                        className="combo-image"
                      />
                      <div className="combo-badges">
                        <Badge
                          count={getTotalProductsCount(combo)}
                          className="product-count-badge"
                          overflowCount={99}
                        />
                      </div>
                    </div>
                  }
                >
                  <div className="combo-content">
                    <div className="combo-header-content">
                      <Title level={4} className="combo-name">
                        {combo.name}
                      </Title>
                      <Text className="combo-price">
                        {formatPrice(combo.price)}
                      </Text>
                    </div>

                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      className="combo-description"
                    >
                      {combo.description ||
                        'Combo bánh mì đặc biệt với nhiều thành phần hấp dẫn'}
                    </Paragraph>

                    <Divider className="combo-divider">
                      <TagOutlined /> Sản phẩm
                    </Divider>

                    <div className="combo-items">
                      <ul className="combo-products-list">
                        {combo.comboProducts.map((item, index) => (
                          <li key={index} className="product-item">
                            <div className="product-name-quantity">
                              <Text className="product-name">
                                {item.product.productName}
                              </Text>
                              <Badge
                                count={`x${item.quantity}`}
                                className="quantity-badge"
                              />
                            </div>

                            {item.product.productIngredients &&
                              item.product.productIngredients.length > 0 && (
                                <div className="product-ingredients">
                                  {item.product.productIngredients.map(
                                    (ingredient, idx) => (
                                      <Tag color="blue" key={idx}>
                                        {ingredient.ingredient.ingredientName}
                                      </Tag>
                                    )
                                  )}
                                </div>
                              )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="combo-footer">
                      <Tooltip title="Xem chi tiết">
                        <Button
                          type="default"
                          shape="circle"
                          icon={<InfoCircleOutlined />}
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/combo/${combo.id}`)
                          }}
                          className="detail-button"
                        />
                      </Tooltip>
                      <AddToCartButton
                        item={combo}
                        type="combo"
                        className="add-to-cart-button"
                      />
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
      {filteredCombos.length > 0 && totalItems > size && (
        <div className="pagination-container">
          <Pagination
            page={page}
            totalItems={totalItems}
            size={size}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

export default ComboListCustomer
