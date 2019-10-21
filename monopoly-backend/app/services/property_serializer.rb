class PropertySerializer
 
    def initialize(property_object)
      @property = property_object
    end
     
    def to_serialized_json
      @property.to_json(:include => {:player => {:except => [:created_at, :updated_at]}},:except => [:player_id, :created_at, :updated_at])
    end
     
end