class PropertiesController < ApplicationController

    def index
        properties = Property.all
        render json: PropertySerializer.new(properties).to_serialized_json
    end

    def show
        property = Property.find(params[:id])
        render json: PropertySerializer.new(property).to_serialized_json
    end

    def update
        property = Property.find(params[:id])
        player = Player.find(params[:player][:id])
        property.player_id = params[:player][:id]
        player.cash = params[:player][:cash]
        property.save
        player.save
        render json: PropertySerializer.new(property).to_serialized_json
    end

end

