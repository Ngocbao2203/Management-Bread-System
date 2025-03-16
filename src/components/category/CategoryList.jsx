const CategoryList = ({ categories, setEditCategory }) => {
    return (
      <ul className="categories-list">
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((category) => (
            <li key={category.id} className="category-item">
              <span>
                {category.name || "Unnamed Category"}
                {category.isTemporary && <small style={{ color: "gray" }}> (Chưa đồng bộ)</small>}
              </span>
              <button onClick={() => setEditCategory(category)} className="edit-btn">
                Edit
              </button>
            </li>
          ))
        ) : (
          <li className="no-categories">Không có danh mục nào để hiển thị.</li>
        )}
      </ul>
    );
  };
  
  export default CategoryList;