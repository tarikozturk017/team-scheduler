# Shift Types (e.g., Morning, Evening)
ShiftType.create!([
  { name: "Morning", color_code: "#DFF0D8" },
  { name: "Evening", color_code: "#D9EDF7" },
  { name: "Night", color_code: "#F2DEDE" }
])

# Employees
Employee.create!([
  { name: "Alice Johnson", role: "Barista" },
  { name: "Bob Smith", role: "Cashier" },
  { name: "Clara Lee", role: "Manager" }
])

# Shifts
Shift.create!([
  {
    employee: Employee.find_by(name: "Alice Johnson"),
    shift_type: ShiftType.find_by(name: "Morning"),
    date: Date.today + 1,
    start_time: "08:00",
    end_time: "16:00"
  },
  {
    employee: Employee.find_by(name: "Bob Smith"),
    shift_type: ShiftType.find_by(name: "Evening"),
    date: Date.today + 1,
    start_time: "14:00",
    end_time: "22:00"
  }
])
