import { Descriptions, Image, Tag, Table, Typography, Divider } from 'antd'

const { Text, Title } = Typography

const ComboDetail = ({ combo }) => {
  if (!combo) return null

  return (
    <div className="combo-detail">
      <div style={{ display: 'flex', marginBottom: 20 }}>
        <div style={{ marginRight: 20 }}>
          <Image
            src={combo.imageUrl || '/placeholder.svg'}
            alt={combo.comboName}
            width={200}
            height={200}
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Title level={4}>{combo.comboName}</Title>
          <Text type="secondary">{combo.description}</Text>
          <Divider />
          <Descriptions column={1}>
            <Descriptions.Item label="Price">
              {combo.price.toLocaleString()} VND
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={combo.isActive ? 'green' : 'red'}>
                {combo.isActive ? 'Active' : 'Inactive'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Products">
              {combo.comboProducts?.length || 0} products
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>

      <Divider orientation="left">Products in Combo</Divider>
      <Table
        dataSource={combo.comboProducts}
        rowKey={(record) => `${record.product.id}-${record.quantity}`}
        pagination={false}
        columns={[
          {
            title: 'Image',
            dataIndex: ['product', 'imageUrl'],
            key: 'imageUrl',
            render: (imageUrl) => (
              <Image
                src={imageUrl || '/placeholder.svg'}
                alt="Product"
                width={60}
                height={60}
                style={{ objectFit: 'cover' }}
              />
            ),
          },
          {
            title: 'Product Name',
            dataIndex: ['product', 'productName'],
            key: 'productName',
          },
          {
            title: 'Description',
            dataIndex: ['product', 'description'],
            key: 'description',
            ellipsis: true,
          },
          {
            title: 'Price',
            dataIndex: ['product', 'price'],
            key: 'price',
            render: (price) => `${price.toLocaleString()} VND`,
          },
          {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
          },
          {
            title: 'Subtotal',
            key: 'subtotal',
            render: (_, record) =>
              `${(record.product.price * record.quantity).toLocaleString()} VND`,
          },
        ]}
        summary={(pageData) => {
          const total = pageData.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          )
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={5} align="right">
                <Text strong>Total:</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text strong>{total.toLocaleString()} VND</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )
        }}
      />
    </div>
  )
}

export default ComboDetail
