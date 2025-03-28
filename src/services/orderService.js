import apiClient from "./apiClient";

export const getOrders = async (page = 1, size = 10) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const response = await apiClient.get("/api/order/get-list", {
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
                    throw new Error("Invalid data: missing order ID");
                }
                return {
                    id: item.id,
                    customerName: item.customerName || "",
                    orderDate: item.orderDate || new Date().toISOString(),
                    status: item.status || "pending",
                    paymentMethod: item.paymentMethod || "",
                    orderType: item.orderType || "",
                    totalAmount: item.totalAmount || 0,
                    orderDetails: item.orderDetails || [],
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
        console.error("Error fetching orders:", error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || "Error fetching orders");
    }
};

export const createOrder = async (orderData) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        // Validate required fields
        if (!orderData.customerName || !orderData.paymentMethod || !orderData.orderType || !orderData.orderDetails) {
            throw new Error("Missing required fields: customerName, paymentMethod, orderType or orderDetails");
        }

        // Prepare payload
        const payload = {
            customerName: orderData.customerName.trim(),
            paymentMethod: orderData.paymentMethod,
            orderType: orderData.orderType,
            branchId: orderData.branchId || 1, // Đảm bảo branchId luôn có giá trị
            orderDetails: orderData.orderDetails.map(detail => ({
                productId: detail.productId ? parseInt(detail.productId) : null,  // Đảm bảo `null` nếu không có
                comboId: detail.comboId ? parseInt(detail.comboId) : null,       // Đảm bảo `null` nếu không có
                quantity: detail.quantity || 0,
                unitPrice: detail.unitPrice || 0,
                orderToppings: (detail.orderToppings || []).map(topping => ({
                    ingredientId: topping.ingredientId || 0,
                    quantity: topping.quantity || 0
                }))
            }))
        };

        console.log("Sending payload to create order:", payload);

        const response = await apiClient.post("/api/order/create", payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Response from create order:", response.data);

        if (response.data && (response.data.statusCode === 201 || response.data.statusCode === 200)) {
            return {
                id: response.data.data?.id || String(Date.now()),
                ...payload,
                status: response.data.data?.status || "pending",
                orderDate: response.data.data?.orderDate || new Date().toISOString(),
                totalAmount: response.data.data?.totalAmount || 0
            };
        }

        throw new Error("Unexpected response structure from server or invalid status code");
    } catch (error) {
        console.error("Full error details:", error.response ? error.response.data : error.message);
        const errorMessage =
            error.response?.data?.title ||
            Object.values(error.response?.data?.errors || {}).flat().join(", ") ||
            error.message ||
            "Error creating order";
        throw new Error(errorMessage);
    }
};


export const updateOrderStatus = async (id, statusData) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        if (!id || (typeof id !== "string" && typeof id !== "number")) {
            throw new Error("Invalid order ID. ID must be a non-empty string or number.");
        }

        if (!statusData.status) {
            throw new Error("Status is required");
        }

        const payload = {
            status: statusData.status
        };

        console.log("Sending payload to update order status:", payload);

        const response = await apiClient.patch(`/api/order/update-status/${String(id)}`, payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Response from update order status:", response.data);

        if (response.data && (response.data.statusCode === 200 || response.data.statusCode === 0)) {
            return {
                id: String(id),
                status: statusData.status
            };
        }

        throw new Error("Unexpected response structure from server or invalid status code");
    } catch (error) {
        console.error("Full error details:", error.response ? error.response.data : error.message);
        const errorMessage =
            error.response?.data?.title ||
            error.response?.data?.message ||
            error.message ||
            "Error updating order status";
        throw new Error(errorMessage);
    }
};

export const deleteOrder = async (id) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        if (!id || (typeof id !== "string" && typeof id !== "number")) {
            throw new Error("Invalid order ID. ID must be a non-empty string or number.");
        }

        const response = await apiClient.delete(`/api/order/delete/${String(id)}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Response from delete order:", response.data);

        if (response.data && (response.data.statusCode === 200 || response.data.statusCode === 0 || response.data.statusCode === 204)) {
            return {
                id: String(id),
                deleted: true
            };
        }

        throw new Error("Unexpected response structure from server or invalid status code");
    } catch (error) {
        console.error("Full error details:", error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || "Error deleting order");
    }
};