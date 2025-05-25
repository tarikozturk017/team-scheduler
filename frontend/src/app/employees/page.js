"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import EmployeeForm from "@/components/employee/EmployeeForm";
import EmployeeItem from "@/components/employee/EmployeeItem";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    if (isFirstLoad) setLoadingFetch(true);
    api
      .get("/employees")
      .then((res) => setEmployees(res.data))
      .catch(() => toast.error("Failed to load employees."))
      .finally(() => {
        if (isFirstLoad) setLoadingFetch(false);
        setIsFirstLoad(false);
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
      .catch(() => toast.error("Failed to save employee."))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    setLoadingDeleteId(id);
    api
      .delete(`/employees/${id}`)
      .then(() => {
        fetchEmployees();
        toast.success("Employee deleted.");
      })
      .catch(() => toast.error("Failed to delete employee."))
      .finally(() => setLoadingDeleteId(null));
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Employees</h1>

      <EmployeeForm
        name={name}
        role={role}
        onNameChange={(e) => setName(e.target.value)}
        onRoleChange={(e) => setRole(e.target.value)}
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
          : employees.map((emp) => (
              <EmployeeItem
                key={emp.id}
                employee={emp}
                onEdit={() => {
                  setEditingId(emp.id);
                  setName(emp.name);
                  setRole(emp.role);
                }}
                onDelete={handleDelete}
                deleting={loadingDeleteId === emp.id}
              />
            ))}
      </div>
    </div>
  );
}
