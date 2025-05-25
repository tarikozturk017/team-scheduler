"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";

export default function ShiftTypePage() {
  const [shiftTypes, setShiftTypes] = useState([]);
  const [name, setName] = useState("");
  const [colorCode, setColorCode] = useState("");

  useEffect(() => {
    fetchShiftTypes();
  }, []);

  const fetchShiftTypes = () => {
    api
      .get("/shift_types")
      .then((res) => setShiftTypes(res.data))
      .catch(console.error);
  };

  const handleCreate = () => {
    if (!name || !colorCode) return;
    api
      .post("/shift_types", { shift_type: { name, color_code: colorCode } })
      .then(() => {
        setName("");
        setColorCode("");
        fetchShiftTypes();
      })
      .catch(console.error);
  };

  const handleDelete = (id) => {
    api.delete(`/shift_types/${id}`).then(fetchShiftTypes).catch(console.error);
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
        <Button onClick={handleCreate}>Add Shift Type</Button>
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
            <Button variant="destructive" onClick={() => handleDelete(type.id)}>
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
