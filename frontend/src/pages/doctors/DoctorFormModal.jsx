import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function DoctorFormModal({ open, onClose, doctor }) {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();
  const isEdit = !!doctor;

  useEffect(() => { if (open) reset(doctor || {}); }, [open, doctor, reset]);

  const mutation = useMutation({
    mutationFn: (payload) => (isEdit ? api.put(`/doctors/${doctor._id}`, payload) : api.post("/doctors", payload)),
    onSuccess: () => {
      toast.success(isEdit ? "Doctor updated" : "Doctor added");
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Something went wrong"),
  });

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Doctor" : "Add Doctor"}
      footer={<>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit((d) => mutation.mutate(d))} loading={mutation.isPending}>{isEdit ? "Save Changes" : "Add Doctor"}</Button>
      </>}>
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Full Name" {...register("name", { required: true })} />
        <Input label="Qualification" {...register("qualification")} />
        <Input label="Specialization" {...register("specialization")} />
        <Input label="Hospital Name" {...register("hospitalName")} />
        <Input label="Mobile" {...register("mobile")} />
        <Input label="Email" type="email" {...register("email")} />
        <Input label="Commission %" type="number" {...register("commissionPercent")} />
        <Input label="Address" className="sm:col-span-2" {...register("address")} />
      </form>
    </Modal>
  );
}
