import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiBell, FiCheck } from "react-icons/fi";
import api from "../../lib/api";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";

export default function NotificationsList() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["notifications"], queryFn: () => api.get("/notifications").then((r) => r.data.data) });

  const markRead = useMutation({
    mutationFn: (id) => api.put(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Notifications</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">Report alerts, reminders, and system messages</p>
      </div>

      {isLoading ? <Skeleton className="h-64 w-full" /> : (
        <div className="space-y-3">
          {data?.length ? data.map((n) => (
            <Card key={n._id} className={`flex items-start gap-3 p-4 ${!n.isRead ? "border-clay-300" : ""}`}>
              <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                <FiBell size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-ink-900 dark:text-ink-50">{n.title}</p>
                  <Badge tone="neutral">{n.type}</Badge>
                </div>
                <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">{n.message}</p>
              </div>
              {!n.isRead && (
                <button onClick={() => markRead.mutate(n._id)} className="focus-ring rounded-lg p-2 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800">
                  <FiCheck size={16} />
                </button>
              )}
            </Card>
          )) : (
            <Card className="p-10 text-center text-ink-400">No notifications yet.</Card>
          )}
        </div>
      )}
    </div>
  );
}
