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

const { Title, Paragraph, Text } = Typography

const combos = [
  {
    id: 1,
    name: 'Combo Bánh Mì Thịt Nướng',
    description:
      'Combo hoàn hảo cho bữa sáng, gồm bánh mì và topping phong phú.',
    price: 120000, // 👉 Đổi sang kiểu số để dễ xử lý
    image:
      'https://product.hstatic.net/200000567755/product/banh_mi_nam_nuong_1_giac_da_doi_2_1f6a3c07e26647b7892757f0bc54b494_master.png',
    items: ['Bánh mì x 1', 'Thịt nướng x 2', 'Nước sốt đặc biệt x 1'],
  },
]

const ComboDetail = () => {
  const { id } = useParams()
  const combo = combos.find((c) => c.id === parseInt(id))
  const [quantity, setQuantity] = useState(1)

  if (!combo) return <div>Không tìm thấy combo.</div>

  const totalPrice = combo.price * quantity
  const formattedPrice = totalPrice.toLocaleString('vi-VN') + 'đ'

  return (
    <>
      <Header />
      <div className="combo-detail-container">
        <Card className="combo-card">
          <Row gutter={[24, 32]} align="middle">
            <Col xs={24} md={10}>
              <Image
                src={combo.image}
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
                  dataSource={combo.items}
                  renderItem={(item) => (
                    <List.Item className="combo-list-item">{item}</List.Item>
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
                    <Button type="primary" className="add-cart-button">
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
      </div>
    </>
  )
}

export default ComboDetail
