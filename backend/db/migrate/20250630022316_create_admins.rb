class CreateAdmins < ActiveRecord::Migration[8.0]
  def change
    create_table :admins do |t|
      t.references :user, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
