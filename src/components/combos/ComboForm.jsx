import { useState, useEffect } from 'react'
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Divider,
  Space,
  Switch,
  Typography,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Option } = Select
const { Title } = Typography

const ComboForm = ({
  initialValues,
  products,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [form] = Form.useForm()
  const [totalPrice, setTotalPrice] = useState(0)

  // Set initial form values when editing
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        comboName: initialValues.comboName,
        description: initialValues.description,
        price: initialValues.price,
        imageUrl: initialValues.imageUrl,
        isActive: initialValues.isActive,
        comboProducts: initialValues.comboProducts?.map((cp) => ({
          productId: cp.product.id,
          quantity: cp.quantity,
        })) || [{ productId: undefined, quantity: 1 }],
      })
    } else {
      form.setFieldsValue({
        isActive: true,
        comboProducts: [{ productId: undefined, quantity: 1 }],
      })
    }
  }, [initialValues, form])

  // Calculate total price based on selected products
  const calculateTotalPrice = () => {
    const comboProducts = form.getFieldValue('comboProducts') || []
    let total = 0

    comboProducts.forEach((cp) => {
      if (cp.productId && cp.quantity) {
        const product = products.find((p) => p.id === cp.productId)
        if (product) {
          total += product.price * cp.quantity
        }
      }
    })

    setTotalPrice(total)
  }

  // Update total price when form values change
  const handleValuesChange = () => {
    calculateTotalPrice()
  }

  useEffect(() => {
    calculateTotalPrice()
  }, [])

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      onValuesChange={handleValuesChange}
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

      <Space style={{ width: '100%' }}>
        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please enter price' }]}
          style={{ width: '50%' }}
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
          name="isActive"
          label="Status"
          valuePropName="checked"
          style={{ width: '50%' }}
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
      </Space>

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
                  <Select
                    placeholder="Select product"
                    onChange={() => calculateTotalPrice()}
                  >
                    {products.map((product) => (
                      <Option key={product.id} value={product.id}>
                        {product.productName} -{' '}
                        {product.price ? product.price.toLocaleString() : 'N/A'}{' '}
                        VND
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'quantity']}
                  rules={[{ required: true, message: 'Please enter quantity' }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber
                    min={1}
                    placeholder="Qty"
                    style={{ width: '100%' }}
                    onChange={() => calculateTotalPrice()}
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

      <Divider />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Title level={5}>
          Calculated Total: {totalPrice.toLocaleString()} VND
        </Title>
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? 'Update Combo' : 'Create Combo'}
          </Button>
        </Space>
      </div>
    </Form>
  )
}

export default ComboForm
