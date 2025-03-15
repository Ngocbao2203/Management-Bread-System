import { useState } from "react";
import { createProduct } from "../../services/productService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    imageUrl: "",
    description: "",
    price: 0,
    categoryId: 0,
    createProductIngredientsRequest: [],
  });
  const [newIngredient, setNewIngredient] = useState({ ingredientId: 0, quantity: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIngredientChange = (e) => {
    const { name, value } = e.target;
    setNewIngredient({ ...newIngredient, [name]: parseInt(value) || 0 });
  };

  const addIngredient = () => {
    if (newIngredient.ingredientId <= 0 || newIngredient.quantity <= 0) {
      toast.error("Vui lòng nhập ID nguyên liệu và số lượng hợp lệ!");
      return;
    }
    setFormData({
      ...formData,
      createProductIngredientsRequest: [...formData.createProductIngredientsRequest, newIngredient],
    });
    setNewIngredient({ ingredientId: 0, quantity: 0 }); // Reset form nhập nguyên liệu
  };

  const removeIngredient = (index) => {
    setFormData({
      ...formData,
      createProductIngredientsRequest: formData.createProductIngredientsRequest.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Chuyển đổi giá trị price và categoryId thành số
    const productData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      categoryId: parseInt(formData.categoryId) || 0,
    };

    try {
      await createProduct(productData);
      toast.success("Product created successfully!");
      navigate("/dashboard/products");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Thêm sản phẩm</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto" }}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="productName">Tên sản phẩm:</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="imageUrl">URL hình ảnh:</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="description">Mô tả:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px", minHeight: "100px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="price">Giá:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="categoryId">ID danh mục:</label>
          <input
            type="number"
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            min="0"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        {/* Phần thêm nguyên liệu */}
        <div style={{ marginBottom: "15px" }}>
          <h3>Thêm nguyên liệu</h3>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label htmlFor="ingredientId">ID nguyên liệu:</label>
              <input
                type="number"
                id="ingredientId"
                name="ingredientId"
                value={newIngredient.ingredientId}
                onChange={handleIngredientChange}
                min="0"
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div>
              <label htmlFor="quantity">Số lượng:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={newIngredient.quantity}
                onChange={handleIngredientChange}
                min="0"
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <button
              type="button"
              onClick={addIngredient}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "8px 15px",
                cursor: "pointer",
                marginTop: "25px",
              }}
            >
              Thêm nguyên liệu
            </button>
          </div>

          {/* Hiển thị danh sách nguyên liệu đã thêm */}
          {formData.createProductIngredientsRequest.length > 0 && (
            <div>
              <h4>Danh sách nguyên liệu:</h4>
              <ul>
                {formData.createProductIngredientsRequest.map((ingredient, index) => (
                  <li key={index}>
                    ID nguyên liệu: {ingredient.ingredientId}, Số lượng: {ingredient.quantity}
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      style={{
                        backgroundColor: "#ff4444",
                        color: "white",
                        border: "none",
                        padding: "3px 8px",
                        marginLeft: "10px",
                        cursor: "pointer",
                      }}
                    >
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#44ff44",
            color: "white",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;