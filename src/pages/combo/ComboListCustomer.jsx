import React from 'react'
import { Card, Button, Row, Col, Typography } from 'antd'
import Header from '../../components/Header'
import { useNavigate } from 'react-router-dom'
import '../../styles/ComboListCustomer.css'

const { Title, Text } = Typography

const combos = [
  {
    id: 1,
    name: 'Combo Bánh Mì Thịt',
    description:
      'Combo cho bữa sáng, gồm bánh mì và topping',
    price: '120.000đ',
    image:
      'https://product.hstatic.net/200000567755/product/banh_mi_nam_nuong_1_giac_da_doi_2_1f6a3c07e26647b7892757f0bc54b494_master.png',
    items: ['Bánh mì x 1', 'Thịt nướng x 2', 'Nước sốt đặc biệt x 1'],
  },
  {
    id: 2,
    name: 'Combo Bánh Mì Chả Lụa',
    description: 'Bánh mì chả lụa truyền thống kèm rau xanh',
    price: '95.000đ',
    image:
      'https://product.hstatic.net/200000567755/product/banh_mi_nam_nuong_1_giac_da_doi_2_1f6a3c07e26647b7892757f0bc54b494_master.png',
    items: ['Bánh mì x 1', 'Chả lụa x 2', 'Dưa leo x 1'],
  },
  {
    id: 3,
    name: 'Combo Bánh Mì Gà',
    description: 'Hương vị thơm ngon của gà sốt BBQ, hoàn hảo.',
    price: '110.000đ',
    image:
      'https://product.hstatic.net/200000567755/product/banh_mi_nam_nuong_1_giac_da_doi_2_1f6a3c07e26647b7892757f0bc54b494_master.png',
    items: ['Bánh mì x 1', 'Gà BBQ x 2', 'Rau xanh x 1'],
  },
  {
    id: 4,
    name: 'Combo Bánh Mì Xíu Mại',
    description: 'Xíu mại mềm thơm kết hợp cùng bánh mì nóng giòn.',
    price: '100.000đ',
    image:
      'https://product.hstatic.net/200000567755/product/banh_mi_nam_nuong_1_giac_da_doi_2_1f6a3c07e26647b7892757f0bc54b494_master.png',
    items: ['Bánh mì x 1', 'Xíu mại x 3', 'Nước sốt đặc biệt x 1'],
  },
  {
    id: 5,
    name: 'Combo Bánh Mì Pate',
    description: 'Bánh mì pate thơm béo, ăn kèm rau xanh và đồ chua.',
    price: '90.000đ',
    image:
      'https://product.hstatic.net/200000567755/product/banh_mi_nam_nuong_1_giac_da_doi_2_1f6a3c07e26647b7892757f0bc54b494_master.png',
    items: ['Bánh mì x 1', 'Pate x 1', 'Rau xanh x 1'],
  },
  {
    id: 6,
    name: 'Combo Bánh Mì Trứng Ốp La',
    description: 'Bánh mì kèm trứng ốp la, đơn giản mà đầy đủ dinh dưỡng.',
    price: '85.000đ',
    image:
      'https://product.hstatic.net/200000567755/product/banh_mi_nam_nuong_1_giac_da_doi_2_1f6a3c07e26647b7892757f0bc54b494_master.png',
    items: ['Bánh mì x 1', 'Trứng ốp la x 2', 'Tương ớt x 1'],
  },
  {
    id: 7,
    name: 'Combo Bánh Mì Bò Sốt Tiêu',
    description: 'Thịt bò mềm thơm hòa quyện với sốt tiêu đậm đà.',
    price: '125.000đ',
    image:
      'https://product.hstatic.net/200000567755/product/banh_mi_nam_nuong_1_giac_da_doi_2_1f6a3c07e26647b7892757f0bc54b494_master.png',
    items: ['Bánh mì x 1', 'Bò sốt tiêu x 2', 'Xà lách x 1'],
  },
  {
    id: 8,
    name: 'Combo Bánh Mì Hải Sản',
    description: 'Kết hợp tôm, cua, và sốt đặc biệt tạo nên hương vị hấp dẫn.',
    price: '130.000đ',
    image:
      'https://product.hstatic.net/200000567755/product/banh_mi_nam_nuong_1_giac_da_doi_2_1f6a3c07e26647b7892757f0bc54b494_master.png',
    items: ['Bánh mì x 1', 'Tôm x 2', 'Sốt đặc biệt x 1'],
  },
]

const ComboListCustomer = () => {
  const navigate = useNavigate()

  return (
    <div>
      <Header />
      <div className="combo-container">
        <Title level={2} className="combo-title">
          Danh sách Combo Bánh Mì
        </Title>
        <Row gutter={[16, 16]} justify="center">
          {combos.map((combo) => (
            <Col key={combo.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className="combo-card"
                onClick={() => navigate(`/combo/${combo.id}`)}
                cover={
                  <img
                    alt={combo.name}
                    src={combo.image}
                    className="combo-image"
                  />
                }
              >
                <div className="combo-content">
                  <Title level={5} className="combo-name">
                    {combo.name}
                  </Title>
                  <Text className="combo-description">{combo.description}</Text>
                  <div className="combo-items">
                    <Title level={5}>Sản phẩm trong combo:</Title>
                    <ul>
                      {combo.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="combo-footer">
                    <Text className="combo-price">{combo.price}</Text>
                    <Button type="primary" className="add-to-cart-button">
                      🛒 Thêm vào giỏ hàng
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default ComboListCustomer
