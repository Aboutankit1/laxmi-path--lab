import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPlus, FiDownload, FiMail } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Table, THead, TBody, Th, Td, Tr } from "../../components/ui/Table";
import Skeleton from "../../components/ui/Skeleton";
import ReportFormModal from "./ReportFormModal";

const statusTone = { Pending: "warning", "In Review": "info", Completed: "success", Emailed: "accent" };

export default function ReportsList() {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ["reports"], queryFn: () => api.get("/reports").then((r) => r.data) });

  const emailMutation = useMutation({
    mutationFn: (id) => api.post(`/reports/${id}/email`),
    onSuccess: () => { toast.success("Report emailed to patient"); queryClient.invalidateQueries({ queryKey: ["reports"] }); },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to email report"),
  });

  const downloadPdf = async (id, reportNumber) => {
    try {
      const res = await api.get(`/reports/${id}/pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${reportNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    } catch {
      toast.error("Failed to download report");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Reports</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Upload results and generate patient reports</p>
        </div>
        <Button icon={<FiPlus size={16} />} onClick={() => setModalOpen(true)}>Upload Report</Button>
      </div>

      {isLoading ? <Skeleton className="h-96 w-full" /> : (
        <Table>
          <THead><Th>Report No.</Th><Th>Patient</Th><Th>Test</Th><Th>Status</Th><Th className="text-right">Actions</Th></THead>
          <TBody>
            {data?.data?.length ? data.data.map((r) => (
              <Tr key={r._id}>
                <Td className="font-mono text-xs">{r.reportNumber}</Td>
                <Td className="font-medium text-ink-900 dark:text-ink-50">{r.patient?.name}</Td>
                <Td>{r.test?.name}</Td>
                <Td><Badge tone={statusTone[r.status]}>{r.status}</Badge></Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => downloadPdf(r._id, r.reportNumber)} className="focus-ring rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"><FiDownload size={15} /></button>
                    <button onClick={() => emailMutation.mutate(r._id)} className="focus-ring rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"><FiMail size={15} /></button>
                  </div>
                </Td>
              </Tr>
            )) : <Tr><Td colSpan={5} className="py-10 text-center text-ink-400">No reports uploaded yet.</Td></Tr>}
          </TBody>
        </Table>
      )}

      <ReportFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
