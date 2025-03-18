import { useState, useEffect } from 'react';
import { getAccountList, changeAccountStatus, updateAccount, updateAccountPassword, createAccount } from '../services/accountService';
import { getBranchList } from '../services/branchService';
import { toast } from 'react-toastify';

const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [role, setRole] = useState('');
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, [page, role]);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await getAccountList(role, page, size);
      setAccounts(response.data.items || []);
      setTotalPages(response.data.totalPages || 0);
      setError(null);
    } catch (error) {
      console.error('Error fetching accounts:', error.message);
      setError(error.message);
      toast.error(`Failed to load accounts: ${error.message}`);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await getBranchList(1, 100);
      setBranches(response.data.items || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching branches:', error.message);
      setError(error.message);
      toast.error(`Failed to load branches: ${error.message}`);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await changeAccountStatus(id, newStatus);
      setAccounts(
        accounts.map((account) =>
          account.id === id ? { ...account, isActive: newStatus } : account
        )
      );
      toast.success('Account status updated successfully');
    } catch (error) {
      console.error('Error changing account status:', error.message);
      setError(error.message);
      toast.error(`Failed to update status: ${error.message}`);
      throw error;
    }
  };

  const handleCreateAccount = async (accountData) => {
    try {
        // Ensure role is sent as a number, not a string
        if (accountData.role) {
            accountData.role = Number(accountData.role);
        }
        
        // Ensure branchId is sent as a number
        if (accountData.branchId) {
            accountData.branchId = Number(accountData.branchId);
        }
        
        console.log('Sending account data to create:', accountData);
        const response = await createAccount(accountData);
        await fetchAccounts();
        toast.success(response.message || 'Account created successfully');
        return response;
    } catch (error) {
        console.error('Error creating account - Details:', error.message);
        
        // Set the error message for the modal to display
        setError(error.message);
        toast.error(`Failed to create account: ${error.message}`);
        throw error;
    }
  };

  const handleUpdateAccount = async (id, values) => {
    try {
      await updateAccount(id, values);
      setAccounts(
        accounts.map((account) =>
          account.id === id ? { ...account, ...values } : account
        )
      );
      toast.success('Account updated successfully');
    } catch (error) {
      console.error('Error updating account:', error.message);
      setError(error.message);
      toast.error(`Failed to update account: ${error.message}`);
      throw error;
    }
  };

  const handleUpdatePassword = async (id, values) => {
    try {
      await updateAccountPassword(id, values);
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error.message);
      setError(error.message);
      toast.error(`Failed to update password: ${error.message}`);
      throw error;
    }
  };

  return {
    accounts,
    page,
    setPage,
    totalPages,
    role,
    setRole,
    branches,
    error,
    handleStatusChange,
    handleCreateAccount,
    handleUpdateAccount,
    handleUpdatePassword,
  };
};

export default useAccounts;