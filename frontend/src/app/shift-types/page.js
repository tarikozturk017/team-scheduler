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
  const [loadingCreate, setLoadingCreate] = useState(false);
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

  const handleCreate = () => {
    if (!name || !colorCode) {
      toast.warning("Please enter both name and color code.");
      return;
    }

    setLoadingCreate(true);

    api
      .post("/shift_types", { shift_type: { name, color_code: colorCode } })
      .then(() => {
        setName("");
        setColorCode("");
        fetchShiftTypes();
        toast.success("Shift type added successfully!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to add shift type.");
      })
      .finally(() => setLoadingCreate(false));
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

      {/* Create Form */}
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
        <Button onClick={handleCreate} disabled={loadingCreate}>
          {loadingCreate ? "Adding..." : "Add Shift Type"}
        </Button>
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
            <Button
              variant="destructive"
              onClick={() => handleDelete(type.id)}
              disabled={loadingDeleteId === type.id}
            >
              {loadingDeleteId === type.id ? "Deleting..." : "Delete"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
