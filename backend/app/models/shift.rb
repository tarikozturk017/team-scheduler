class Shift < ApplicationRecord
  belongs_to :employee
  belongs_to :shift_type
end
