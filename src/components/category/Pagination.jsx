const Pagination = ({ page, totalItems, size, handlePageChange }) => {
    const totalPages = Math.ceil(totalItems / size);
    console.log("Pagination - Total Items:", totalItems, "Total Pages:", totalPages);

    if (totalItems <= 0) return null;

    return (
        <div className="pagination">
            <button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
            >
                Trang trước
            </button>
            <span style={{ margin: "0 10px" }}>
                Trang {page} / {totalPages}
            </span>
            <button
                className="pagination-btn"
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
            >
                Trang sau
            </button>
        </div>
    );
};

export default Pagination;