import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";

export default function TestFormModal({ open, onClose, test }) {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();
  const isEdit = !!test;

  useEffect(() => { if (open) reset(test || { sampleType: "Blood", status: "Active" }); }, [open, test, reset]);

  const mutation = useMutation({
    mutationFn: (payload) => (isEdit ? api.put(`/tests/${test._id}`, payload) : api.post("/tests", payload)),
    onSuccess: () => {
      toast.success(isEdit ? "Test updated" : "Test added");
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Something went wrong"),
  });

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Test" : "Add New Test"}
      footer={<>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit((d) => mutation.mutate(d))} loading={mutation.isPending}>{isEdit ? "Save Changes" : "Add Test"}</Button>
      </>}>
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Test Code" {...register("testCode", { required: true })} disabled={isEdit} />
        <Input label="Test Name" {...register("name", { required: true })} />
        <Input label="Category" {...register("category", { required: true })} />
        <Select label="Sample Type" {...register("sampleType")}>
          {["Blood","Urine","Stool","Saliva","Swab","Other"].map((s) => <option key={s}>{s}</option>)}
        </Select>
        <Input label="Report Time (hours)" type="number" {...register("reportTimeHours")} />
        <Input label="Price (₹)" type="number" {...register("price", { required: true })} />
        <Select label="Status" {...register("status")}>
          <option>Active</option><option>Inactive</option>
        </Select>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">Description</label>
          <textarea rows={2} className="focus-ring w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50" {...register("description")} />
        </div>
      </form>
    </Modal>
  );
}
