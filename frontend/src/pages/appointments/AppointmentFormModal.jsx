import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function AppointmentFormModal({ open, onClose }) {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const { data: patients } = useQuery({ queryKey: ["patients-all"], queryFn: () => api.get("/patients", { params: { limit: 100 } }).then((r) => r.data.data), enabled: open });
  const { data: tests } = useQuery({ queryKey: ["tests-all"], queryFn: () => api.get("/tests", { params: { limit: 100 } }).then((r) => r.data.data), enabled: open });
  const { data: doctors } = useQuery({ queryKey: ["doctors-all"], queryFn: () => api.get("/doctors", { params: { limit: 100 } }).then((r) => r.data.data), enabled: open });

  useEffect(() => { if (open) reset({ type: "Walk-in", appointmentDate: new Date().toISOString().slice(0, 10) }); }, [open, reset]);

  const mutation = useMutation({
    mutationFn: (payload) => api.post("/appointments", { ...payload, tests: Array.isArray(payload.tests) ? payload.tests : [payload.tests] }),
    onSuccess: () => {
      toast.success("Appointment booked");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Something went wrong"),
  });

  return (
    <Modal open={open} onClose={onClose} title="Book Test Appointment" size="lg"
      footer={<>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit((d) => mutation.mutate(d))} loading={mutation.isPending}>Book Appointment</Button>
      </>}>
      <form className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select label="Patient" {...register("patient", { required: true })}>
          <option value="">Select patient</option>
          {patients?.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.patientId})</option>)}
        </Select>
        <Select label="Referring Doctor" {...register("referredDoctor")}>
          <option value="">None</option>
          {doctors?.map((d) => <option key={d._id} value={d._id}>Dr. {d.name}</option>)}
        </Select>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">Select Tests</label>
          <select multiple className="focus-ring h-32 w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50" {...register("tests", { required: true })}>
            {tests?.map((t) => <option key={t._id} value={t._id}>{t.name} — ₹{t.price}</option>)}
          </select>
          <p className="mt-1 text-xs text-ink-400">Hold Ctrl / Cmd to select multiple tests</p>
        </div>
        <Select label="Type" {...register("type")}>
          <option>Walk-in</option><option>Online</option><option>Home Collection</option>
        </Select>
        <Input label="Appointment Date" type="date" {...register("appointmentDate")} />
        <Input label="Home Address (if applicable)" className="sm:col-span-2" {...register("homeAddress")} />
      </form>
    </Modal>
  );
}
