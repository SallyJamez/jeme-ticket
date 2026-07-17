"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createStaffSchema, type CreateStaffInput } from "@/lib/validations/admin";
import { useAdmin } from "@/hooks/useAdmin";

export function InviteStaffModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const { createStaff, isSubmitting } = useAdmin();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStaffInput>({ resolver: zodResolver(createStaffSchema) });

  const onSubmit = async (values: CreateStaffInput) => {
    try {
      await createStaff(values);
      toast.success("Staff member invited.");
      reset();
      onCreated();
      onClose();
    } catch {
      toast.error("Could not invite staff member.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Invite staff member">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" {...register("firstName")} />
          </div>
          <div>
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" {...register("lastName")} />
            {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input id="department" placeholder="e.g. Payments & Settlements" {...register("department")} />
          {errors.department && <p className="mt-1 text-xs text-red-600">{errors.department.message}</p>}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Inviting…" : "Send invite"}</Button>
        </div>
      </form>
    </Modal>
  );
}
