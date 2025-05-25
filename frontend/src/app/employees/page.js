"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    api
      .get("/employees")
      .then((res) => setEmployees(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load employees.");
      });
  };

  const handleCreate = () => {
    if (!name || !role) {
      toast.warning("Please enter both name and role.");
      return;
    }

    setLoadingCreate(true);

    api
      .post("/employees", { employee: { name, role } })
      .then(() => {
        setName("");
        setRole("");
        fetchEmployees();
        toast.success("Employee added successfully!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to add employee.");
      })
      .finally(() => setLoadingCreate(false));
  };

  const handleDelete = (id) => {
    setLoadingDeleteId(id);

    api
      .delete(`/employees/${id}`)
      .then(() => {
        fetchEmployees();
        toast.success("Employee deleted.");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete employee.");
      })
      .finally(() => setLoadingDeleteId(null));
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Employees</h1>

      {/* Create Form */}
      <Card className="p-4 space-y-4">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Role</Label>
          <Input value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <Button onClick={handleCreate} disabled={loadingCreate}>
          {loadingCreate ? "Adding..." : "Add Employee"}
        </Button>
      </Card>

      {/* Employee List */}
      <div className="space-y-2">
        {employees.map((emp) => (
          <Card key={emp.id} className="p-4 flex justify-between items-center">
            <div>
              {emp.name} – {emp.role}
            </div>
            <Button
              variant="destructive"
              onClick={() => handleDelete(emp.id)}
              disabled={loadingDeleteId === emp.id}
            >
              {loadingDeleteId === emp.id ? "Deleting..." : "Delete"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
