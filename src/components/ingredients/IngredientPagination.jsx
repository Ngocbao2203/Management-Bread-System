const IngredientPagination = ({ page, totalItems, size, handlePageChange }) => {
  if (totalItems <= 0) return null;

  return (
    <div className="pagination">
      <button
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      >
        Trang trước
      </button>
      <span>
        Trang {page} / {Math.ceil(totalItems / size)}
      </span>
      <button
        disabled={page >= Math.ceil(totalItems / size)}
        onClick={() => handlePageChange(page + 1)}
      >
        Trang sau
      </button>
    </div>
  );
};

export default IngredientPagination;