import { useParams } from 'react-router-dom'
import { useState } from 'react'
import {
  Card,
  Typography,
  List,
  Image,
  Row,
  Col,
  InputNumber,
  Button,
} from 'antd'
import {
  ShoppingCartOutlined,
  FacebookOutlined,
  TwitterOutlined,
  MailOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import Header from '../../components/Header'
import '../../styles/ComboDetail.css'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { getComboById } from '../../services/conboService'

const { Title, Paragraph, Text } = Typography

const ComboDetail = () => {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [combo, setCombo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Add formatted price calculation
  const formattedPrice = combo ? 
    (combo.price * quantity).toLocaleString('vi-VN') + 'đ' : 
    ''

  const handleQuantityChange = (value) => {
    if (value && value > 0) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    console.log(`Thêm ${quantity} sản phẩm ${combo.name} vào giỏ hàng`)
  }
  useEffect(() => {
    if (!id) return;

    const fetchCombo = async () => {
      setLoading(true);
      try {
        const response = await getComboById(id);
        setCombo(response);
        console.log(response);
        setError(null);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCombo();
  }, [id]);

  return (
    <>
      <Header />
      <div className="combo-detail-container">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : combo ? (
          <Card className="combo-card">
            <Row gutter={[24, 32]} align="middle">
              <Col xs={24} md={10}>
                <Image
                  src={combo.imageUrl}
                  alt={combo.name}
                  className="combo-image"
                />
              </Col>
              <Col xs={24} md={14}>
                <div className="combo-text-section">
                  <Title level={2} className="combo-name">
                    {combo.name}
                  </Title>
                  <Paragraph className="combo-description">
                    {combo.description}
                  </Paragraph>

                  <Title level={4}>Sản phẩm trong combo:</Title>
                  <List
                    size="small"
                    dataSource={combo.comboProducts || []}
                    renderItem={(item, index) => (
                      <List.Item key={index} className="combo-list-item">
                        {item.product.productName}
                      </List.Item>
                    )}
                  />

                  <div className="combo-actions">
                    <div className="combo-quantity">
                      <label htmlFor="quantity">Số lượng:</label>
                      <InputNumber
                        id="quantity"
                        min={1}
                        value={quantity}
                        onChange={(value) => {
                          if (value > 0) setQuantity(value)
                        }}
                      />
                    </div>

                    <div className="combo-price-wrapper">
                      <Text className="combo-price">Giá: {formattedPrice}</Text>
                      <Button 
                        type="primary" 
                        className="add-cart-button"
                        onClick={handleAddToCart}
                      >
                        🛒 Thêm vào giỏ hàng
                      </Button>
                    </div>
                  </div>

                  <div className="combo-share">
                    Chia sẻ: <FacebookOutlined className="icon" />
                    <TwitterOutlined className="icon" />
                    <MailOutlined className="icon" />
                    <ShareAltOutlined className="icon" />
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        ) : null}
      </div>
    </>
  )
}

export default ComboDetail
