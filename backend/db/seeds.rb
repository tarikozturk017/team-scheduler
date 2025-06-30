# Shift Types
ShiftType.create!([
  { name: "Morning", color_code: "#DFF0D8" },
  { name: "Evening", color_code: "#D9EDF7" },
  { name: "Night", color_code: "#F2DEDE" }
])

# Users & Employees
users = [
  { email: "alice@example.com", name: "Alice Johnson", role: "Barista" },
  { email: "bob@example.com", name: "Bob Smith", role: "Cashier" },
  { email: "clara@example.com", name: "Clara Lee", role: "Manager" }
]

users.each do |u|
  user = User.create!(
    email: u[:email],
    password: "password",
    password_confirmation: "password"
  )
  Employee.create!(
    user: user,
    name: u[:name],
    role: u[:role]
  )
end

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
