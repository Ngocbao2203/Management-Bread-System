/* eslint-disable react-hooks/exhaustive-deps */
import '../../styles/ProductListCustomer.css'
import { getProductList } from '../../services/productService'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Header from '../../components/Header'
// import { Link } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import { Card, Button, Row, Col, Typography, Tooltip, Empty } from 'antd'
import {
  /* ShoppingCartOutlined,*/ InfoCircleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import AddToCartButton from '../order/AddToCartButton'

const { Title, Text, Paragraph } = Typography

const ProductListCustomer = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [size] = useState(5)
  const [totalItems, setTotalItems] = useState(0)
  const navigate = useNavigate()
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const result = await getProductList(page, size)
      console.log('Result from getProductList:', result)
      setProducts(result.products || [])
      setTotalItems(result.pagination.total || result.products.length)
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

  useEffect(() => {
    fetchProducts()
  }, [page, size])

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ'
  }

  // const handleAddToCart = (e, product) => {
  //   e.stopPropagation()
  //   toast.success(`Đã thêm ${product.name} vào giỏ hàng`)
  // }

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
        <Button type="primary" onClick={fetchProducts}>
          Thử lại
        </Button>
      </div>
    )

  return (
    <div className="page-container">
      <Header />
      <div className="product-container">
        <div className="product-header">
          <div className="product-header-content-up">
            <Title level={2} className="product-title">
              Danh sách sản phẩm
            </Title>
            <Paragraph className="product-subtitle">
              Khám phá các loại sản phẩm tuyệt hảo của chúng tôi
            </Paragraph>
          </div>
        </div>

        {products.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>Không có sản phẩm nào</span>}
          />
        ) : (
          <Row gutter={[24, 24]} justify="center">
            {products.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  className="product-card"
                  onClick={() => navigate(`/products/${product.id}`)}
                  cover={
                    <div className="product-image-container">
                      <img
                        alt={product.name}
                        src={product.imageUrl}
                        className="product-image"
                      />
                    </div>
                  }
                >
                  <div className="product-content">
                    <div className="product-header-content">
                      <Title level={4} className="product-name">
                        {product.name}
                      </Title>
                      <Text className="product-price">
                        {formatPrice(product.price)}
                      </Text>
                    </div>

                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      className="product-description"
                    >
                      {product.description ||
                        'Bánh mì thơm ngon, đậm đà hương vị Việt Nam'}
                    </Paragraph>

                    <div className="product-footer">
                      <Tooltip title="Xem chi tiết">
                        <Button
                          type="default"
                          shape="circle"
                          icon={<InfoCircleOutlined />}
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/products/${product.id}`)
                          }}
                          className="detail-button"
                        />
                      </Tooltip>
                      <AddToCartButton
                        item={product}
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
      {totalItems > size && (
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

export default ProductListCustomer
