document.addEventListener('DOMContentLoaded', () => {

    ///////////////////////////////DOM CONSTANTS/////////////////////////////////
    const diceDisplay = document.getElementById('rolls-display');
    const propertyShow = document.getElementById('show-property');
    const playerShow = document.getElementById('show-player');
    const showMiddle = document.getElementById('middle-show');
    const endButtonContainer = document.getElementById('end-button-container');
    /////////////////////////////////////////////////////////////////////////////
    const playGame = (playerArray) => {
        const idArray = playerArray.map(player => player.id);
        const currentPlayer = playerArray.find(player => player.current_turn == true)
        playerArray.forEach(placePlayerNoAction) //places players on their board position and doesnt trigger actions

        if (currentPlayer){ //finds out who's turn it is
            playerTurn(currentPlayer, idArray);
        }else{
            playerTurn(playerArray[0], idArray);
        }
    }
    /////////////////////////////////////////////////////////////////////////////
    const playerTurn = (player, array) => { 
        createEndTurnButton(player, array) 
        player.current_turn = true;
        patchPlayer(player)
            .then(json => {
                displayPlayer(json);
                createRollButton(json);
            })
    }
    /////////////////////////////////////////////////////////////////////////////
    ////////////PLACE PLAYER ON BOARD (NO ACTION)///////////////////////////////
    const placePlayerNoAction = (player) => {
        getPlayer(player).then(displayPlayer)
        const tile = document.getElementById(`${player.currently_on}`);
        createPlayerImg(player, tile);
    }

    const createPlayerImg = (player, tile) => {
        const newImg = document.createElement('img');
            newImg.id = `player-${player.id}`
            newImg.src = player.piece;
            newImg.className = "playerImg"
            tile.append(newImg);
    }
    /////////////////////////////////////////////////////////////////////////////
    ///////////////END TURN LOGIC////////////////////////////////
    const createEndTurnButton = (player, array) => {
        const endButton = document.createElement('button');
        endButton.innerText = 'End Turn';
        endButton.id = 'end-turn-button';
        endButtonContainer.append(endButton);
        endButton.className = 'hidden';
        endButton.addEventListener('click', () => endTurn(player,array))
    }

    const endTurn = (player, array) => {
        player.current_turn = false;
        const nextPlayerIndex = (array.indexOf(player.id) + 1) % array.length;
        const nextPlayer = {id: array[nextPlayerIndex], current_turn: true};
        patchPlayer(player)
        getPlayer(nextPlayer)
            .then(json => newTurn(json,array))
    }

    const newTurn = (player, array) => {
        removeChildren(diceDisplay);
        removeChildren(endButtonContainer);
        removeChildren(showMiddle);
        showMiddle.className = 'hidden';
        playerTurn(player, array)
    }
    /////////////////////////////////////////////////////////////////////////////
    /////////////ROLL DICE////////////////////////////
    const createRollButton = (player) => {
        const rollButton = document.createElement('button');
        rollButton.id = 'roll-button';
        rollButton.innerText = 'Roll 🎲 🎲';
        rollButton.style = 'position: absolute; left: 30%; top: 4%;';
        diceDisplay.append(rollButton);
        rollButton.addEventListener('click', () => movePlayerFromRoll(player, rollButton));
    }
    /////////////////////////////////////////////////////////////////////////////
    //////////MOVE PLAYER (AFTER PRESSING ROLL BUTTON)///////////////////////////
    const movePlayerFromRoll = (player, button) => {
        button.remove();
        removePlayerFromBoard(player);
        const diceVals = updatePositionFromRoll(player);
        placePlayerOnBoard(player);
    }
    //////////REMOVE PLAYER IMG FROM BOARD/////////////////////////////
    const removePlayerFromBoard = (player) => {
        const to_remove = document.getElementById(`player-${player.id}`);
        to_remove.remove();
    }
    //////////UPDATE POSITION FROM DICE ROLL/////////////////////////////
    const updatePositionFromRoll = (player) => {
        const diceVals = rollDice();
        const total = diceVals[0] + diceVals[1];
        const oldPos = player.currently_on
        let newPos = (total + oldPos) % 40;
        showMiddle.className = 'hidden';
        if (newPos == 0){newPos = 40;}
        player.currently_on  = newPos;

        if (newPos < oldPos){
            player.cash += 200;
            patchPlayer(player)
                .then(displayPlayer(player))
            }
        return diceVals;
    }
    //////////ROLL DICE, DISPLAY OUTCOME/////////////////////////////
    const rollDice = () => {
        const die1 = getRandomInt(6);
        const die2 = getRandomInt(6);
        const newP = document.createElement('p');
        newP.style = 'padding-top: 5%;'
        newP.innerText = `Rolled: ${die1} , ${die2}`;
        removeChildren(diceDisplay);
        diceDisplay.append(newP);
        return [die1,die2];
    }
    ////////PLACE PLAYER ON BOARD TO UPDATED POSITION///////////////////////////////
    const placePlayerOnBoard = (player) => {
        getPlayer(player).then(displayPlayer(player))
        const tile = document.getElementById(`${player.currently_on}`);
        createPlayerImg(player, tile);

        getProperty(tile.id)
            .then(json => playerAction(player, json))
    }
    /////////////////////////////////////////////////////////////////////////////
    //////////PLAYER ACTION ON LANDED TILE///////////////////////////
    const playerAction = (player, property) => {
        if (nonProperty(property)){
            if ([3,18,34].includes(property.id)){
                console.log('Pick up a Community Chest card');
            }else if ([8,23,37].includes(property.id)){
                console.log('Pick up a Chance card');
            }else if ([5,39].includes(property.id)){
                payTax(player, property);
            }else if (property.id == 21){
                console.log('collect cash from the middle')
            }else if (property.id == 31){
                console.log('go to jail')
                goToJailMessage();
                movePlayerDirectlyToLocation(player, 11);
            }
        }else{
            if (property.player.id == 1){
                askToBuy(player, property);
                displayProperty(property);
            } else if (property.player.id == player.id){
                youOwnThis(property);
            } 
            else{
                console.log(`You must pay ${property.player.name} £${property.rent}M.`);
                payPropertyOwner(player, property)
            }
        }
    }
    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////


})