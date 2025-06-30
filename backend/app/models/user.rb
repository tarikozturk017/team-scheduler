class User < ApplicationRecord
  has_secure_password

  has_one :employee
  has_one :admin

  def employee?
    employee.present?
  end

  def admin?
    admin.present?
  end
end
