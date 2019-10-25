class CreatePlayers < ActiveRecord::Migration[6.0]
  def change
    create_table :players do |t|
      t.string :name
      t.integer :cash, :default => 1500
      t.string :piece
      t.integer :currently_on, :default => 1
      t.boolean :current_turn, :default => false
      t.integer :jail_turn, :default => 0

      t.timestamps
    end
  end
end
