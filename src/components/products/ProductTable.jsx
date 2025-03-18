import { useState } from "react";
import { toast } from "react-toastify";
import { changeProductStatus } from "../../services/productService";
import EditProductModal from "../products/EditProductModal";

const ProductTable = ({ products, fetchProducts }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    const isActive = newStatus === "Active";
    try {
      await changeProductStatus(id, isActive);
      await fetchProducts();
      toast.success(`Product status changed to ${newStatus}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (id) => {
    setSelectedProductId(id); // Lưu ID sản phẩm cần chỉnh sửa
    setEditModalOpen(true); // Mở modal
  };

  if (!products || !products.length) {
    return <p>Không có sản phẩm nào.</p>;
  }

  return (
    <>
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Nguyên liệu</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => (e.target.src = "/path/to/placeholder-image.jpg")}
                  />
                ) : (
                  "N/A"
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.price.toLocaleString("vi-VN")}</td>
              <td>{product.category || "N/A"}</td>
              <td>
                {product.ingredients && product.ingredients.length > 0 ? (
                  <ul className="ingredient-list">
                    {product.ingredients.map((ing, index) => (
                      <li key={index}>
                        {ing.name} {ing.quantity ? `(${ing.quantity})` : ""}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "N/A"
                )}
              </td>
              <td>{product.status}</td>
              <td>
                <button onClick={() => handleEdit(product.id)} className="edit-btn">
                  Edit
                </button>
                <button
                  onClick={() => handleStatusChange(product.id, product.status)}
                  className={`status-btn ${product.status === "Active" ? "deactivate" : "activate"}`}
                >
                  {product.status === "Active" ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditProductModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedProductId(null);
        }}
        productId={selectedProductId}
        onProductUpdated={fetchProducts}
      />
    </>
  );
};

export default ProductTable;