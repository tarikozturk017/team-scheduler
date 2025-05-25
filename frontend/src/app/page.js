"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const links = [
  {
    title: "Employees",
    description: "Manage your team and their roles.",
    href: "/employees",
  },
  {
    title: "Shifts",
    description: "Assign and view shift schedules.",
    href: "/shifts",
  },
  {
    title: "Shift Types",
    description: "Customize shift labels and colors.",
    href: "/shift-types",
  },
];

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto mt-12 space-y-6">
      <h1 className="text-3xl font-bold">Welcome to Team Scheduler</h1>
      <p className="text-muted-foreground">
        Manage employees, shift types, and their assignments.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {links.map(({ title, description, href }) => (
          <Link href={href} key={title}>
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold group-hover:text-blue-900">
                  {title}
                </h2>
                <p className="text-sm text-muted-foreground">{description}</p>
                <div className="mt-2">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm text-blue-900"
                  >
                    Go to {title} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
