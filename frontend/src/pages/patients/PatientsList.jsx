import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Table, THead, TBody, Th, Td, Tr } from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import PatientFormModal from "./PatientFormModal";

export default function PatientsList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["patients", search, page],
    queryFn: () => api.get("/patients", { params: { search, page, limit: 10 } }).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/patients/${id}`),
    onSuccess: () => {
      toast.success("Patient removed");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete"),
  });

  const openAdd = () => { setEditingPatient(null); setModalOpen(true); };
  const openEdit = (p) => { setEditingPatient(p); setModalOpen(true); };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Patients</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Manage patient records and profiles</p>
        </div>
        <Button icon={<FiPlus size={16} />} onClick={openAdd}>Add Patient</Button>
      </div>

      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
        <Input
          className="pl-10"
          placeholder="Search by name, mobile, or ID..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <>
          <Table>
            <THead>
              <Th>Patient</Th>
              <Th>ID</Th>
              <Th>Mobile</Th>
              <Th>Age / Gender</Th>
              <Th>Blood Group</Th>
              <Th>Referred By</Th>
              <Th className="text-right">Actions</Th>
            </THead>
            <TBody>
              {data?.data?.length ? (
                data.data.map((p) => (
                  <Tr key={p._id}>
                    <Td className="font-medium text-ink-900 dark:text-ink-50">{p.name}</Td>
                    <Td>{p.patientId}</Td>
                    <Td>{p.mobile}</Td>
                    <Td>{p.age || "-"} / {p.gender || "-"}</Td>
                    <Td><Badge tone="info">{p.bloodGroup}</Badge></Td>
                    <Td>{p.referredBy?.name || "—"}</Td>
                    <Td>
                      <div className="flex justify-end gap-2">
                        <button className="focus-ring rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"><FiEye size={15} /></button>
                        <button onClick={() => openEdit(p)} className="focus-ring rounded-lg p-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"><FiEdit2 size={15} /></button>
                        <button onClick={() => deleteMutation.mutate(p._id)} className="focus-ring rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><FiTrash2 size={15} /></button>
                      </div>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr><Td colSpan={7} className="py-10 text-center text-ink-400">No patients found. Add your first patient to get started.</Td></Tr>
              )}
            </TBody>
          </Table>

          {data?.pagination?.pages > 1 && (
            <div className="flex items-center justify-between text-sm text-ink-500">
              <span>Page {data.pagination.page} of {data.pagination.pages}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= data.pagination.pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </>
      )}

      <PatientFormModal open={modalOpen} onClose={() => setModalOpen(false)} patient={editingPatient} />
    </div>
  );
}
