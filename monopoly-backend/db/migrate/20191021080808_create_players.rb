class CreatePlayers < ActiveRecord::Migration[6.0]
  def change
    create_table :players do |t|
      t.string :name
      t.integer :cash
      t.string :piece
      t.integer :currently_on

      t.timestamps
    end
  end
end
