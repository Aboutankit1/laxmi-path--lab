import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";

export default function StaffFormModal({ open, onClose }) {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload) => api.post("/staff", payload),
    onSuccess: () => {
      toast.success("Staff member added");
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      onClose();
      reset();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Something went wrong"),
  });

  return (
    <Modal open={open} onClose={onClose} title="Add Staff Member"
      footer={<>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit((d) => mutation.mutate(d))} loading={mutation.isPending}>Add Staff</Button>
      </>}>
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Full Name" {...register("name", { required: true })} />
        <Input label="Email" type="email" {...register("email", { required: true })} />
        <Input label="Phone" {...register("phone")} />
        <Input label="Password" type="password" {...register("password", { required: true, minLength: 6 })} />
        <Select label="Role" {...register("role")}>
          <option value="receptionist">Receptionist</option>
          <option value="technician">Lab Technician</option>
          <option value="admin">Admin</option>
        </Select>
        <Select label="Designation" {...register("designation")}>
          <option>Receptionist</option><option>Lab Technician</option><option>Admin</option>
        </Select>
        <Input label="Salary (₹)" type="number" {...register("salary")} />
        <Select label="Shift" {...register("shift")}>
          <option>Morning</option><option>Evening</option><option>Night</option><option>Full Day</option>
        </Select>
      </form>
    </Modal>
  );
}
