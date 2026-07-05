import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function ResetPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { token } = useParams();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await api.post(`/auth/reset-password/${token}`, data);
      toast.success("Password reset. Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas-light px-4 dark:bg-canvas-dark">
      <div className="w-full max-w-md rounded-xl2 border border-ink-100 bg-white p-8 shadow-card dark:border-ink-800 dark:bg-ink-900">
        <h1 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">Set a new password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input
            label="New password"
            type="password"
            error={errors.password?.message}
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
          />
          <Button type="submit" className="w-full">Update password</Button>
        </form>
      </div>
    </div>
  );
}
