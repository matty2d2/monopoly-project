class CreateProperties < ActiveRecord::Migration[6.0]
  def change
    create_table :properties do |t|
      t.string :name
      t.string :set
      t.integer :price
      t.integer :rent
      t.integer :mortgage_val
      t.integer :player_id
      t.string :url

      t.timestamps
    end
  end
end
