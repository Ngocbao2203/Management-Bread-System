import apiClient from "./apiClient";

export const createAccount = async (accountData) => {
    try {
        console.log('Sending account data to create:', accountData);
        const response = await apiClient.post("/api/account/create", accountData);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message || "Account created successfully",
            statusCode: response.data.statusCode || 201,
        };
    } catch (error) {
        console.error('Error creating account - Response:', error.response?.data);
        
        // Handle validation errors more specifically
        if (error.response?.data?.errors) {
            const errors = error.response.data.errors;
            let errorMessage = "";
            
            // Process Role error specifically
            if (errors.Role) {
                errorMessage = `Role error: ${errors.Role.join(', ')}`;
            } 
            // Process other validation errors
            else {
                // Create a string of all validation errors
                errorMessage = Object.entries(errors)
                    .map(([key, messages]) => `${key}: ${messages.join(', ')}`)
                    .join('; ');
            }
            
            throw new Error(errorMessage || "Validation failed");
        }
        
        throw new Error(error.response?.data?.title || error.response?.data?.message || "Failed to create account");
    }
};

export const updateAccount = async (id, accountData) => {
    try {
        const response = await apiClient.put(`/api/account/update/${id}`, accountData);
        return {
            success: true,
            data: response.data,
            message: response.data.message || "Account updated successfully",
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to update account");
    }
};

export const updateAccountPassword = async (id, passwordData) => {
    try {
        const response = await apiClient.put(`/api/account/update-password/${id}`, passwordData);
        return {
            success: true,
            data: response.data,
            message: response.data.message || "Password updated successfully",
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to update password");
    }
};

export const getAccountList = async (role = '', page = 1, size = 10) => {
    try {
        const response = await apiClient.get('/api/account/get-list', {
            params: {
                role: role || undefined,
                page,
                size,
            },
        });
        return {
            success: true,
            data: response.data.data,
            message: response.data.message || 'Accounts retrieved successfully',
            statusCode: response.data.statusCode,
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to retrieve account list');
    }
};

export const getAccountById = async (id) => {
    try {
        const response = await apiClient.get(`/api/account/get-by-id/${id}`);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message || 'Account retrieved successfully',
            statusCode: response.data.statusCode,
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to retrieve account');
    }
};

export const changeAccountStatus = async (id, isActive) => {
    try {
        const response = await apiClient.patch(`/api/account/change-status/${id}`, null, {
            params: {
                isActive,
            },
        });
        return {
            success: true,
            data: response.data.data,
            message: response.data.message || 'Account status updated successfully',
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update account status');
    }
};