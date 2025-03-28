import React from 'react'
import { Card, Button, Row, Col, Typography } from 'antd'
import Header from '../../components/Header'
import { useNavigate } from 'react-router-dom'
import '../../styles/ComboListCustomer.css'
import { getComboList } from '../../services/conboService'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Pagination from '../../components/Pagination'
const { Title, Text } = Typography

const ComboListCustomer = () => {
  const navigate = useNavigate()
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [size] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCombos = async () => {
    setLoading(true);
    try {
      const result = await getComboList(page, size);
      console.log("Result from getComboList:", result);
      setCombos(result.combos || []);
      setTotalItems(result.pagination.total || result.combos.length);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalItems / size)) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, [page, size]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
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
                    src={combo.imageUrl}
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
                      {combo.comboProducts.map((item, index) => (
                        <li key={index}>{item.product.productName}</li>
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
      {totalItems > 0 && (
        <Pagination
          page={page}
          totalItems={totalItems}
          size={size}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default ComboListCustomer
