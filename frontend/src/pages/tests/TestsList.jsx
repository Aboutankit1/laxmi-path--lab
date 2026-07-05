import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import { Table, THead, TBody, Th, Td, Tr } from "../../components/ui/Table";
import Skeleton from "../../components/ui/Skeleton";
import TestFormModal from "./TestFormModal";

export default function TestsList() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["tests", search],
    queryFn: () => api.get("/tests", { params: { search } }).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/tests/${id}`),
    onSuccess: () => { toast.success("Test deactivated"); queryClient.invalidateQueries({ queryKey: ["tests"] }); },
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Test Catalog</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Manage laboratory tests and pricing</p>
        </div>
        <Button icon={<FiPlus size={16} />} onClick={() => { setEditing(null); setModalOpen(true); }}>Add Test</Button>
      </div>

      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
        <Input className="pl-10" placeholder="Search tests..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? <Skeleton className="h-96 w-full" /> : (
        <Table>
          <THead><Th>Code</Th><Th>Name</Th><Th>Category</Th><Th>Sample</Th><Th>Report Time</Th><Th>Price</Th><Th>Status</Th><Th className="text-right">Actions</Th></THead>
          <TBody>
            {data?.data?.length ? data.data.map((t) => (
              <Tr key={t._id}>
                <Td className="font-mono text-xs">{t.testCode}</Td>
                <Td className="font-medium text-ink-900 dark:text-ink-50">{t.name}</Td>
                <Td>{t.category}</Td>
                <Td>{t.sampleType}</Td>
                <Td>{t.reportTimeHours}h</Td>
                <Td>₹{t.price}</Td>
                <Td><Badge tone={t.status === "Active" ? "success" : "neutral"}>{t.status}</Badge></Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setEditing(t); setModalOpen(true); }} className="focus-ring rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"><FiEdit2 size={15} /></button>
                    <button onClick={() => deleteMutation.mutate(t._id)} className="focus-ring rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><FiTrash2 size={15} /></button>
                  </div>
                </Td>
              </Tr>
            )) : <Tr><Td colSpan={8} className="py-10 text-center text-ink-400">No tests found.</Td></Tr>}
          </TBody>
        </Table>
      )}

      <TestFormModal open={modalOpen} onClose={() => setModalOpen(false)} test={editing} />
    </div>
  );
}
