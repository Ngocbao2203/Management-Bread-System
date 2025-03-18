import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getProductList } from "../../services/productService";
import Pagination from "../../components/Pagination";
import ProductTable from "../../components/products/ProductTable";
import AddProductModal from "../../components/products/AddProductModal";
import "../../styles/Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [size] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

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
    <div className="products-container">
      <div className="products-header">
        <h2>Danh sách sản phẩm</h2>
        <button onClick={() => setShowAddModal(true)} className="add-btn">
          Thêm sản phẩm
        </button>
      </div>

      <ProductTable products={products} fetchProducts={fetchProducts} />

      {totalItems > 0 && (
        <Pagination
          page={page}
          totalItems={totalItems}
          size={size}
          handlePageChange={handlePageChange}
        />
      )}

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onProductAdded={fetchProducts}
      />
    </div>
  );
};

export default Products;