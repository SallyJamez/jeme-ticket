"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { updateStaffSchema, type UpdateStaffInput } from "@/lib/validations/admin";
import { useAdmin } from "@/hooks/useAdmin";
import type { ApiStaff } from "@/lib/api/types";

export function EditStaffModal({
  staff,
  onClose,
  onUpdated,
}: {
  staff: ApiStaff | null;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { updateStaff, deleteStaff, resendStaffSetupEmail, isSubmitting } = useAdmin();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateStaffInput>({ resolver: zodResolver(updateStaffSchema) });

  useEffect(() => {
    if (staff) reset({ firstName: staff.firstName, lastName: staff.lastName, department: staff.department });
  }, [staff, reset]);

  if (!staff) return null;

  const onSubmit = async (values: UpdateStaffInput) => {
    try {
      await updateStaff(staff.id, values);
      toast.success("Staff member updated.");
      onUpdated();
      onClose();
    } catch {
      toast.error("Could not update staff member.");
    }
  };

  return (
    <Modal open={!!staff} onClose={onClose} title={`Edit ${staff.firstName} ${staff.lastName}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="editFirstName">First name</Label>
            <Input id="editFirstName" {...register("firstName")} />
          </div>
          <div>
            <Label htmlFor="editLastName">Last name</Label>
            <Input id="editLastName" {...register("lastName")} />
            {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="editDepartment">Department</Label>
          <Input id="editDepartment" {...register("department")} />
          {errors.department && <p className="mt-1 text-xs text-red-600">{errors.department.message}</p>}
        </div>

        <div className="flex flex-wrap justify-between gap-2 pt-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={async () => {
                await resendStaffSetupEmail(staff.id);
                toast.success("Setup email resent.");
              }}
            >
              Resend setup email
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={async () => {
                if (!window.confirm(`Remove ${staff.firstName} ${staff.lastName}?`)) return;
                await deleteStaff(staff.id);
                toast.success("Staff member removed.");
                onClose();
              }}
            >
              Remove
            </Button>
          </div>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save changes"}</Button>
        </div>
      </form>
    </Modal>
  );
}
