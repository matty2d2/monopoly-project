class PlayerSerializer
 
    def initialize(player_object)
      @player = player_object
    end
     
    def to_serialized_json
      @player.to_json(:include => {:properties => {:except => [:created_at, :updated_at]}}, :except => [:created_at, :updated_at])#:only => [:id, :name, :cash, :piece, :currently_on])
    end
     
end