import '../../styles/ProductListCustomer.css'
import { getProductList } from '../../services/productService'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Header from '../../components/Header'
import { Link } from 'react-router-dom'
import Pagination from '../../components/Pagination'

const ProductListCustomer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [size] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await getProductList(page, size);
      console.log("Result from getProductList:", result);
      setProducts(result.products || []);
      setTotalItems(result.pagination.total || result.products.length);
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
    fetchProducts();
  }, [page, size]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Header />
      <div className="product-list-customer">
        <h2 className="title">TẤT CẢ SẢN PHẨM</h2>
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <Link to={`/products/${product.id}`}>
                <img src={product.imageUrl} alt={product.name} className="product-image" />
                <h3>{product.name}</h3>
              </Link>
              <p className="product-price">{product.price}</p>
              <button className="add-to-cart-btn">Thêm vào giỏ hàng</button>
            </div>
          ))}
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

    </>
  )
}

export default ProductListCustomer
