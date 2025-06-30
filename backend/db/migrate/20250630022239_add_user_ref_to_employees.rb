class AddUserRefToEmployees < ActiveRecord::Migration[8.0]
  def change
    add_reference :employees, :user, foreign_key: true
  end
end
