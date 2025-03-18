const IngredientList = ({
  createProductIngredientsRequest,
  setNewProduct,
  ingredients,
}) => {
  const handleAddIngredient = () => {
    setNewProduct((prev) => ({
      ...prev,
      createProductIngredientsRequest: [
        ...prev.createProductIngredientsRequest,
        { ingredientId: "", quantity: 0 },
      ],
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    setNewProduct((prev) => {
      const updatedIngredients = [...prev.createProductIngredientsRequest];
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        [field]: value,
      };
      return { ...prev, createProductIngredientsRequest: updatedIngredients };
    });
  };

  return (
    <div className="form-group">
      <label>Nguyên liệu</label>
      {createProductIngredientsRequest.map((ingredient, index) => (
        <div key={index} className="ingredient-row">
          <select
            value={ingredient.ingredientId}
            onChange={(e) => handleIngredientChange(index, "ingredientId", e.target.value)}
            required
          >
            <option value="">Chọn nguyên liệu</option>
            {ingredients.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Số lượng"
            value={ingredient.quantity}
            onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
            required
          />
        </div>
      ))}
      <button type="button" onClick={handleAddIngredient}>
        Thêm nguyên liệu
      </button>
    </div>
  );
};

export default IngredientList;