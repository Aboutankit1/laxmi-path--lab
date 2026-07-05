import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPlus, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Table, THead, TBody, Th, Td, Tr } from "../../components/ui/Table";
import Skeleton from "../../components/ui/Skeleton";
import InventoryFormModal from "./InventoryFormModal";

export default function InventoryList() {
  const [modalOpen, setModalOpen] = useState(false);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["inventory", lowStockOnly],
    queryFn: () => api.get("/inventory", { params: { lowStock: lowStockOnly } }).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/inventory/${id}`),
    onSuccess: () => { toast.success("Item removed"); queryClient.invalidateQueries({ queryKey: ["inventory"] }); },
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Inventory</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Track reagents, kits, and lab consumables</p>
        </div>
        <div className="flex gap-2">
          <Button variant={lowStockOnly ? "primary" : "outline"} size="sm" icon={<FiAlertTriangle size={14} />} onClick={() => setLowStockOnly((v) => !v)}>
            Low Stock
          </Button>
          <Button icon={<FiPlus size={16} />} onClick={() => setModalOpen(true)}>Add Item</Button>
        </div>
      </div>

      {isLoading ? <Skeleton className="h-96 w-full" /> : (
        <Table>
          <THead><Th>Item</Th><Th>Category</Th><Th>Qty</Th><Th>Vendor</Th><Th>Expiry</Th><Th>Status</Th><Th className="text-right">Actions</Th></THead>
          <TBody>
            {data?.data?.length ? data.data.map((item) => (
              <Tr key={item._id}>
                <Td className="font-medium text-ink-900 dark:text-ink-50">{item.itemName}</Td>
                <Td>{item.category}</Td>
                <Td>{item.quantity} {item.unit}</Td>
                <Td>{item.vendor || "—"}</Td>
                <Td>{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "—"}</Td>
                <Td>
                  {item.quantity <= item.lowStockThreshold
                    ? <Badge tone="danger">Low Stock</Badge>
                    : <Badge tone="success">In Stock</Badge>}
                </Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => deleteMutation.mutate(item._id)} className="focus-ring rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><FiTrash2 size={15} /></button>
                  </div>
                </Td>
              </Tr>
            )) : <Tr><Td colSpan={7} className="py-10 text-center text-ink-400">No inventory items found.</Td></Tr>}
          </TBody>
        </Table>
      )}

      <InventoryFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
