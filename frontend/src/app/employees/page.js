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
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const clearForm = () => {
    setName("");
    setRole("");
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!name || !role) {
      toast.warning("Please enter both name and role.");
      return;
    }

    setLoading(true);

    const payload = { employee: { name, role } };
    const request = editingId
      ? api.patch(`/employees/${editingId}`, payload)
      : api.post("/employees", payload);

    request
      .then(() => {
        fetchEmployees();
        toast.success(editingId ? "Employee updated!" : "Employee added!");
        clearForm();
      })
      .catch((err) => {
        console.error(err);
        toast.error(editingId ? "Update failed." : "Creation failed.");
      })
      .finally(() => setLoading(false));
  };

  const handleEdit = (emp) => {
    setName(emp.name);
    setRole(emp.role);
    setEditingId(emp.id);
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

      {/* Create/Edit Form */}
      <Card className="p-4 space-y-4">
        <div>
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Role</Label>
          <Input value={role} onChange={(e) => setRole(e.target.value)} />
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
              ? "Update Employee"
              : "Add Employee"}
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

      {/* Employee List */}
      <div className="space-y-2">
        {employees.map((emp) => (
          <Card key={emp.id} className="p-4 flex justify-between items-center">
            <div>
              {emp.name} – {emp.role}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleEdit(emp)}
                className="cursor-pointer"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={() => handleDelete(emp.id)}
                disabled={loadingDeleteId === emp.id}
              >
                {loadingDeleteId === emp.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
