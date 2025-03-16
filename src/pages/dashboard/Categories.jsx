import { useState, useEffect } from "react";
import { getCategories } from "../../services/categoryService";
import CategoryForm from "../../components/category/CategoryForm";
import CategoryList from "../../components/category/CategoryList";
import EditCategoryModal from "../../components/category/EditCategoryModal";
import Pagination from "../../components/category/Pagination";
import "../../styles/Categories.css";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editCategory, setEditCategory] = useState(null);
    const [page, setPage] = useState(1);
    const [size] = useState(5);
    const [totalItems, setTotalItems] = useState(0);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await getCategories(page, size);
            console.log("API Response:", response);
            if (response && response.items && Array.isArray(response.items)) {
                const validCategories = response.items.map((category, index) => ({
                    ...category,
                    id: category.id || `temp-id-${index}`,
                    name: category.name || category.categoryName || "Unnamed Category",
                    isTemporary: !category.id,
                }));
                setCategories(validCategories);
                setTotalItems(response.total || validCategories.length); // Sử dụng response.total thay vì response.totalItems
                console.log("Total Items set to:", response.total);
                setError(null);
            } else {
                setCategories([]);
                setTotalItems(0);
                setError("Dữ liệu danh mục không hợp lệ.");
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError(err.message || "Đã xảy ra lỗi khi tải danh mục.");
            setCategories([]);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [page, size]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= Math.ceil(totalItems / size)) {
            setPage(newPage);
        }
    };

    return (
        <div className="categories-container">
            <h2>Quản lý Danh mục</h2>
            {error && <div className="error-message">{error}</div>}
            <CategoryForm setCategories={setCategories} setError={setError} fetchCategories={fetchCategories} />
            <button onClick={fetchCategories} className="refresh-btn" style={{ marginTop: "10px" }}>
                Làm mới danh sách
            </button>
            {loading && <div className="loading">Đang tải...</div>}
            <CategoryList categories={categories} setEditCategory={setEditCategory} />
            {console.log("Checking Pagination - Total Items:", totalItems) || (totalItems > 0 && (
                <Pagination
                    page={page}
                    totalItems={totalItems}
                    size={size}
                    handlePageChange={handlePageChange}
                />
            ))}
            {editCategory && (
                <EditCategoryModal
                    editCategory={editCategory}
                    setEditCategory={setEditCategory}
                    setCategories={setCategories}
                    setError={setError}
                    fetchCategories={fetchCategories}
                />
            )}
        </div>
    );
};

export default Categories;