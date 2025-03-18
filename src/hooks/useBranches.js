import { useState, useEffect } from 'react';
import { createBranch, getBranchList, getBranchById, changeBranchStatus, updateBranch } from '../services/branchService';
import { toast } from 'react-toastify';

const useBranches = () => {
  const [branches, setBranches] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, [page]);

  const fetchBranches = async () => {
    try {
      const response = await getBranchList(page, size);
      console.log('Fetched branches data:', response.data); // Debug dữ liệu gốc
      const branchItems = response.data.items || []; // Lấy items từ data
      console.log('Processed branch items:', branchItems); // Debug danh sách items
      setBranches(branchItems);
      setTotalPages(response.data.totalPages || 0);
      setError(null);
    } catch (error) {
      console.error('Error fetching branches:', error.message);
      setError(error.message || 'Failed to fetch branches');
      toast.error('Failed to load branches. Please check backend.');
    }
  };

  const handleCreateBranch = async (branchData) => {
    try {
      const response = await createBranch(branchData);
      if (response.success) {
        await fetchBranches();
        toast.success('Branch created successfully');
      }
    } catch (error) {
      console.error('Error creating branch:', error.message);
      toast.error(error.message || 'Failed to create branch');
      throw error;
    }
  };

  const handleUpdateBranch = async (id, branchData) => {
    if (!id) {
      throw new Error('Branch ID is required for update');
    }
    try {
      const response = await updateBranch(id, branchData);
      if (response.success) {
        await fetchBranches();
        toast.success('Branch updated successfully');
      }
    } catch (error) {
      console.error('Error updating branch:', error.message);
      toast.error(error.message || 'Failed to update branch');
      throw error;
    }
  };

  const handleChangeBranchStatus = async (id, isActive) => {
    if (!id) {
      throw new Error('Branch ID is required for status change');
    }
    try {
      const response = await changeBranchStatus(id, isActive);
      if (response.success) {
        setBranches(
          branches.map((branch) =>
            branch.id === id ? { ...branch, isActive: isActive } : branch
          )
        );
        toast.success('Branch status changed successfully');
      }
    } catch (error) {
      console.error('Error changing branch status:', error.message);
      toast.error(error.message || 'Failed to change branch status');
      throw error;
    }
  };

  return {
    branches,
    page,
    setPage,
    totalPages,
    error,
    handleCreateBranch,
    handleUpdateBranch,
    handleChangeBranchStatus,
  };
};

export default useBranches;