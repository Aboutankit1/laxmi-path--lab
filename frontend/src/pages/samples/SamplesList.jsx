import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Badge from "../../components/ui/Badge";
import Select from "../../components/ui/Select";
import { Table, THead, TBody, Th, Td, Tr } from "../../components/ui/Table";
import Skeleton from "../../components/ui/Skeleton";

const statusTone = { Pending: "warning", Collected: "info", Processing: "info", Completed: "success", Rejected: "danger" };
const statuses = ["Pending", "Collected", "Processing", "Completed", "Rejected"];

export default function SamplesList() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["samples"], queryFn: () => api.get("/samples").then((r) => r.data) });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.put(`/samples/${id}/status`, { status }),
    onSuccess: () => { toast.success("Sample status updated"); queryClient.invalidateQueries({ queryKey: ["samples"] }); },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Sample Tracking</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">Track collection and processing status for every sample</p>
      </div>

      {isLoading ? <Skeleton className="h-96 w-full" /> : (
        <Table>
          <THead><Th>Sample ID</Th><Th>Patient</Th><Th>Test</Th><Th>Type</Th><Th>Collection</Th><Th>Status</Th></THead>
          <TBody>
            {data?.data?.length ? data.data.map((s) => (
              <Tr key={s._id}>
                <Td className="font-mono text-xs">{s.sampleId}</Td>
                <Td className="font-medium text-ink-900 dark:text-ink-50">{s.patient?.name}</Td>
                <Td>{s.test?.name}</Td>
                <Td>{s.sampleType}</Td>
                <Td>{s.collectionType}</Td>
                <Td>
                  <Select
                    value={s.status}
                    onChange={(e) => statusMutation.mutate({ id: s._id, status: e.target.value })}
                    className="!py-1.5 !text-xs w-36"
                  >
                    {statuses.map((st) => <option key={st}>{st}</option>)}
                  </Select>
                </Td>
              </Tr>
            )) : <Tr><Td colSpan={6} className="py-10 text-center text-ink-400">No samples yet. Book an appointment to generate samples.</Td></Tr>}
          </TBody>
        </Table>
      )}
    </div>
  );
}
