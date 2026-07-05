import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../lib/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitSuccessful } } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/forgot-password", data);
      toast.success("Reset link sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas-light px-4 dark:bg-canvas-dark">
      <div className="w-full max-w-md rounded-xl2 border border-ink-100 bg-white p-8 shadow-card dark:border-ink-800 dark:bg-ink-900">
        <h1 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">Reset your password</h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">We'll email you a secure reset link.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input label="Email address" type="email" error={errors.email?.message} {...register("email", { required: "Email is required" })} />
          <Button type="submit" className="w-full">Send reset link</Button>
        </form>
        <Link to="/login" className="mt-4 block text-center text-sm font-medium text-clay-600 hover:underline dark:text-clay-400">
          Back to login
        </Link>
      </div>
    </div>
  );
}
