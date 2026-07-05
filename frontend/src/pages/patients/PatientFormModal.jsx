import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";

export default function PatientFormModal({ open, onClose, patient }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const queryClient = useQueryClient();
  const isEdit = !!patient;

  useEffect(() => {
    if (open) reset(patient || { gender: "Male", bloodGroup: "Unknown" });
  }, [open, patient, reset]);

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit ? api.put(`/patients/${patient._id}`, payload) : api.post("/patients", payload),
    onSuccess: () => {
      toast.success(isEdit ? "Patient updated" : "Patient added");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Something went wrong"),
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Patient" : "Add New Patient"}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} loading={mutation.isPending}>{isEdit ? "Save Changes" : "Add Patient"}</Button>
        </>
      }
    >
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Full Name" error={errors.name?.message} {...register("name", { required: "Name is required" })} />
        <Input label="Mobile Number" error={errors.mobile?.message} {...register("mobile", { required: "Mobile is required" })} />
        <Input label="Email" type="email" {...register("email")} />
        <Input label="Date of Birth" type="date" {...register("dob")} />
        <Input label="Age" type="number" {...register("age")} />
        <Select label="Gender" {...register("gender")}>
          <option>Male</option><option>Female</option><option>Other</option>
        </Select>
        <Select label="Blood Group" {...register("bloodGroup")}>
          {["A+","A-","B+","B-","AB+","AB-","O+","O-","Unknown"].map((bg) => <option key={bg}>{bg}</option>)}
        </Select>
        <Input label="Aadhaar Number" {...register("aadhaarNumber")} />
        <Input label="Address Line" className="sm:col-span-2" {...register("address.line1")} />
        <Input label="City" {...register("address.city")} />
        <Input label="State" {...register("address.state")} />
        <Input label="Pincode" {...register("address.pincode")} />
        <Input label="Emergency Contact Name" {...register("emergencyContact.name")} />
        <Input label="Emergency Contact Phone" {...register("emergencyContact.phone")} />
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">Medical History</label>
          <textarea
            rows={3}
            className="focus-ring w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
            {...register("medicalHistory")}
          />
        </div>
      </form>
    </Modal>
  );
}
