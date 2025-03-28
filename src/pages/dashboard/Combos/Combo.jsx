import { useState, useEffect } from 'react'
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Image,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Divider,
  Typography,
  notification,
  Spin,
  Switch,
} from 'antd'
import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import axios from 'axios'

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input

const Combos = () => {
  const [combos, setCombos] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [currentCombo, setCurrentCombo] = useState(null)
  const [products, setProducts] = useState([])
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  // Fetch combos list
  const fetchCombos = async (page = 1, size = 10) => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiBaseUrl}/api/combo/get-list`, {
        params: { page, size },
      })

      if (response.data.statusCode === 200) {
        setCombos(response.data.data.items)
        setPagination({
          current: response.data.data.page,
          pageSize: response.data.data.size,
          total: response.data.data.total,
        })
      } else {
        notification.error({
          message: 'Error',
          description: 'Failed to fetch combos',
        })
      }
    } catch (error) {
      console.error('Error fetching combos:', error)
      notification.error({
        message: 'Error',
        description: 'Failed to fetch combos',
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch products for combo creation/editing
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/product/get-list`)
      if (response.data.statusCode === 200) {
        setProducts(response.data.data.items)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  // Fetch combo details by ID
  const fetchComboById = async (id) => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${apiBaseUrl}/api/combo/get-by-id/${id}`
      )
      if (response.data.statusCode === 200) {
        setCurrentCombo(response.data.data)
        return response.data.data
      }
    } catch (error) {
      console.error('Error fetching combo details:', error)
      notification.error({
        message: 'Error',
        description: 'Failed to fetch combo details',
      })
    } finally {
      setLoading(false)
    }
  }

  // Create new combo
  const createCombo = async (values) => {
    setConfirmLoading(true)
    try {
      const payload = {
        comboName: values.comboName,
        description: values.description,
        price: values.price,
        imageUrl: values.imageUrl,
        createComboProductRequests: values.comboProducts.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }

      const response = await axios.post(
        `${apiBaseUrl}/api/combo/create`,
        payload
      )
      if (response.data.statusCode === 201) {
        notification.success({
          message: 'Success',
          description: 'Combo created successfully',
        })
        setEditModalVisible(false)
        fetchCombos(pagination.current, pagination.pageSize)
        setEditModalVisible(false)
      } else {
        notification.error({
          message: 'Error',
          description: response.data.message || 'Failed to create combo',
        })
      }
    } catch (error) {
      console.error('Error creating combo:', error)
      notification.error({
        message: 'Error',
        description: 'Failed to create combo',
      })
    } finally {
      setConfirmLoading(false)
    }
  }

  // Update existing combo
  const updateCombo = async (values) => {
    setConfirmLoading(true)
    try {
      const payload = {
        comboName: values.comboName,
        description: values.description,
        price: values.price,
        imageUrl: values.imageUrl,
        createComboProductRequests: values.comboProducts.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }

      const response = await axios.put(
        `${apiBaseUrl}/api/combo/update/${currentCombo.id}`,
        payload
      )
      if (response.data.statusCode === 200) {
        notification.success({
          message: 'Success',
          description: 'Combo updated successfully',
        })
        fetchCombos(pagination.current, pagination.pageSize)
        setEditModalVisible(false)
      } else {
        notification.error({
          message: 'Error',
          description: response.data.message || 'Failed to update combo',
        })
      }
    } catch (error) {
      console.error('Error updating combo:', error)
      notification.error({
        message: 'Error',
        description: 'Failed to update combo',
      })
    } finally {
      setConfirmLoading(false)
    }
  }

  // Handle table pagination change
  const handleTableChange = (pagination) => {
    fetchCombos(pagination.current, pagination.pageSize)
  }

  // Open view modal with combo details
  const handleViewCombo = async (id) => {
    const combo = await fetchComboById(id)
    if (combo) {
      setViewModalVisible(true)
    }
  }

  const handleToggleStatus = async (comboId, newStatus) => {
    try {
      const statusValue = newStatus ? 1 : 0
      const response = await axios.patch(
        `${apiBaseUrl}/api/combo/change-status/${comboId}`,
        null,
        {
          params: {
            isActive: statusValue,
          },
        }
      )

      if (response.data.statusCode === 200) {
        notification.success({
          message: 'Success',
          description: 'Status updated successfully',
        })
        fetchCombos(pagination.current, pagination.pageSize)
      } else {
        notification.error({
          message: 'Error',
          description: response.data.message || 'Failed to change status',
        })
      }
    } catch (error) {
      console.error('Error changing status:', error)
      notification.error({
        message: 'Error',
        description: 'Failed to change status',
      })
    }
  }

  // Open edit modal with combo details for editing
  const handleEditCombo = async (id) => {
    const combo = await fetchComboById(id)
    if (combo) {
      form.setFieldsValue({
        comboName: combo.comboName,
        description: combo.description,
        price: combo.price,
        imageUrl: combo.imageUrl,
        comboProducts: combo.comboProducts.map((cp) => ({
          productId: cp.product.id,
          quantity: cp.quantity,
        })),
      })
      setEditModalVisible(true)
    }
  }

  // Open create modal with empty form
  const handleCreateCombo = () => {
    setCurrentCombo(null)
    form.resetFields()
    form.setFieldsValue({
      comboProducts: [{ productId: undefined, quantity: 1 }],
    })
    setEditModalVisible(true)
  }

  // Handle form submission
  const handleFormSubmit = (values) => {
    if (currentCombo) {
      updateCombo(values)
    } else {
      createCombo(values)
    }
  }

  useEffect(() => {
    fetchCombos()
    fetchProducts()
  }, [])

  // Table columns configuration
  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => (
        <Image
          src={imageUrl || '/placeholder.svg'}
          alt="Combo"
          width={80}
          height={80}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Combo Name',
      dataIndex: 'comboName',
      key: 'comboName',
      sorter: (a, b) => a.comboName.localeCompare(b.comboName),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString()} VND`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          onChange={(checked) => handleToggleStatus(record.id, checked)}
        />
      ),
    },
    {
      title: 'Products',
      key: 'products',
      render: (_, record) => (
        <span>{record.comboProducts?.length || 0} products</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            onClick={() => handleViewCombo(record.id)}
            icon={<EyeOutlined />}
          />
          <Button
            type="text"
            onClick={() => handleEditCombo(record.id)}
            icon={<EditOutlined />}
          />
        </Space>
      ),
    },
  ]

  return (
    <div className="combo-management">
      <Card
        title={<Title level={4}>Combo Management</Title>}
        extra={
          <Button
            type="primary"
            onClick={handleCreateCombo}
            icon={<PlusOutlined />}
          >
            Add New Combo
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={combos}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>

      {/* View Combo Modal */}
      <Modal
        title="Combo Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setViewModalVisible(false)
              handleEditCombo(currentCombo.id)
            }}
          >
            Edit
          </Button>,
        ]}
        width={800}
      >
        {currentCombo ? (
          <div className="combo-details">
            <div style={{ display: 'flex', marginBottom: 20 }}>
              <div style={{ marginRight: 20 }}>
                <Image
                  src={currentCombo.imageUrl || '/placeholder.svg'}
                  alt={currentCombo.comboName}
                  width={200}
                  height={200}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Title level={4}>{currentCombo.comboName}</Title>
                <Text type="secondary">{currentCombo.description}</Text>
                <Divider />
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <div>
                    <Text strong>Price:</Text>
                    <Text>
                      {typeof currentCombo.price === 'number'
                        ? `${currentCombo.price.toLocaleString()} VND`
                        : 'N/A'}
                    </Text>
                  </div>
                  <div>
                    <Text strong>Status:</Text>
                    <Tag
                      color={currentCombo.isActive ? 'green' : 'red'}
                      style={{ marginLeft: 8 }}
                    >
                      {currentCombo.isActive ? 'Active' : 'Inactive'}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>

            <Divider orientation="left">Products in Combo</Divider>
            <Table
              dataSource={currentCombo.comboProducts}
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
                  title: 'Price',
                  dataIndex: ['product', 'price'],
                  key: 'price',
                  render: (price) =>
                    typeof price === 'number'
                      ? `${price.toLocaleString()} VND`
                      : 'N/A',
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
                    record.product?.price && record.quantity
                      ? `${(record.product.price * record.quantity).toLocaleString()} VND`
                      : 'N/A',
                },
              ]}
              summary={(pageData) => {
                const total = pageData.reduce(
                  (sum, item) =>
                    sum +
                    (item.product?.price && item.quantity
                      ? item.product.price * item.quantity
                      : 0),
                  0
                )

                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4} align="right">
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
        ) : (
          <Spin />
        )}
      </Modal>

      {/* Create/Edit Combo Modal */}
      <Modal
        title={currentCombo ? 'Edit Combo' : 'Create New Combo'}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            comboProducts: [{ productId: undefined, quantity: 1 }],
          }}
        >
          <Form.Item
            name="comboName"
            label="Combo Name"
            rules={[{ required: true, message: 'Please enter combo name' }]}
          >
            <Input placeholder="Enter combo name" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="Enter price"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Image URL"
            rules={[{ required: true, message: 'Please enter image URL' }]}
          >
            <Input placeholder="Enter image URL" />
          </Form.Item>

          <Divider orientation="left">Products in Combo</Divider>

          <Form.List name="comboProducts">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{ display: 'flex', marginBottom: 8, gap: 8 }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'productId']}
                      rules={[
                        { required: true, message: 'Please select a product' },
                      ]}
                      style={{ flex: 3 }}
                    >
                      <Select placeholder="Select product">
                        {products.map((product) => (
                          <Option key={product.id} value={product.id}>
                            {product.productName} -{' '}
                            {product.price
                              ? product.price.toLocaleString()
                              : 'N/A'}{' '}
                            VND
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      rules={[
                        { required: true, message: 'Please enter quantity' },
                      ]}
                      style={{ flex: 1 }}
                    >
                      <InputNumber
                        min={1}
                        placeholder="Qty"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Product
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <div
              style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}
            >
              <Button onClick={() => setEditModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={confirmLoading}>
                {currentCombo ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Combos
