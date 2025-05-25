"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ShiftTypeItem({ type, onEdit, onDelete, deleting }) {
  return (
    <Card className="p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: type.color_code }}
        ></div>
        <span>{type.name}</span>
      </div>
      <div className="flex gap-2">
        <Button
          className="cursor-pointer"
          variant="outline"
          onClick={() => onEdit(type)}
        >
          Edit
        </Button>
        <Button
          className="cursor-pointer"
          variant="destructive"
          onClick={() => onDelete(type.id)}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Card>
  );
}
