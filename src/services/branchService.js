import apiClient from "./apiClient";

// Tạo chi nhánh mới
export const createBranch = async (branchData) => {
  try {
    const response = await apiClient.post("/api/branch/create", branchData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Branch created successfully",
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create branch");
  }
};

// Lấy danh sách chi nhánh
export const getBranchList = async (page = 1, size = 10) => {
  try {
    const response = await apiClient.get("/api/branch/get-list", {
      params: {
        page,
        size,
      },
    });
    console.log('API response for getBranchList:', response.data); // Debug phản hồi API
    return {
      success: true,
      data: response.data.data, // Lấy data từ response
      message: response.data.message || "Branches retrieved successfully",
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    console.error('Error in getBranchList:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to retrieve branch list");
  }
};

// Lấy thông tin chi nhánh theo ID
export const getBranchById = async (id) => {
  if (!id) {
    throw new Error('Branch ID is required');
  }
  try {
    const response = await apiClient.get(`/api/branch/get-by-id/${id}`);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Branch retrieved successfully",
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to retrieve branch");
  }
};

// Cập nhật trạng thái chi nhánh
export const changeBranchStatus = async (id, isActive) => {
  if (!id) {
    throw new Error('Branch ID is required');
  }
  try {
    const response = await apiClient.patch(`/api/branch/change-status/${id}`, null, {
      params: { isActive },
    });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Branch status changed successfully",
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to change branch status");
  }
};

// Cập nhật thông tin chi nhánh
export const updateBranch = async (id, branchData) => {
  if (!id) {
    throw new Error('Branch ID is required');
  }
  try {
    const response = await apiClient.put(`/api/branch/update/${id}`, branchData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Branch updated successfully",
      statusCode: response.data.statusCode || 200,
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update branch");
  }
};