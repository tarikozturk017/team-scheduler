class Employee < ApplicationRecord
  belongs_to :user
  has_many :shifts, dependent: :destroy
end
