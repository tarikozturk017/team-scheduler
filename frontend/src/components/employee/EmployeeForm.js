"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function EmployeeForm({
  name,
  role,
  onNameChange,
  onRoleChange,
  onSubmit,
  onCancel,
  editingId,
  loading,
}) {
  return (
    <Card className="p-4 space-y-4">
      <div>
        <Label>Name</Label>
        <Input value={name} onChange={onNameChange} />
      </div>
      <div>
        <Label>Role</Label>
        <Input value={role} onChange={onRoleChange} />
      </div>
      <div className="flex gap-2">
        <Button
          className="cursor-pointer"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading
            ? editingId
              ? "Updating..."
              : "Adding..."
            : editingId
            ? "Update Employee"
            : "Add Employee"}
        </Button>
        {editingId && (
          <Button
            className="cursor-pointer"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </Card>
  );
}
