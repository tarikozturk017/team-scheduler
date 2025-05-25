"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function EmployeeItem({ employee, onEdit, onDelete, deleting }) {
  return (
    <Card className="p-4 flex justify-between items-center">
      <div>
        {employee.name} – {employee.role}
      </div>
      <div className="flex gap-2">
        <Button
          className="cursor-pointer"
          variant="outline"
          onClick={() => onEdit(employee)}
        >
          Edit
        </Button>
        <Button
          className="cursor-pointer"
          variant="destructive"
          onClick={() => onDelete(employee.id)}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Card>
  );
}
