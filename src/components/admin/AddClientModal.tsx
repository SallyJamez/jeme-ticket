"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClientSchema, type CreateClientInput } from "@/lib/validations/admin";
import { useAdmin } from "@/hooks/useAdmin";

export function AddClientModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const { createClient, isSubmitting } = useAdmin();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClientInput>({ resolver: zodResolver(createClientSchema) });

  const onSubmit = async (values: CreateClientInput) => {
    try {
      await createClient(values);
      toast.success("Client created.");
      reset();
      onCreated();
      onClose();
    } catch {
      toast.error("Could not create client.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add client">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="companyName">Company name</Label>
          <Input id="companyName" {...register("companyName")} />
          {errors.companyName && <p className="mt-1 text-xs text-red-600">{errors.companyName.message}</p>}
        </div>
        <div>
          <Label htmlFor="companyAddress">Company address</Label>
          <Input id="companyAddress" {...register("companyAddress")} />
          {errors.companyAddress && <p className="mt-1 text-xs text-red-600">{errors.companyAddress.message}</p>}
        </div>
        <div>
          <Label htmlFor="companyEmail">Company email</Label>
          <Input id="companyEmail" type="email" {...register("companyEmail")} />
          {errors.companyEmail && <p className="mt-1 text-xs text-red-600">{errors.companyEmail.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="adminFirstName">Admin first name</Label>
            <Input id="adminFirstName" {...register("adminFirstName")} />
            {errors.adminFirstName && <p className="mt-1 text-xs text-red-600">{errors.adminFirstName.message}</p>}
          </div>
          <div>
            <Label htmlFor="adminLastName">Admin last name</Label>
            <Input id="adminLastName" {...register("adminLastName")} />
            {errors.adminLastName && <p className="mt-1 text-xs text-red-600">{errors.adminLastName.message}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="adminEmail">Admin email</Label>
          <Input id="adminEmail" type="email" {...register("adminEmail")} />
          {errors.adminEmail && <p className="mt-1 text-xs text-red-600">{errors.adminEmail.message}</p>}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating…" : "Create client"}</Button>
        </div>
      </form>
    </Modal>
  );
}
