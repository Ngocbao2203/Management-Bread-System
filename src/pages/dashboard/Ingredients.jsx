import { useState, useEffect } from "react";
import {
    getIngredients,
    createIngredient,
    updateIngredient,
    changeIngredientStatus,
} from "../../services/ingredientService";
import IngredientForm from "../../components/ingredients/IngredientForm";
import IngredientTable from "../../components/ingredients/IngredientTable";
import IngredientPagination from "../../components/ingredients/IngredientPagination";
import EditIngredientModal from "../../components/ingredients/EditIngredientModal";
import "../../styles/Ingredients.css";

const Ingredients = () => {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        quantity: 0,
        unit: "",
        price: 0,
    });
    const [editIngredient, setEditIngredient] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchIngredients();
    }, [page, size]);

    const fetchIngredients = async () => {
        try {
            setLoading(true);
            const response = await getIngredients(page, size);

            if (response && response.items && Array.isArray(response.items)) {
                console.log("Fetched ingredients:", response.items);
                setIngredients(response.items);
                setTotalItems(response.totalItems || 0);
                setTotalPages(response.totalPages || 0);
            } else {
                setIngredients([]);
                setError("Dữ liệu nguyên liệu không hợp lệ.");
            }
        } catch (err) {
            setError(err.message || "Đã xảy ra lỗi khi tải nguyên liệu.");
            console.error("Lỗi khi tải nguyên liệu:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCreateIngredient = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.unit.trim() || formData.quantity == null || formData.price == null) {
            setError("Tất cả các trường (tên, đơn vị, số lượng, giá) là bắt buộc và không được để trống.");
            return;
        }

        try {
            await createIngredient(formData);
            // Làm mới danh sách nguyên liệu từ API
            await fetchIngredients();
            setFormData({ name: "", quantity: 0, unit: "", price: 0 });
            setShowCreateForm(false);
            setError(null);
        } catch (err) {
            setError(err.message || "Đã xảy ra lỗi khi tạo nguyên liệu.");
            console.error("Error creating ingredient:", err);
        }
    };

    const handleEdit = (ingredient) => {
        console.log("Editing ingredient:", ingredient);
        setEditIngredient(ingredient);
        setFormData({
            name: ingredient.name || "",
            quantity: ingredient.quantity || 0,
            unit: ingredient.unit || "",
            price: ingredient.price || 0,
        });
    };

    const handleUpdateIngredient = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || formData.quantity == null || formData.price == null) {
            setError("Tất cả các trường (tên, số lượng, giá) là bắt buộc và không được để trống.");
            return;
        }

        if (editIngredient) {
            try {
                const updatedIngredient = await updateIngredient(editIngredient.id, formData);
                setIngredients((prevIngredients) =>
                    prevIngredients.map((ing) =>
                        ing.id === editIngredient.id
                            ? {
                                ...ing,
                                ...updatedIngredient,
                            }
                            : ing
                    )
                );
                setEditIngredient(null);
                setFormData({ name: "", quantity: 0, unit: "", price: 0 });
                setError(null);
            } catch (err) {
                setError(err.message || "Đã xảy ra lỗi khi cập nhật nguyên liệu.");
                console.error("Lỗi cập nhật nguyên liệu:", err);
            }
        }
    };

    const handleChangeStatus = async (id, newStatus) => {
        if (!id) {
            setError("ID của nguyên liệu không hợp lệ.");
            console.error("Invalid ingredient ID:", id, "Ingredients state:", ingredients);
            return;
        }

        try {
            console.log("Changing status for ID:", id, "New status:", newStatus);
            const updatedIngredient = await changeIngredientStatus(id, newStatus);
            setIngredients((prevIngredients) =>
                prevIngredients.map((ing) =>
                    ing.id === id
                        ? {
                            ...ing,
                            status: updatedIngredient.status,
                        }
                        : ing
                )
            );
            setError(null);
        } catch (err) {
            setError(err.message || "Đã xảy ra lỗi khi thay đổi trạng thái.");
            console.error("Lỗi thay đổi trạng thái:", err);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    if (loading && ingredients.length === 0) return <div className="loading">Đang tải...</div>;

    return (
        <div className="ingredients-container">
            <h2>Quản lý Nguyên liệu</h2>

            {/* Nút "Tạo nguyên liệu" */}
            <button className="create-btn" onClick={() => setShowCreateForm(true)}>
                Tạo nguyên liệu
            </button>

            {/* Form tạo mới (Modal) */}
            {showCreateForm && (
                <div className="create-form-modal">
                    <div className="create-form-content">
                        <div className="modal-header">
                            <h3>Tạo nguyên liệu mới</h3>
                            <button
                                className="modal-close-btn"
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setError(null);
                                }}
                            >
                                &times;
                            </button>
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <IngredientForm
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleCreateIngredient}
                            setShowForm={setShowCreateForm}
                            mode="create"
                        />
                    </div>
                </div>
            )}

            {/* Form chỉnh sửa (Modal) */}
            {editIngredient && (
                <EditIngredientModal
                    editIngredient={editIngredient}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleUpdateIngredient={handleUpdateIngredient}
                    setEditIngredient={setEditIngredient}
                />
            )}

            <IngredientTable
                ingredients={ingredients}
                handleEdit={handleEdit}
                handleChangeStatus={handleChangeStatus}
            />
            {totalItems > 0 && (
                <IngredientPagination
                    page={page}
                    totalItems={totalItems}
                    totalPages={totalPages}
                    size={size}
                    handlePageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default Ingredients;