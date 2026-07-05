import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiPlus } from "react-icons/fi";
import api from "../../lib/api";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Table, THead, TBody, Th, Td, Tr } from "../../components/ui/Table";
import Skeleton from "../../components/ui/Skeleton";
import StaffFormModal from "./StaffFormModal";

export default function StaffList() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading } = useQuery({ queryKey: ["staff"], queryFn: () => api.get("/staff").then((r) => r.data) });

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Staff</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Manage receptionists and lab technicians</p>
        </div>
        <Button icon={<FiPlus size={16} />} onClick={() => setModalOpen(true)}>Add Staff</Button>
      </div>

      {isLoading ? <Skeleton className="h-96 w-full" /> : (
        <Table>
          <THead><Th>Name</Th><Th>Email</Th><Th>Designation</Th><Th>Shift</Th><Th>Salary</Th><Th>Status</Th></THead>
          <TBody>
            {data?.data?.length ? data.data.map((s) => (
              <Tr key={s._id}>
                <Td className="font-medium text-ink-900 dark:text-ink-50">{s.user?.name}</Td>
                <Td>{s.user?.email}</Td>
                <Td>{s.designation}</Td>
                <Td>{s.shift}</Td>
                <Td>₹{s.salary?.toLocaleString("en-IN")}</Td>
                <Td><Badge tone={s.user?.isActive ? "success" : "neutral"}>{s.user?.isActive ? "Active" : "Inactive"}</Badge></Td>
              </Tr>
            )) : <Tr><Td colSpan={6} className="py-10 text-center text-ink-400">No staff members added yet.</Td></Tr>}
          </TBody>
        </Table>
      )}

      <StaffFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
