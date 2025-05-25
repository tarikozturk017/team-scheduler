"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    setLoadingFetch(true);
    api
      .get("/employees")
      .then((res) => setEmployees(res.data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load employees.");
      })
      .finally(() => setLoadingFetch(false));
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
        {loadingFetch
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4 flex justify-between items-center">
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </Card>
            ))
          : employees.map((emp) => (
              <Card
                key={emp.id}
                className="p-4 flex justify-between items-center"
              >
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
