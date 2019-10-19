class PropertySerializer
 
    def initialize(property_object)
      @property = property_object
    end
     
    def to_serialized_json
      @property.to_json(:only => [:id, :name, :set, :price, :rent, :mortgage_val])
    end
     
end