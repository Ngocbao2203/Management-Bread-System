import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getProductById, updateProduct } from "../../services/productService";
import "../../styles/EditProductModal.css"

const EditProductModal = ({ isOpen, onClose, productId, onProductUpdated }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State cho form chỉnh sửa
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: "",
    isActive: true,
  });

  // Lấy dữ liệu sản phẩm khi modal mở
  useEffect(() => {
    if (!isOpen || !productId) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await getProductById(productId);
        setProduct(response);
        setFormData({
          productName: response.name || "",
          description: response.description || "",
          price: response.price || "",
          imageUrl: response.imageUrl || "",
          categoryId: response.categoryId || "",
          isActive: response.isActive || false,
        });
        setError(null);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [isOpen, productId]);

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        id: productId,
        productName: formData.productName,
        description: formData.description,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl,
        categoryId: parseInt(formData.categoryId),
        isActive: formData.isActive,
      };
      await updateProduct(productId, updatedProduct);
      toast.success("Product updated successfully");
      onProductUpdated(); // Gọi callback để làm mới danh sách
      onClose(); // Đóng modal
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Chỉnh sửa sản phẩm</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {product && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên sản phẩm</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Giá</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>URL hình ảnh</label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Danh mục ID</label>
              <input
                type="number"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Hoạt động
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">
                Lưu
              </button>
              <button type="button" onClick={onClose} className="cancel-btn">
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProductModal;