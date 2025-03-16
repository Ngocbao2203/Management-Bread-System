const IngredientForm = ({ formData, handleInputChange, handleSubmit, setShowForm, mode }) => {
  return (
    <form onSubmit={handleSubmit} className="ingredient-form">
      <div className="form-group">
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
      <div className="form-group">
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
      <div className="form-group">
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
      <div className="form-group">
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
      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {mode === "create" ? "Tạo" : "Cập nhật"}
        </button>
        {mode === "create" && (
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setShowForm(false)}
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
};

export default IngredientForm;