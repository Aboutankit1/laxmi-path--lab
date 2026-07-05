import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";

export default function InventoryFormModal({ open, onClose }) {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  useEffect(() => { if (open) reset({ category: "Reagent", unit: "pcs", lowStockThreshold: 10 }); }, [open, reset]);

  const mutation = useMutation({
    mutationFn: (payload) => api.post("/inventory", payload),
    onSuccess: () => {
      toast.success("Item added");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Something went wrong"),
  });

  return (
    <Modal open={open} onClose={onClose} title="Add Inventory Item"
      footer={<>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit((d) => mutation.mutate(d))} loading={mutation.isPending}>Add Item</Button>
      </>}>
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Item Name" className="sm:col-span-2" {...register("itemName", { required: true })} />
        <Select label="Category" {...register("category")}>
          {["Reagent","Chemical","Test Kit","Consumable","Equipment"].map((c) => <option key={c}>{c}</option>)}
        </Select>
        <Input label="Vendor" {...register("vendor")} />
        <Input label="Quantity" type="number" {...register("quantity", { required: true })} />
        <Input label="Unit" {...register("unit")} />
        <Input label="Purchase Date" type="date" {...register("purchaseDate")} />
        <Input label="Expiry Date" type="date" {...register("expiryDate")} />
        <Input label="Low Stock Threshold" type="number" {...register("lowStockThreshold")} />
      </form>
    </Modal>
  );
}
