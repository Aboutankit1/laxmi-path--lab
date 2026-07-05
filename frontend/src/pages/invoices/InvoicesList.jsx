import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPlus, FiCreditCard, FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Table, THead, TBody, Th, Td, Tr } from "../../components/ui/Table";
import Skeleton from "../../components/ui/Skeleton";
import InvoiceFormModal from "./InvoiceFormModal";
import PaymentModal from "./PaymentModal";

const statusTone = { Pending: "warning", Partial: "info", Paid: "success" };

export default function InvoicesList() {
  const [modalOpen, setModalOpen] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => api.get("/invoices").then((r) => r.data),
  });

  const downloadMutation = useMutation({
    mutationFn: (invoiceId) =>
      api
        .get(`/invoices/${invoiceId}/download`, { responseType: "blob" })
        .then((r) => {
          const url = window.URL.createObjectURL(new Blob([r.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `Invoice_${invoiceId}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url);
          toast.success("Invoice downloaded successfully");
        }),
    onError: (err) => {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to download invoice";
      toast.error(errorMsg);
      console.error("Download error:", err);
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
            Billing & Invoices
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Generate invoices and record payments
          </p>
        </div>
        <Button icon={<FiPlus size={16} />} onClick={() => setModalOpen(true)}>
          Generate Invoice
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <Table>
          <THead>
            <Th>Invoice No.</Th>
            <Th>Patient</Th>
            <Th>Total</Th>
            <Th>Paid</Th>
            <Th>Due</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </THead>
          <TBody>
            {data?.data?.length ? (
              data.data.map((inv) => (
                <Tr key={inv._id}>
                  <Td className="font-mono text-xs">{inv.invoiceNumber}</Td>
                  <Td className="font-medium text-ink-900 dark:text-ink-50">
                    {inv.patient?.name}
                  </Td>
                  <Td>₹{inv.grandTotal.toLocaleString("en-IN")}</Td>
                  <Td>₹{inv.paidAmount.toLocaleString("en-IN")}</Td>
                  <Td>₹{inv.dueAmount.toLocaleString("en-IN")}</Td>
                  <Td>
                    <Badge tone={statusTone[inv.paymentStatus]}>
                      {inv.paymentStatus}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => downloadMutation.mutate(inv._id)}
                        disabled={downloadMutation.isPending}
                        className="focus-ring rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"
                      >
                        <FiDownload size={15} />
                      </button>
                      {inv.paymentStatus !== "Paid" && (
                        <button
                          onClick={() => setPayingInvoice(inv)}
                          className="focus-ring rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"
                        >
                          <FiCreditCard size={15} />
                        </button>
                      )}
                    </div>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={7} className="py-10 text-center text-ink-400">
                  No invoices generated yet.
                </Td>
              </Tr>
            )}
          </TBody>
        </Table>
      )}

      <InvoiceFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <PaymentModal
        invoice={payingInvoice}
        onClose={() => setPayingInvoice(null)}
      />
    </div>
  );
}
