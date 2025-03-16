const IngredientTable = ({ ingredients, handleEdit, handleChangeStatus }) => {
  return (
    <div className="ingredients-table-container">
      <table className="ingredients-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Số lượng</th>
            <th>Đơn vị</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {ingredients && ingredients.length > 0 ? (
            ingredients.map((ingredient, index) => {
              // Kiểm tra xem ingredient có hợp lệ không
              if (!ingredient || ingredient.id === undefined || ingredient.id === null) {
                console.error("Missing ingredient ID at index", index, ":", ingredient);
                return null; // Bỏ qua phần tử không hợp lệ
              }

              const isCurrentlyActive = ingredient.status === "active";

              return (
                <tr key={ingredient.id || `ingredient-${index}`}>
                  <td>{ingredient.name || "Chưa đặt tên"}</td>
                  <td>{ingredient.quantity || 0}</td>
                  <td>{ingredient.unit || "-"}</td>
                  <td>{ingredient.price ? `${ingredient.price.toLocaleString()} VNĐ` : "0 VNĐ"}</td>
                  <td>
                    <span className={`status-badge ${isCurrentlyActive ? "active" : "inactive"}`}>
                      {isCurrentlyActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button onClick={() => handleEdit(ingredient)} className="edit-btn">
                      Sửa
                    </button>
                    <button
                      onClick={() => {
                        console.log("Button clicked for ingredient:", ingredient);
                        if (!ingredient.id) {
                          console.error("Missing ingredient ID:", ingredient);
                          return;
                        }

                        const newStatus = isCurrentlyActive ? "inactive" : "active";
                        console.log("Changing status for ID:", ingredient.id, "to:", newStatus);

                        handleChangeStatus(ingredient.id, newStatus);
                      }}
                      className={`status-btn ${isCurrentlyActive ? "deactivate" : "activate"}`}
                    >
                      {isCurrentlyActive ? "Ngừng" : "Kích hoạt"}
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="no-data">Không có nguyên liệu nào để hiển thị.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IngredientTable;