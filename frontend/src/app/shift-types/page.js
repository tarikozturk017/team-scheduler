"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import ShiftTypeForm from "@/components/shift-type/ShiftTypeForm";
import ShiftTypeItem from "@/components/shift-type/ShiftTypeItem";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShiftTypePage() {
  const [shiftTypes, setShiftTypes] = useState([]);
  const [name, setName] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true); // Added

  useEffect(() => {
    fetchShiftTypes();
  }, []);

  const fetchShiftTypes = () => {
    if (isFirstLoad) setLoadingFetch(true); // Only show skeletons on first load
    api
      .get("/shift_types")
      .then((res) => setShiftTypes(res.data))
      .catch(() => toast.error("Failed to load shift types."))
      .finally(() => {
        if (isFirstLoad) setLoadingFetch(false); // Stop skeletons after first load
        setIsFirstLoad(false); // Mark first load as complete
      });
  };

  const clearForm = () => {
    setName("");
    setColorCode("");
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!name || !colorCode) {
      toast.warning("Please enter both name and color code.");
      return;
    }

    setLoading(true);

    const payload = { shift_type: { name, color_code: colorCode } };
    const request = editingId
      ? api.patch(`/shift_types/${editingId}`, payload)
      : api.post("/shift_types", payload);

    request
      .then(() => {
        fetchShiftTypes();
        toast.success(editingId ? "Shift type updated!" : "Shift type added!");
        clearForm();
      })
      .catch(() =>
        toast.error(editingId ? "Failed to update." : "Failed to create.")
      )
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    setLoadingDeleteId(id);
    api
      .delete(`/shift_types/${id}`)
      .then(() => {
        fetchShiftTypes();
        toast.success("Shift type deleted.");
      })
      .catch(() => toast.error("Failed to delete shift type."))
      .finally(() => setLoadingDeleteId(null));
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Shift Types</h1>

      <ShiftTypeForm
        name={name}
        colorCode={colorCode}
        onNameChange={(e) => setName(e.target.value)}
        onColorChange={(e) => setColorCode(e.target.value)}
        onSubmit={handleSubmit}
        onCancel={clearForm}
        editingId={editingId}
        loading={loading}
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
          : shiftTypes.map((type) => (
              <ShiftTypeItem
                key={type.id}
                type={type}
                onEdit={(t) => {
                  setEditingId(t.id);
                  setName(t.name);
                  setColorCode(t.color_code);
                }}
                onDelete={handleDelete}
                deleting={loadingDeleteId === type.id}
              />
            ))}
      </div>
    </div>
  );
}
