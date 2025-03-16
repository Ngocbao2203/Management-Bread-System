import { useState } from "react";
import { createCategory } from "../../services/categoryService";

const CategoryForm = ({ setCategories, setError, fetchCategories }) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError("Tên danh mục không được để trống.");
      return;
    }
  
    setLoading(true);
    try {
      const payload = { categoryName: newCategoryName };
      const response = await createCategory(payload);
      const newCategory = {
        id: response?.id || `temp-id-${Date.now()}`,
        name: response?.name || response?.categoryName || newCategoryName,
        isTemporary: !response?.id,
      };
      setCategories((prev) => [...prev, newCategory]);
      setNewCategoryName("");
      setError(null);
      await fetchCategories(); // Làm mới danh sách để cập nhật totalItems
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tạo danh mục.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateCategory} className="category-form">
      <input
        type="text"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        placeholder="Nhập tên danh mục"
        required
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        Tạo danh mục
      </button>
    </form>
  );
};

export default CategoryForm;