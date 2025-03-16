import { useState } from "react";
import { updateCategory } from "../../services/categoryService";

const EditCategoryModal = ({ editCategory, setEditCategory, setCategories, setError, fetchCategories }) => {
  const [editCategoryName, setEditCategoryName] = useState(editCategory.name);
  const [loading, setLoading] = useState(false);

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editCategoryName.trim()) {
      setError("Tên danh mục không được để trống.");
      return;
    }

    setLoading(true);
    try {
      const payload = { categoryName: editCategoryName };
      if (editCategory.isTemporary || String(editCategory.id).startsWith("temp-")) {
        const updatedCategory = { ...editCategory, name: editCategoryName };
        setCategories((prev) =>
          prev.map((cat) => (cat.id === editCategory.id ? updatedCategory : cat))
        );
      } else {
        await updateCategory(editCategory.id, payload);
        await fetchCategories();
      }
      setEditCategory(null);
      setError(null);
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi cập nhật danh mục.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Chỉnh sửa danh mục</h3>
        <form onSubmit={handleUpdateCategory}>
          <input
            type="text"
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" className="update-btn" disabled={loading}>
            Cập nhật
          </button>
          <button type="button" onClick={() => setEditCategory(null)} className="cancel-btn" disabled={loading}>
            Hủy
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;