import { useState } from 'react';
import { Typography, Button, Form } from 'antd';
import useBranches from '../../hooks/useBranches';
import BranchTable from '../../components/branchs/BranchTable';
import EditBranchModal from '../../components/branchs/EditBranchModal';
import CreateBranchModal from '../../components/branchs/CreateBranchModal';
import Pagination from '../../components/Pagination';

const { Title } = Typography;

const Branchs = () => {
  const {
    branches,
    page,
    setPage,
    totalPages,
    handleCreateBranch,
    handleUpdateBranch,
    handleChangeBranchStatus,
  } = useBranches();

  const [editForm] = Form.useForm();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBranch, setEditBranch] = useState(null);

  const [createForm] = Form.useForm();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleEdit = (branch) => {
    if (!branch || !branch.id) {
      console.error('Invalid branch data:', branch);
      return;
    }
    setEditBranch(branch);
    editForm.setFieldsValue({
      branchName: branch.branchName,
      address: branch.address,
      city: branch.city,
      district: branch.district,
      phoneNumber: branch.phoneNumber,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditBranch(null);
    editForm.resetFields();
  };

  const handleUpdateBranchSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      if (editBranch && editBranch.id) {
        await handleUpdateBranch(editBranch.id, values);
        handleCloseEditModal();
      } else {
        throw new Error('Branch ID is undefined');
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleOpenCreateModal = () => {
    createForm.resetFields();
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  const handleCreateBranchSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      await handleCreateBranch(values);
      handleCloseCreateModal();
    } catch (error) {
      console.error('Create branch failed:', error);
    }
  };

  const handleToggleStatus = (id, isActive) => {
    handleChangeBranchStatus(id, isActive ? 1 : 0); // Chuyển đổi trạng thái (1: active, 0: inactive)
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={2}>Branch Management</Title>
        <Button type="primary" onClick={handleOpenCreateModal}>
          Create New Branch
        </Button>
      </div>

      <BranchTable
        branches={branches}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(newPage) => setPage(newPage)}
            color="primary"
          />
        </div>
      )}

      <EditBranchModal
        visible={isEditModalOpen}
        onOk={handleUpdateBranchSubmit}
        onCancel={handleCloseEditModal}
        initialValues={editBranch}
        form={editForm}
      />

      <CreateBranchModal
        visible={isCreateModalOpen}
        onOk={handleCreateBranchSubmit}
        onCancel={handleCloseCreateModal}
        form={createForm}
      />
    </div>
  );
};

export default Branchs;