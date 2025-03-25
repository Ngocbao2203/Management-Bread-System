import Header from '../../components/Header'
import '../../styles/ProductListCustomer.css'
import kebabImage from '../../assets/images/kebab.jpg'
import { Link } from 'react-router-dom'

const ProductListCustomer = () => {
  const products = [
    {
      id: 1,
      name: 'Donut Balls',
      price: '30.000đ',
      image: kebabImage,
    },
    {
      id: 2,
      name: 'Pandan Chiffon',
      price: '138.000đ',
      image: kebabImage,
    },
    {
      id: 3,
      name: 'Tiramisu C',
      price: '650.000đ',
      image: kebabImage,
    },
    {
      id: 4,
      name: 'Tiramisu R',
      price: '490.000đ',
      image: kebabImage,
    },
    {
      id: 5,
      name: 'Bánh mì Thịt Nướng',
      price: '45.000đ',
      image: kebabImage,
    },
  ]

  return (
    <>
      <Header />
      <div className="product-list-customer">
        <h2 className="title">TẤT CẢ SẢN PHẨM</h2>
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <Link to={`/products/${product.id}`}>
                <img src={product.image} alt={product.name} className="product-image" />
                <h3>{product.name}</h3>
              </Link>
              <p className="product-price">{product.price}</p>
              <button className="add-to-cart-btn">Thêm vào giỏ hàng</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ProductListCustomer
