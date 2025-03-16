import React from "react";

const EditIngredientModal = ({ editIngredient, formData, handleInputChange, handleUpdateIngredient, setEditIngredient }) => {
  if (!editIngredient) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-content">
        <div className="edit-modal-header">
          <h3>Chỉnh sửa nguyên liệu</h3>
          <button
            className="edit-modal-close-btn"
            onClick={() => setEditIngredient(null)}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleUpdateIngredient} className="edit-form">
          <div className="edit-form-group">
            <label htmlFor="name">Tên nguyên liệu:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập tên nguyên liệu"
              required
            />
          </div>
          <div className="edit-form-group">
            <label htmlFor="quantity">Số lượng:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Nhập số lượng"
              min="0"
              required
            />
          </div>
          <div className="edit-form-group">
            <label htmlFor="unit">Đơn vị:</label>
            <input
              type="text"
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              placeholder="Nhập đơn vị (g, kg, ml, v.v.)"
              required
            />
          </div>
          <div className="edit-form-group">
            <label htmlFor="price">Giá (VNĐ):</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Nhập giá"
              min="0"
              required
            />
          </div>
          <div className="edit-form-actions">
            <button type="submit" className="edit-submit-btn">
              Cập nhật
            </button>
            <button
              type="button"
              onClick={() => setEditIngredient(null)}
              className="edit-cancel-btn"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIngredientModal;