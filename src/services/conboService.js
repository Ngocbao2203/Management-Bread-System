import apiClient from "./apiClient";

// Hàm gọi API tạo sản phẩm mới
export const createCombo = async (comboData) => {
  try {
    const response = await apiClient.post("/api/combo/create", comboData);
    return {
      success: true,
      data: response.data,
      message: response.data.message || "Combo created successfully",
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create combo");
  }
};

// Hàm gọi API cập nhật sản phẩm
export const updateCombo = async (id, comboData) => {
  try {
    const response = await apiClient.put(`/api/combo/update/${id}`, comboData);
    console.log("Response from updateCombo:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in updateCombo:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || "Failed to update combo");
  }
};

export const getComboList = async (page = 1, size = 5) => {
  try {
    const response = await apiClient.get("/api/combo/get-list", {
      params: { page, size },
    });

    // Log chi tiết để kiểm tra
    console.log("Full API Response from getComboList:", response);
    console.log("response.data:", response.data);
    console.log("response.data.data:", response.data?.data);
    console.log("response.data.data.items:", response.data?.data?.items);

    // Kiểm tra nếu response.data hoặc response.data.data không tồn tại
    if (!response.data || !response.data.data) {
      console.warn("Invalid API response structure:", response.data);
      return {
        combos: [],
        pagination: { size: 0, page: 0, total: 0, totalPages: 0 },
      };
    }

    const { data } = response.data;

    // Kiểm tra nếu data.items không tồn tại
    const items = data.items || [];
    const mappedCombos = items.map((item) => ({
      id: item.id,
      name: item.comboName,
      price: item.price,
      status: item.isActive ? "Active" : "Inactive",
      imageUrl: item.imageUrl,
      description: item.description,
      comboProducts: item.comboProducts,
    }));

    return {
      combos: mappedCombos,
      pagination: {
        size: data.size || 0,
        page: data.page || 0,
        total: data.total || 0,
        totalPages: data.totalPages || 0,
      },
    };
  } catch (error) {
    console.error("Error in getComboList:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config,
    });
    return {
      combos: [],
      pagination: { size: 0, page: 0, total: 0, totalPages: 0 },
    };
  }
};

export const getComboById = async (id) => {
  try {
    const response = await apiClient.get(`/api/combo/get-by-id/${id}`);
    console.log("API Response from getComboById:", response.data);

    // Kiểm tra nếu response.data hoặc response.data.data không tồn tại
    if (!response.data || !response.data.data) {
      throw new Error("Invalid API response: 'data' is undefined");
    }

    const item = response.data.data;
    return {
        id: item.id,
        name: item.comboName,
        price: item.price,
        status: item.isActive ? "Active" : "Inactive",
        imageUrl: item.imageUrl,
        description: item.description,
        comboProducts: item.comboProducts,
    };
  } catch (error) {
    console.error("Error in getComboById:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || "Failed to fetch combo details");
  }
};
