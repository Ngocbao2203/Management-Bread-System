import apiClient from "./apiClient";

export const getCategories = async (page = 1, size = 10) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please log in.");

    const response = await apiClient.get("/api/category/get-list", {
      params: { page, size },
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log("API get categories response:", response);
    
    // Kiểm tra cấu trúc dữ liệu trả về
    if (response.data && response.data.data && Array.isArray(response.data.data.items)) {
      return response.data.data;
    } else if (response.data && Array.isArray(response.data.items)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data)) {
      return { items: response.data };
    } else {
      console.error("Unexpected data structure from API:", response.data);
      return { items: [] };
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error(error.response?.data?.message || "Error fetching categories");
  }
};

export const getCategoryById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please log in.");

    const response = await apiClient.get(`/api/category/get-by-id/${id}`, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data.data;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw new Error(error.response?.data?.message || `Error fetching category with ID: ${id}`);
  }
};

export const createCategory = async (categoryData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please log in.");

    const payload = { categoryName: categoryData.categoryName };
    const response = await apiClient.post("/api/category/create", payload, {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log("Create category response:", response);
    
    // Xử lý response theo nhiều cấu trúc có thể có
    if (response.data && response.data.data) {
      return response.data.data;
    } else if (response.data) {
      return response.data;
    } else {
      throw new Error("No data returned from server");
    }
  } catch (error) {
    console.error("Create category API error:", error);
    throw new Error(error.response?.data?.message || "Error creating category");
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    // Nếu là ID tạm thời, không gọi API
    if (String(id).startsWith('temp-')) {
      console.warn("Attempting to update a temporary category. Skip API call.");
      return { id, name: categoryData.categoryName };
    }

    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please log in.");

    const response = await apiClient.put(`/api/category/update/${id}`, categoryData, {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log("Update category response:", response);
    
    // Xử lý response theo nhiều cấu trúc có thể có
    if (response.data && response.data.data) {
      return response.data.data;
    } else if (response.data) {
      return response.data;
    } else {
      throw new Error("No data returned from server");
    }
  } catch (error) {
    console.error("Update category API error:", error);
    throw new Error(error.response?.data?.message || "Error updating category");
  }
};