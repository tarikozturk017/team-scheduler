"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ShiftForm({
  employees,
  shiftTypes,
  employeeId,
  shiftTypeId,
  date,
  startTime,
  endTime,
  onChange,
  onSubmit,
  onCancel,
  editingId,
  loading,
}) {
  return (
    <Card className="p-4 space-y-4">
      <div>
        <Label>Employee</Label>
        <select
          className="w-full p-2 border rounded"
          value={employeeId}
          onChange={(e) => onChange("employeeId", e.target.value)}
        >
          <option value="">Select an employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} – {emp.role}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Shift Type</Label>
        <select
          className="w-full p-2 border rounded"
          value={shiftTypeId}
          onChange={(e) => onChange("shiftTypeId", e.target.value)}
        >
          <option value="">Select a shift type</option>
          {shiftTypes.map((st) => (
            <option key={st.id} value={st.id}>
              {st.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Date</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => onChange("date", e.target.value)}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Label>Start Time</Label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => onChange("startTime", e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Label>End Time</Label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => onChange("endTime", e.target.value)}
          />
        </div>
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
            ? "Update Shift"
            : "Add Shift"}
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
