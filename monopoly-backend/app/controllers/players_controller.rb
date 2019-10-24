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
        player.current_turn = params[:current_turn]

        player.jail_turn = params[:jail_turn]
        # if (params[:jail_turn] == 5){player.jail_turn = 0}

        player.save
        render json: PlayerSerializer.new(player).to_serialized_json
    end

    def create
        player = Player.create(player_params)
        
        render json: PlayerSerializer.new(player).to_serialized_json
    end

    def player_params
        params.require(:player).permit(:name, :cash, :piece, :currently_on)
    end
end
