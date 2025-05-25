"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export default function ShiftTypePage() {
  const [shiftTypes, setShiftTypes] = useState([]);
  const [name, setName] = useState("");
  const [colorCode, setColorCode] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);

  useEffect(() => {
    fetchShiftTypes();
  }, []);

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
      .catch((err) => {
        console.error(err);
        toast.error(editingId ? "Failed to update." : "Failed to create.");
      })
      .finally(() => setLoading(false));
  };

  const handleEdit = (type) => {
    setEditingId(type.id);
    setName(type.name);
    setColorCode(type.color_code);
  };

  const handleDelete = (id) => {
    setLoadingDeleteId(id);

    api
      .delete(`/shift_types/${id}`)
      .then(() => {
        fetchShiftTypes();
        toast.success("Shift type deleted.");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete shift type.");
      })
      .finally(() => setLoadingDeleteId(null));
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Shift Types</h1>

      {/* Create/Edit Form */}
      <Card className="p-4 space-y-4">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Color Code</Label>
          <Input
            value={colorCode}
            onChange={(e) => setColorCode(e.target.value)}
            placeholder="#FFD700"
          />
        </div>
        <div className="flex gap-2">
          <Button
            className="cursor-pointer"
            onClick={handleSubmit}
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
              onClick={clearForm}
            >
              Cancel
            </Button>
          )}
        </div>
      </Card>

      {/* List */}
      <div className="space-y-2">
        {shiftTypes.map((type) => (
          <Card key={type.id} className="p-4 flex justify-between items-center">
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
                onClick={() => handleEdit(type)}
              >
                Edit
              </Button>
              <Button
                className="cursor-pointer"
                variant="destructive"
                onClick={() => handleDelete(type.id)}
                disabled={loadingDeleteId === type.id}
              >
                {loadingDeleteId === type.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
