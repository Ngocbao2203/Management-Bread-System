import { useState} from "react";
import { toast } from "react-toastify";
import { createProduct } from "../../services/productService";
import { useFetchData } from "../../hooks/useFetchData";
import CategorySelect from "./CategorySelect";
import IngredientList from "./IngredientList";

const INITIAL_PRODUCT = {
  productName: "",
  imageUrl: "", // Người dùng sẽ nhập URL thủ công
  description: "",
  price: 0,
  categoryId: "",
  createProductIngredientsRequest: [],
};

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [newProduct, setNewProduct] = useState(INITIAL_PRODUCT);
  const [imagePreview, setImagePreview] = useState(""); // Dùng để xem trước URL ảnh
  const { categories, ingredients, loading } = useFetchData();

  // Xử lý thay đổi URL ảnh (không upload, chỉ nhập URL)
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setNewProduct({ ...newProduct, imageUrl: url });
    setImagePreview(url); // Cập nhật preview nếu URL hợp lệ
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        categoryId: parseInt(newProduct.categoryId, 10),
        createProductIngredientsRequest: newProduct.createProductIngredientsRequest.map(
          (ingredient) => ({
            ingredientId: parseInt(ingredient.ingredientId, 10),
            quantity: parseFloat(ingredient.quantity),
          })
        ),
      };

      await createProduct(productData);
      toast.success("Product created successfully");
      setNewProduct(INITIAL_PRODUCT);
      setImagePreview("");
      onClose();
      onProductAdded();
    } catch (err) {
      toast.error(err.message || "Error creating product");
      console.error("Error in AddProductModal:", err);
    }
  };

  if (!isOpen) return null;

  if (loading) return <div>Loading categories and ingredients...</div>;

  return (
    <div className="modal">
      <div className="modal-content-product">
        <h3>Thêm sản phẩm mới</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên sản phẩm</label>
            <input
              type="text"
              value={newProduct.productName}
              onChange={(e) =>
                setNewProduct({ ...newProduct, productName: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>URL ảnh (nhập trực tiếp)</label>
            <input
              type="text"
              value={newProduct.imageUrl}
              onChange={handleImageUrlChange}
              placeholder="Nhập URL ảnh (ví dụ: https://example.com/image.jpg)"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="image-preview"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Giá</label>
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              required
            />
          </div>
          <CategorySelect
            categoryId={newProduct.categoryId}
            setNewProduct={setNewProduct}
            categories={categories}
          />
          <IngredientList
            createProductIngredientsRequest={newProduct.createProductIngredientsRequest}
            setNewProduct={setNewProduct}
            ingredients={ingredients}
          />
          <div className="modal-actions">
            <button type="submit" className="submit-btn">
              Tạo sản phẩm
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;