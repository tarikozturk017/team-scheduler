"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    api
      .get("/employees")
      .then((res) => setEmployees(res.data))
      .catch(console.error);
  };

  const handleCreate = () => {
    if (!name || !role) return;
    api
      .post("/employees", { employee: { name, role } })
      .then(() => {
        setName("");
        setRole("");
        fetchEmployees();
      })
      .catch(console.error);
  };

  const handleDelete = (id) => {
    api.delete(`/employees/${id}`).then(fetchEmployees).catch(console.error);
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
        <Button onClick={handleCreate}>Add Employee</Button>
      </Card>

      {/* Employee List */}
      <div className="space-y-2">
        {employees.map((emp) => (
          <Card key={emp.id} className="p-4 flex justify-between items-center">
            <div>
              {emp.name} – {emp.role}
            </div>
            <Button variant="destructive" onClick={() => handleDelete(emp.id)}>
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
