"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ShiftTypeForm({
  name,
  colorCode,
  onNameChange,
  onColorChange,
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
        <Label>Color Code</Label>
        <Input
          value={colorCode}
          onChange={onColorChange}
          placeholder="#FFD700"
        />
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
            ? "Update Shift Type"
            : "Add Shift Type"}
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
