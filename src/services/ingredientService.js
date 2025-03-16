import apiClient from "./apiClient"; // Giả sử bạn dùng axios

export const getIngredients = async (page = 1, size = 10) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const response = await apiClient.get("/api/ingredient/get-list", {
            params: { page, size },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data && response.data.data) {
            const { items, total, page: currentPage, size: pageSize, totalPages } = response.data.data;

            const formattedItems = items.map(item => {
                if (!item.id) {
                    console.error("Item missing id:", item);
                    throw new Error("Invalid data: missing ingredient ID");
                }
                return {
                    id: item.id,
                    name: item.ingredientName || item.name, // Hỗ trợ cả ingredientName và name
                    quantity: item.quantity || 0,
                    unit: item.unit || "",
                    price: item.price || 0,
                    status: item.isActive ? "active" : "inactive",
                };
            });

            return {
                items: formattedItems,
                totalItems: total,
                currentPage,
                pageSize,
                totalPages,
            };
        }

        throw new Error("Invalid response structure from server");
    } catch (error) {
        console.error("Error fetching ingredients:", error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || "Error fetching ingredients");
    }
};

export const getIngredientById = async (id) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        // Kiểm tra id hợp lệ
        if (!id || (typeof id !== "string" && typeof id !== "number")) {
            throw new Error("Invalid ingredient ID. ID must be a non-empty string or number.");
        }

        const response = await apiClient.get(`/api/ingredient/get-by-id/${String(id)}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data && response.data.data) {
            const item = response.data.data;
            return {
                id: item.id,
                name: item.ingredientName,
                quantity: item.quantity,
                unit: item.unit,
                price: item.price,
                status: item.isActive ? "active" : "inactive",
            };
        }

        throw new Error("Invalid response structure from server");
    } catch (error) {
        console.error("Error fetching ingredient by id:", error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || "Error fetching ingredient by id");
    }
};

export const createIngredient = async (ingredientData) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        // Kiểm tra dữ liệu trước khi gửi
        if (!ingredientData.name || ingredientData.quantity == null || !ingredientData.unit || ingredientData.price == null) {
            throw new Error("Missing required fields: name, quantity, unit, or price");
        }

        // Chuẩn hóa payload theo yêu cầu của backend
        const payload = {
            ingredientName: ingredientData.name.trim(),
            quantity: Number(ingredientData.quantity) || 0,
            unit: ingredientData.unit.trim(),
            price: Number(ingredientData.price) || 0,
        };

        console.log("Sending payload to create ingredient:", payload);

        const response = await apiClient.post("/api/ingredient/create", payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Response from create ingredient:", response.data);

        // Kiểm tra response từ API
        if (response.data && (response.data.statusCode === 201 || response.data.statusCode === 200)) {
            // Nếu API không trả về data, trả về một đối tượng dựa trên payload
            if (!response.data.data) {
                return {
                    id: String(Date.now()), // Tạo ID tạm thời (sẽ được làm mới bởi fetchIngredients)
                    name: ingredientData.name.trim(),
                    quantity: Number(ingredientData.quantity) || 0,
                    unit: ingredientData.unit.trim(),
                    price: Number(ingredientData.price) || 0,
                    status: "active", // Giả định trạng thái mặc định
                };
            }
            // Nếu API trả về data, sử dụng data từ response
            return {
                id: response.data.data.id,
                name: response.data.data.ingredientName || ingredientData.name,
                quantity: response.data.data.quantity || ingredientData.quantity,
                unit: response.data.data.unit || ingredientData.unit,
                price: response.data.data.price || ingredientData.price,
                status: response.data.data.status || "active",
            };
        }

        throw new Error("Unexpected response structure from server or invalid status code");
    } catch (error) {
        console.error("Full error details:", error.response ? error.response.data : error.message);
        const errorMessage =
            error.response?.data?.title ||
            error.response?.data?.errors?.ingredientName?.[0] ||
            error.response?.data?.errors?.unit?.[0] ||
            error.response?.data?.errors?.quantity?.[0] ||
            error.response?.data?.errors?.price?.[0] ||
            error.message ||
            "Error creating ingredient";
        throw new Error(errorMessage);
    }
};

export const updateIngredient = async (id, ingredientData) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        if (!id || (typeof id !== "string" && typeof id !== "number")) {
            throw new Error("Invalid ingredient ID. ID must be a non-empty string or number.");
        }

        if (!ingredientData.name || ingredientData.quantity == null || ingredientData.price == null) {
            throw new Error("Missing required fields: name, quantity, or price");
        }

        // Chuẩn hóa payload cho ingredient (dựa trên các API trước đó)
        const payload = {
            ingredientName: ingredientData.name.trim(),
            quantity: Number(ingredientData.quantity) || 0,
            unit: ingredientData.unit?.trim() || "", // Đảm bảo có unit, nếu không thì để trống
            price: Number(ingredientData.price) || 0,
        };

        console.log("Sending payload to update ingredient:", payload);

        // Sử dụng endpoint đúng cho ingredient
        const response = await apiClient.put(`/api/ingredient/update/${String(id)}`, payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Response from update ingredient:", response.data);

        // Xử lý response
        if (response.data && (response.data.statusCode === 200 || response.data.statusCode === 0)) {
            // Trả về object dựa trên dữ liệu gửi lên
            return {
                id: String(id),
                name: ingredientData.name.trim(),
                quantity: Number(ingredientData.quantity) || 0,
                unit: ingredientData.unit?.trim() || "",
                price: Number(ingredientData.price) || 0,
                status: ingredientData.status || "active",
            };
        }

        throw new Error("Unexpected response structure from server or invalid status code");
    } catch (error) {
        console.error("Full error details:", error.response ? error.response.data : error.message);
        const errorMessage = error.response?.data?.title ||
            Object.values(error.response?.data?.errors || {}).flat().join(", ") ||
            error.response?.data?.message ||
            error.message ||
            "Error updating ingredient";
        throw new Error(errorMessage);
    }
};

export const changeIngredientStatus = async (id, status) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        if (!id || (typeof id !== "string" && typeof id !== "number")) {
            throw new Error("Invalid ingredient ID. ID must be a non-empty string or number.");
        }

        const isActive = status === "active" ? 1 : 0;

        const response = await apiClient.patch(
            `/api/ingredient/change-status/${String(id)}?isActive=${isActive}`,
            null,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("Response from change status:", response.data);

        // Xử lý cả statusCode: 200 và statusCode: 0
        if (response.data && (response.data.statusCode === 200 || response.data.statusCode === 0)) {
            return {
                id: String(id),
                status: isActive === 1 ? "active" : "inactive",
                name: "", // Sẽ được cập nhật từ state hiện tại
                quantity: 0,
                unit: "",
                price: 0,
            };
        }

        throw new Error("Unexpected response structure from server or invalid status code");
    } catch (error) {
        console.error("Full error details:", error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || "Error changing ingredient status");
    }
};