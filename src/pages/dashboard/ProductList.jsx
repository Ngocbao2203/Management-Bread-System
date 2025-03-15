import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProductList, changeProductStatus } from "../../services/productService"; // Import từ productService
import { toast } from "react-toastify";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductList();
        setProducts(data.data); // Giả sử API trả về { data: [...] }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleChangeStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await changeProductStatus(id, newStatus);
      setProducts(products.map(product => 
        product.id === id ? { ...product, status: newStatus } : product
      ));
      toast.success(`Product status changed to ${newStatus}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/edit-product/${id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      {products.length === 0 ? (
        <p>Không có sản phẩm nào.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tên sản phẩm</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Giá</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Trạng thái</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.id}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.price}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.status}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <button
                    onClick={() => handleEdit(product.id)}
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                      marginRight: "5px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleChangeStatus(product.id, product.status)}
                    style={{
                      backgroundColor: product.status === "Active" ? "#ff4444" : "#44ff44",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    {product.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;