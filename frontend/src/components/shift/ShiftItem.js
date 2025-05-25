"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ShiftItem({ shift, onEdit, onDelete, deleting }) {
  return (
    <Card className="p-4 flex justify-between items-center">
      <div>
        <div className="font-semibold">
          {shift.employee.name} – {shift.employee.role}
        </div>
        <div className="text-sm text-muted-foreground">
          {shift.date} ({shift.start_time} - {shift.end_time})
        </div>
        <div className="text-sm mt-1">
          <span
            className="inline-block px-2 py-1 rounded"
            style={{
              backgroundColor: shift.shift_type.color_code,
              color: "white",
            }}
          >
            {shift.shift_type.name}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          className="cursor-pointer"
          variant="outline"
          onClick={() => onEdit(shift)}
        >
          Edit
        </Button>
        <Button
          className="cursor-pointer"
          variant="destructive"
          onClick={() => onDelete(shift.id)}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Card>
  );
}
