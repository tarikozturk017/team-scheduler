class Employee < ApplicationRecord
    has_many :shifts, dependent: :destroy
end
