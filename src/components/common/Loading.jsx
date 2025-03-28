import { Spin, Typography } from 'antd';
import styled from 'styled-components';

const { Text } = Typography;

// Styled component để giữ giao diện giống MUI
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
`;

const StyledSpin = styled(Spin)`
  .ant-spin-dot-item {
    background-color: #1976d2; /* Màu primary giống MUI */
  }
`;

const Loading = () => {
  return (
    <LoadingContainer>
      <StyledSpin size="large" />
      <Text type="secondary" style={{ marginTop: 16 }}>
        Đang tải...
      </Text>
    </LoadingContainer>
  );
};

export default Loading;