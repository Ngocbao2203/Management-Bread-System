const CategorySelect = ({ categoryId, setNewProduct, categories }) => {
  return (
    <div className="form-group">
      <label>Danh mục</label>
      <select
        value={categoryId}
        onChange={(e) => setNewProduct((prev) => ({ ...prev, categoryId: e.target.value }))}
        required
      >
        <option value="">Chọn danh mục</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;