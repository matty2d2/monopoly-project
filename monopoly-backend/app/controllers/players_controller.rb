class PlayersController < ApplicationController

    def index
        players = Player.all
        render json: PlayerSerializer.new(players).to_serialized_json
    end

    def show
        player = Player.find(params[:id])
        render json: PlayerSerializer.new(player).to_serialized_json
    end

    def update
        player = Player.find(params[:id])
        player.cash = params[:cash]
        player.currently_on = params[:currently_on]

        byebug
        player.save
        render json: PlayerSerializer.new(player).to_serialized_json
    end
end
