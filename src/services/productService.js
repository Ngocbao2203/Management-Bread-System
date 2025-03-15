import apiClient from "./apiClient";

// Hàm gọi API tạo sản phẩm mới
export const createProduct = async (productData) => {
    try {
      const response = await apiClient.post("/api/product/create", productData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create product");
    }
  };

// Hàm gọi API cập nhật sản phẩm
export const updateProduct = async (id, productData) => {
  try {
    const response = await apiClient.put(`/api/product/update/${id}`, productData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update product");
  }
};

// Hàm gọi API lấy danh sách sản phẩm
export const getProductList = async () => {
  try {
    const response = await apiClient.get("/api/product/get-list");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch product list");
  }
};

// Hàm gọi API lấy chi tiết sản phẩm theo ID
export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/api/product/get-by-id/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch product details");
  }
};

// Hàm gọi API thay đổi trạng thái sản phẩm
export const changeProductStatus = async (id, status) => {
  try {
    const response = await apiClient.patch(`/api/product/change-status/${id}`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to change product status");
  }
};