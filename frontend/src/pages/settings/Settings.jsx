import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";

export default function Settings() {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ["settings"], queryFn: () => api.get("/settings").then((r) => r.data.data) });

  useEffect(() => { if (data) reset(data); }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (payload) => api.put("/settings", payload),
    onSuccess: () => {
      toast.success("Settings updated");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Something went wrong"),
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Lab Settings</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">Configure your lab's identity and report branding</p>
      </div>

      <Card className="p-6">
        <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit((d) => mutation.mutate(d))}>
          <Input label="Lab Name" {...register("labName")} />
          <Input label="Contact Number" {...register("contactNumber")} />
          <Input label="Email" type="email" {...register("email")} />
          <Input label="Website" {...register("website")} />
          <Input label="GST Number" {...register("gstNumber")} />
          <Input label="Address" className="sm:col-span-2" {...register("address")} />
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">Report Header</label>
            <textarea rows={2} className="focus-ring w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50" {...register("reportHeader")} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">Report Footer</label>
            <textarea rows={2} className="focus-ring w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50" {...register("reportFooter")} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" loading={mutation.isPending}>Save Settings</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
