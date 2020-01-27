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

        player1 = Player.create(player1_params)
        player2 = Player.create(player2_params)

        players = [player1, player2]

        if player3_params[:name].delete(' ') != ''
            player3 = Player.create(player3_params)
            players << player3
        end

        if player4_params[:name].delete(' ') != ''
            player4 = Player.create(player4_params)
            players << player4
        end
        
        render json: PlayerSerializer.new(players).to_serialized_json
    end

    def resetgame
        until Player.all.length == 1 do
            Player.last.destroy
        end

        Property.all.each{|property| property.player_id == 1}
    end

    private

    def player1_params
        params.require(:player1).permit(:name, :piece)
    end

    def player2_params
        params.require(:player2).permit(:name, :piece)
    end

    def player3_params
        params.require(:player3).permit(:name, :piece)
    end

    def player4_params
        params.require(:player4).permit(:name, :piece)
    end


end
