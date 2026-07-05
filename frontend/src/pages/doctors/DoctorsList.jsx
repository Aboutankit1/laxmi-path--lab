import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Table, THead, TBody, Th, Td, Tr } from "../../components/ui/Table";
import Skeleton from "../../components/ui/Skeleton";
import DoctorFormModal from "./DoctorFormModal";

export default function DoctorsList() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["doctors", search],
    queryFn: () => api.get("/doctors", { params: { search } }).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/doctors/${id}`),
    onSuccess: () => {
      toast.success("Doctor removed");
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Doctors</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Manage referring doctors and commissions</p>
        </div>
        <Button icon={<FiPlus size={16} />} onClick={() => { setEditing(null); setModalOpen(true); }}>Add Doctor</Button>
      </div>

      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
        <Input className="pl-10" placeholder="Search doctors..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? <Skeleton className="h-80 w-full" /> : (
        <Table>
          <THead>
            <Th>Name</Th><Th>Hospital</Th><Th>Specialization</Th><Th>Mobile</Th><Th>Commission</Th><Th className="text-right">Actions</Th>
          </THead>
          <TBody>
            {data?.data?.length ? data.data.map((d) => (
              <Tr key={d._id}>
                <Td className="font-medium text-ink-900 dark:text-ink-50">Dr. {d.name}</Td>
                <Td>{d.hospitalName || "—"}</Td>
                <Td>{d.specialization || "—"}</Td>
                <Td>{d.mobile || "—"}</Td>
                <Td>{d.commissionPercent}%</Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setEditing(d); setModalOpen(true); }} className="focus-ring rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"><FiEdit2 size={15} /></button>
                    <button onClick={() => deleteMutation.mutate(d._id)} className="focus-ring rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><FiTrash2 size={15} /></button>
                  </div>
                </Td>
              </Tr>
            )) : <Tr><Td colSpan={6} className="py-10 text-center text-ink-400">No doctors added yet.</Td></Tr>}
          </TBody>
        </Table>
      )}

      <DoctorFormModal open={modalOpen} onClose={() => setModalOpen(false)} doctor={editing} />
    </div>
  );
}
