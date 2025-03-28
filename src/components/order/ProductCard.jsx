import { Card, Typography, Button } from 'antd';
import styled from 'styled-components';
import { PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

const StyledCard = styled(Card)`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .ant-card-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
`;

const ProductImage = styled.img`
  height: 140px;
  object-fit: cover;
  width: 100%;
`;

const AddButton = styled(Button)`
  background-color: #ff5722;
  border-color: #ff5722;
  color: white;
  
  &:hover {
    background-color: #e64a19;
    border-color: #e64a19;
    color: white;
  }
`;

const ProductCard = ({ item, type, onAdd }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <StyledCard
      cover={
        <ProductImage
          alt={item.name}
          src={item.imageUrl || `/placeholder-${type}.jpg`}
        />
      }
    >
      <Text 
        strong
        style={{ 
          color: '#1890ff',
          marginBottom: 8,
          display: 'block'
        }}
      >
        {item.name}
      </Text>
      <Text 
        strong
        style={{ 
          color: '#1890ff',
          fontSize: 16
        }}
      >
        {formatCurrency(item.price)}
      </Text>
      <div style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: 16 }}>
        <AddButton 
          size="small"
          icon={<PlusOutlined />}
          onClick={() => onAdd(item, type)}
        >
          Thêm
        </AddButton>
      </div>
    </StyledCard>
  );
};

export default ProductCard;