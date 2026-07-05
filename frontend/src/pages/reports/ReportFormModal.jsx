import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import api from "../../lib/api";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function ReportFormModal({ open, onClose }) {
  const { register, handleSubmit, control, reset, watch } = useForm({ defaultValues: { results: [{ parameter: "", value: "", unit: "", normalRange: "", flag: "Normal" }] } });
  const { fields, append, remove } = useFieldArray({ control, name: "results" });
  const queryClient = useQueryClient();

  const { data: appointments } = useQuery({ queryKey: ["appointments-completed"], queryFn: () => api.get("/appointments").then((r) => r.data.data), enabled: open });
  const selectedAppointmentId = watch("appointment");
  const selectedAppointment = appointments?.find((a) => a._id === selectedAppointmentId);

  useEffect(() => { if (open) reset({ results: [{ parameter: "", value: "", unit: "", normalRange: "", flag: "Normal" }] }); }, [open, reset]);

  const mutation = useMutation({
    mutationFn: (payload) => api.post("/reports", payload),
    onSuccess: () => {
      toast.success("Report created");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Something went wrong"),
  });

  const onSubmit = (data) => {
    if (!selectedAppointment) return toast.error("Select an appointment first");
    mutation.mutate({
      appointment: selectedAppointment._id,
      patient: selectedAppointment.patient._id,
      test: data.test,
      results: data.results,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Upload Test Report" size="xl"
      footer={<>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} loading={mutation.isPending}>Save Report</Button>
      </>}>
      <form className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Appointment" {...register("appointment", { required: true })}>
            <option value="">Select appointment</option>
            {appointments?.map((a) => <option key={a._id} value={a._id}>{a.tokenNumber} — {a.patient?.name}</option>)}
          </Select>
          <Select label="Test" {...register("test", { required: true })}>
            <option value="">Select test</option>
            {selectedAppointment?.tests?.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
          </Select>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Test Parameters</label>
            <Button type="button" variant="ghost" size="sm" icon={<FiPlus size={14} />} onClick={() => append({ parameter: "", value: "", unit: "", normalRange: "", flag: "Normal" })}>Add Row</Button>
          </div>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 gap-2 rounded-lg border border-ink-100 p-3 dark:border-ink-800 sm:grid-cols-6">
                <Input placeholder="Parameter" {...register(`results.${index}.parameter`)} />
                <Input placeholder="Value" {...register(`results.${index}.value`)} />
                <Input placeholder="Unit" {...register(`results.${index}.unit`)} />
                <Input placeholder="Normal Range" {...register(`results.${index}.normalRange`)} />
                <Select {...register(`results.${index}.flag`)}>
                  <option>Normal</option><option>High</option><option>Low</option><option>Critical</option>
                </Select>
                <button type="button" onClick={() => remove(index)} className="focus-ring flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><FiTrash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
}
