"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShiftsPage() {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [shiftTypes, setShiftTypes] = useState([]);

  const [employeeId, setEmployeeId] = useState("");
  const [shiftTypeId, setShiftTypeId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(true);

  useEffect(() => {
    fetchShifts();
    fetchEmployees();
    fetchShiftTypes();
  }, []);

  const fetchShifts = () => {
    setLoadingFetch(true);
    api
      .get("/shifts")
      .then((res) => setShifts(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load shifts.");
      })
      .finally(() => setLoadingFetch(false));
  };

  const fetchEmployees = () => {
    api
      .get("/employees")
      .then((res) => setEmployees(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load employees.");
      });
  };

  const fetchShiftTypes = () => {
    api
      .get("/shift_types")
      .then((res) => setShiftTypes(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load shift types.");
      });
  };

  const clearForm = () => {
    setEmployeeId("");
    setShiftTypeId("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!employeeId || !shiftTypeId || !date || !startTime || !endTime) {
      toast.warning("Please fill in all fields.");
      return;
    }

    setLoadingSubmit(true);

    const payload = {
      shift: {
        employee_id: employeeId,
        shift_type_id: shiftTypeId,
        date,
        start_time: startTime,
        end_time: endTime,
      },
    };

    const request = editingId
      ? api.patch(`/shifts/${editingId}`, payload)
      : api.post("/shifts", payload);

    request
      .then(() => {
        clearForm();
        fetchShifts();
        toast.success(`Shift ${editingId ? "updated" : "added"} successfully!`);
      })
      .catch((err) => {
        console.error(err);
        toast.error(`Failed to ${editingId ? "update" : "add"} shift.`);
      })
      .finally(() => setLoadingSubmit(false));
  };

  const handleEdit = (shift) => {
    setEditingId(shift.id);
    setEmployeeId(shift.employee.id);
    setShiftTypeId(shift.shift_type.id);
    setDate(shift.date);
    setStartTime(shift.start_time);
    setEndTime(shift.end_time);
  };

  const handleDelete = (id) => {
    setLoadingDeleteId(id);

    api
      .delete(`/shifts/${id}`)
      .then(() => {
        fetchShifts();
        toast.success("Shift deleted.");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete shift.");
      })
      .finally(() => setLoadingDeleteId(null));
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">
        {editingId ? "Edit Shift" : "Add Shift"}
      </h1>

      {/* Shift Form */}
      <Card className="p-4 space-y-4">
        <div>
          <Label>Employee</Label>
          <select
            className="w-full p-2 border rounded"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
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
            onChange={(e) => setShiftTypeId(e.target.value)}
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
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Label>Start Time</Label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Label>End Time</Label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className={"cursor-pointer"}
            onClick={handleSubmit}
            disabled={loadingSubmit}
          >
            {loadingSubmit
              ? editingId
                ? "Updating..."
                : "Adding..."
              : editingId
              ? "Update Shift"
              : "Add Shift"}
          </Button>
          {editingId && (
            <Button
              className={"cursor-pointer"}
              variant="secondary"
              onClick={clearForm}
            >
              Cancel
            </Button>
          )}
        </div>
      </Card>

      {/* List Shifts */}
      <div className="space-y-2">
        {loadingFetch
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4 flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-6 w-24 rounded" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </Card>
            ))
          : shifts.map((shift) => (
              <Card
                key={shift.id}
                className="p-4 flex justify-between items-center"
              >
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
                    className={"cursor-pointer"}
                    variant="outline"
                    onClick={() => handleEdit(shift)}
                  >
                    Edit
                  </Button>
                  <Button
                    className={"cursor-pointer"}
                    variant="destructive"
                    onClick={() => handleDelete(shift.id)}
                    disabled={loadingDeleteId === shift.id}
                  >
                    {loadingDeleteId === shift.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </Card>
            ))}
      </div>
    </div>
  );
}
