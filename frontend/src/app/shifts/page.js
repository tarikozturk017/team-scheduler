"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ShiftForm from "@/components/shift/ShiftForm";
import ShiftItem from "@/components/shift/ShiftItem";

export default function ShiftsPage() {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [shiftTypes, setShiftTypes] = useState([]);

  const [form, setForm] = useState({
    employeeId: "",
    shiftTypeId: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // ✅ Added

  useEffect(() => {
    fetchShifts();
    fetchEmployees();
    fetchShiftTypes();
  }, []);

  const fetchShifts = () => {
    if (isFirstLoad) setLoadingFetch(true); // ✅ Show skeletons only on first load

    api
      .get("/shifts")
      .then((res) => setShifts(res.data))
      .catch(() => toast.error("Failed to load shifts."))
      .finally(() => {
        if (isFirstLoad) setLoadingFetch(false); // ✅ Hide skeletons after first load
        setIsFirstLoad(false); // ✅ Mark first load as complete
      });
  };

  const fetchEmployees = () => {
    api
      .get("/employees")
      .then((res) => setEmployees(res.data))
      .catch(() => toast.error("Failed to load employees."));
  };

  const fetchShiftTypes = () => {
    api
      .get("/shift_types")
      .then((res) => setShiftTypes(res.data))
      .catch(() => toast.error("Failed to load shift types."));
  };

  const clearForm = () => {
    setForm({
      employeeId: "",
      shiftTypeId: "",
      date: "",
      startTime: "",
      endTime: "",
    });
    setEditingId(null);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const { employeeId, shiftTypeId, date, startTime, endTime } = form;
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
      .catch(() =>
        toast.error(`Failed to ${editingId ? "update" : "add"} shift.`)
      )
      .finally(() => setLoadingSubmit(false));
  };

  const handleEdit = (shift) => {
    setEditingId(shift.id);
    setForm({
      employeeId: shift.employee.id,
      shiftTypeId: shift.shift_type.id,
      date: shift.date,
      startTime: shift.start_time,
      endTime: shift.end_time,
    });
  };

  const handleDelete = (id) => {
    setLoadingDeleteId(id);
    api
      .delete(`/shifts/${id}`)
      .then(() => {
        fetchShifts();
        toast.success("Shift deleted.");
      })
      .catch(() => toast.error("Failed to delete shift."))
      .finally(() => setLoadingDeleteId(null));
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">
        {editingId ? "Edit Shift" : "Add Shift"}
      </h1>

      <ShiftForm
        employees={employees}
        shiftTypes={shiftTypes}
        employeeId={form.employeeId}
        shiftTypeId={form.shiftTypeId}
        date={form.date}
        startTime={form.startTime}
        endTime={form.endTime}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={clearForm}
        editingId={editingId}
        loading={loadingSubmit}
      />

      <div className="space-y-2">
        {loadingFetch
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-4 w-full">
                  <Skeleton className="w-4 h-4 rounded-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </Card>
            ))
          : shifts.map((shift) => (
              <ShiftItem
                key={shift.id}
                shift={shift}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deleting={loadingDeleteId === shift.id}
              />
            ))}
      </div>
    </div>
  );
}
