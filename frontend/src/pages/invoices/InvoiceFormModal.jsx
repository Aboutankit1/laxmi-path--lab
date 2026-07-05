import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function InvoiceFormModal({ open, onClose }) {
  const [patientId, setPatientId] = useState("");
  const [selectedTests, setSelectedTests] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [gstPercent, setGstPercent] = useState(0);
  const queryClient = useQueryClient();

  const { data: patients } = useQuery({ queryKey: ["patients-all"], queryFn: () => api.get("/patients", { params: { limit: 100 } }).then((r) => r.data.data), enabled: open });
  const { data: tests } = useQuery({ queryKey: ["tests-all"], queryFn: () => api.get("/tests", { params: { limit: 100 } }).then((r) => r.data.data), enabled: open });

  const mutation = useMutation({
    mutationFn: (payload) => api.post("/invoices", payload),
    onSuccess: () => {
      toast.success("Invoice generated");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Something went wrong"),
  });

  const subTotal = selectedTests.reduce((sum, id) => {
    const t = tests?.find((x) => x._id === id);
    return sum + (t?.price || 0);
  }, 0);

  const handleSubmit = () => {
    if (!patientId || !selectedTests.length) return toast.error("Select a patient and at least one test");
    const items = selectedTests.map((id) => {
      const t = tests.find((x) => x._id === id);
      return { test: t._id, name: t.name, price: t.price, quantity: 1 };
    });
    mutation.mutate({ patient: patientId, items, discount: Number(discount), gstPercent: Number(gstPercent) });
  };

  return (
    <Modal open={open} onClose={onClose} title="Generate Invoice" size="lg"
      footer={<>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} loading={mutation.isPending}>Generate Invoice</Button>
      </>}>
      <div className="space-y-4">
        <Select label="Patient" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
          <option value="">Select patient</option>
          {patients?.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.patientId})</option>)}
        </Select>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">Select Tests</label>
          <select multiple value={selectedTests} onChange={(e) => setSelectedTests(Array.from(e.target.selectedOptions, (o) => o.value))}
            className="focus-ring h-32 w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50">
            {tests?.map((t) => <option key={t._id} value={t._id}>{t.name} — ₹{t.price}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Discount (₹)" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
          <Input label="GST %" type="number" value={gstPercent} onChange={(e) => setGstPercent(e.target.value)} />
        </div>
        <div className="rounded-lg bg-ink-50 p-4 text-sm dark:bg-ink-800/50">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subTotal.toLocaleString("en-IN")}</span></div>
        </div>
      </div>
    </Modal>
  );
}
