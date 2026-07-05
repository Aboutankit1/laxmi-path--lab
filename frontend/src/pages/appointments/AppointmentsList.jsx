import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPlus, FiXCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Table, THead, TBody, Th, Td, Tr } from "../../components/ui/Table";
import Skeleton from "../../components/ui/Skeleton";
import AppointmentFormModal from "./AppointmentFormModal";

const statusTone = { Booked: "info", Confirmed: "success", Cancelled: "danger", Rescheduled: "warning", Completed: "neutral" };

export default function AppointmentsList() {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => api.get("/appointments").then((r) => r.data),
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => api.put(`/appointments/${id}/cancel`),
    onSuccess: () => { toast.success("Appointment cancelled"); queryClient.invalidateQueries({ queryKey: ["appointments"] }); },
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Appointments</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Book and track test appointments</p>
        </div>
        <Button icon={<FiPlus size={16} />} onClick={() => setModalOpen(true)}>Book Test</Button>
      </div>

      {isLoading ? <Skeleton className="h-96 w-full" /> : (
        <Table>
          <THead><Th>Token</Th><Th>Patient</Th><Th>Tests</Th><Th>Type</Th><Th>Date</Th><Th>Status</Th><Th className="text-right">Actions</Th></THead>
          <TBody>
            {data?.data?.length ? data.data.map((a) => (
              <Tr key={a._id}>
                <Td className="font-mono text-xs">{a.tokenNumber}</Td>
                <Td className="font-medium text-ink-900 dark:text-ink-50">{a.patient?.name}</Td>
                <Td>{a.tests?.map((t) => t.name).join(", ")}</Td>
                <Td>{a.type}</Td>
                <Td>{new Date(a.appointmentDate).toLocaleDateString()}</Td>
                <Td><Badge tone={statusTone[a.status]}>{a.status}</Badge></Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    {a.status !== "Cancelled" && a.status !== "Completed" && (
                      <button onClick={() => cancelMutation.mutate(a._id)} className="focus-ring rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><FiXCircle size={15} /></button>
                    )}
                  </div>
                </Td>
              </Tr>
            )) : <Tr><Td colSpan={7} className="py-10 text-center text-ink-400">No appointments booked yet.</Td></Tr>}
          </TBody>
        </Table>
      )}

      <AppointmentFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
