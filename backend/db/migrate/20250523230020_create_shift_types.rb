class CreateShiftTypes < ActiveRecord::Migration[8.0]
  def change
    create_table :shift_types do |t|
      t.string :name
      t.string :color_code

      t.timestamps
    end
  end
end
