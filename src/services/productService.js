import apiClient from "./apiClient";

// Hàm gọi API tạo sản phẩm mới
export const createProduct = async (productData) => {
  try {
    const response = await apiClient.post("/api/product/create", productData);
    return {
      success: true,
      data: response.data,
      message: response.data.message || "Product created successfully",
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create product");
  }
};

// Hàm gọi API cập nhật sản phẩm
export const updateProduct = async (id, productData) => {
  try {
    const response = await apiClient.put(`/api/product/update/${id}`, productData);
    console.log("Response from updateProduct:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in updateProduct:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || "Failed to update product");
  }
};

export const getProductList = async (page = 1, size = 5) => {
  try {
    const response = await apiClient.get("/api/product/get-list", {
      params: { page, size },
    });

    // Log chi tiết để kiểm tra
    console.log("Full API Response from getProductList:", response);
    console.log("response.data:", response.data);
    console.log("response.data.data:", response.data?.data);
    console.log("response.data.data.items:", response.data?.data?.items);

    // Kiểm tra nếu response.data hoặc response.data.data không tồn tại
    if (!response.data || !response.data.data) {
      console.warn("Invalid API response structure:", response.data);
      return {
        products: [],
        pagination: { size: 0, page: 0, total: 0, totalPages: 0 },
      };
    }

    const { data } = response.data;

    // Kiểm tra nếu data.items không tồn tại
    const items = data.items || [];
    const mappedProducts = items.map((item) => ({
      id: item.id,
      name: item.productName, // Ánh xạ productName thành name
      price: item.price,
      status: item.isActive ? "Active" : "Inactive", // Ánh xạ isActive thành status
      imageUrl: item.imageUrl,
      category: item.category?.categoryName || "N/A", // Ánh xạ categoryName
      ingredients: item.productIngredients?.map((pi) => ({
        name: pi.ingredient?.ingredientName || "N/A", // Ánh xạ ingredientName
        quantity: pi.quantity,
      })) || [],
    }));

    return {
      products: mappedProducts,
      pagination: {
        size: data.size || 0,
        page: data.page || 0,
        total: data.total || 0,
        totalPages: data.totalPages || 0,
      },
    };
  } catch (error) {
    console.error("Error in getProductList:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config,
    });
    return {
      products: [],
      pagination: { size: 0, page: 0, total: 0, totalPages: 0 },
    };
  }
};

export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/api/product/get-by-id/${id}`);
    console.log("API Response from getProductById:", response.data);

    // Kiểm tra nếu response.data hoặc response.data.data không tồn tại
    if (!response.data || !response.data.data) {
      throw new Error("Invalid API response: 'data' is undefined");
    }

    const item = response.data.data;
    return {
      id: item.id,
      name: item.productName,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      categoryId: item.categoryId,
      category: item.category?.categoryName || "N/A",
      isActive: item.isActive,
      ingredients: item.productIngredients?.map((pi) => ({
        ingredientId: pi.ingredient?.id,
        name: pi.ingredient?.ingredientName || "N/A",
        quantity: pi.quantity,
      })) || [],
    };
  } catch (error) {
    console.error("Error in getProductById:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || "Failed to fetch product details");
  }
};

export const changeProductStatus = async (id, isActive) => {
  try {
    // Đảm bảo isActive là 1 hoặc 0
    const isActiveValue = isActive ? 1 : 0;
    const response = await apiClient.patch(`/api/product/change-status/${id}`, null, {
      params: { isActive: isActiveValue },
    });
    console.log("Response from changeProductStatus:", response); // Log để kiểm tra
    return response.data;
  } catch (error) {
    console.error("Error in changeProductStatus:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || "Failed to change product status");
  }
};