/* eslint-disable react/prop-types */
import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import { createOrder } from "../../api/OrderApi";

const CreateOrderModal = ({ open, onClose, onOrderCreated }) => {
  const [customer, setCustomer] = useState("");
  const [total, setTotal] = useState("");

  const handleCreate = async () => {
    const newOrder = await createOrder({ customer, total, status: "Pending" });
    onOrderCreated(newOrder);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Tạo đơn hàng mới</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Khách hàng" value={customer} onChange={(e) => setCustomer(e.target.value)} />
        <TextField fullWidth label="Tổng tiền" type="number" value={total} onChange={(e) => setTotal(e.target.value)} />
        <Button onClick={handleCreate} variant="contained">Tạo đơn</Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrderModal;
