import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function PaymentModal({ invoice, onClose }) {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("Cash");
  const [transactionId, setTransactionId] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => api.post(`/invoices/${invoice._id}/payments`, { amount: Number(amount), mode, transactionId }),
    onSuccess: () => {
      toast.success("Payment recorded");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      onClose();
      setAmount(""); setTransactionId("");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to record payment"),
  });

  return (
    <Modal open={!!invoice} onClose={onClose} title={`Record Payment — ${invoice?.invoiceNumber}`}
      footer={<>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>Record Payment</Button>
      </>}>
      {invoice && (
        <div className="space-y-4">
          <p className="text-sm text-ink-500">Due amount: <span className="font-semibold text-ink-800 dark:text-ink-100">₹{invoice.dueAmount?.toLocaleString("en-IN")}</span></p>
          <Input label="Amount (₹)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Select label="Payment Mode" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option>Cash</option><option>UPI</option><option>Card</option><option>Net Banking</option>
          </Select>
          {mode !== "Cash" && <Input label="Transaction ID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />}
        </div>
      )}
    </Modal>
  );
}
