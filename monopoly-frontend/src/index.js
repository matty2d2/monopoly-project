document.addEventListener('DOMContentLoaded', () => {

    ///////////////////////////////DOM CONSTANTS/////////////////////////////////
    const diceDisplay = document.getElementById('rolls-display');
    const propertyShow = document.getElementById('show-property');
    const playerShow = document.getElementById('show-player');
    const showMiddle = document.getElementById('middle-show');
    const endButtonContainer = document.getElementById('end-button-container');

    const nonPropertyArray = [1,3,5,8,11,18,21,23,31,34,37,39];
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
        removeShowMiddle();
        displayPlayerTurn(player)   
        player.current_turn = true;
        patchPlayer(player)
            .then(json => {
                displayPlayer(json);
                createRollButton(json, array);
            })
    }
    /////////////////////////////////////////////////////////////////////////////
    ////////////DISPLAY WHOS TURN IT IS///////////////////////////////
    const displayPlayerTurn = (player) => {
        const newP = document.createElement('p');
        newP.innerText = `It is ${player.name}'s Turn!`;
        newP.style = 'color: white;';
        showMiddle.append(newP);
        showMiddle.className = '';
    }
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
    const createRollButton = (player, array) => {
        const rollButton = document.createElement('button');
        rollButton.id = 'roll-button';
        rollButton.innerText = 'Roll 🎲 🎲';
        rollButton.style = 'position: absolute; left: 30%; top: 4%;';
        diceDisplay.append(rollButton);
        rollButton.addEventListener('click', () => movePlayerFromRoll(player, rollButton, array));
    }
    /////////////////////////////////////////////////////////////////////////////
    //////////MOVE PLAYER (AFTER PRESSING ROLL BUTTON)///////////////////////////
    const movePlayerFromRoll = (player, button, array) => {
        button.remove();
        removeChildren(showMiddle);
        removePlayerFromBoard(player);
        const diceVals = updatePositionFromRoll(player);

        checkForJail(player, diceVals);
        
        patchPlayer(player)
            .then(json => {
                displayPlayer(json);
                placePlayerOnBoard(json, array, diceVals);
            })
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
    // random integer for dice value
    const getRandomInt = max => {
        return 1 + Math.floor(Math.random() * Math.floor(max));
    }
    ////////CHECK IF IN JAIL + LOGIC///////////////////////////////
    const checkForJail = (player, diceVals) => {
        if (player.jail_turn > 0){
            if (diceVals[0]==diceVals[1]){
                console.log("You successfully escaped jail by rolling doubles!");
                player.jail_turn = 0;
            }else if(player.jail_turn == 4){
                console.log('You have served Jail-time and must now pay 50M.');
                player.jail_turn = 0;
                if (player.cash<50){
                    console.log(`You could only pay ${player.cash} but they will let you off.`);
                    player.cash = 0;
                }else{
                    player.cash -= 50;
                }
            }else {
                console.log("You couldn't escape jail by rolling doubles. You are stuck in jail.");
                player.currently_on = 11;
                player.jail_turn += 1;
            }
            return player;
        } 
    }
    ////////PLACE PLAYER ON BOARD TO UPDATED POSITION///////////////////////////////
    const placePlayerOnBoard = (player, array, extraTurn) => {
        const tile = showPlayerOnBoard(player);

        getProperty(tile.id)
            .then(json => playerAction(player, json, array, extraTurn))
    }
    /////////////////////////////////////////////////////////////////////////////
    //////////SHOW PLAYER ON BOARD///////////////////////////
    const showPlayerOnBoard = (player) => {
        getPlayer(player).then(displayPlayer(player))
        const tile = document.getElementById(`${player.currently_on}`);
        createPlayerImg(player, tile);
        return tile;
    }
    /////////////////////////////////////////////////////////////////////////////
    //////////PLAYER ACTION ON LANDED TILE///////////////////////////
    const playerAction = (player, property, array, extraTurn) => {   
        if (nonProperty(property)){
            if ([3,18,34].includes(property.id)){
                console.log('Pick up a Community Chest card');
                checkForExtraTurn(player, array, extraTurn);
            }else if ([8,23,37].includes(property.id)){
                console.log('Pick up a Chance card');
                checkForExtraTurn(player, array, extraTurn);
            }else if ([5,39].includes(property.id)){
                payTax(player, property, array);
            }else if (property.id == 31){
                console.log('go to jail')
                goToJailMessage();
                movePlayerDirectlyToLocation(player, 11, array, extraTurn);
            }else{
                showMiddle.className = '';
                const newButton = createOkButton();
                newButton.addEventListener('click', ()=>{
                    removeShowMiddle();
                    checkForExtraTurn(player, array, extraTurn);
                })
                
            }
        }else{
            if (property.player.id == 1){
                displayProperty(property);
                askToBuy(player, property, array, extraTurn);
            } else if (property.player.id == player.id){
                displayProperty(property);
                youOwnThis(player, property, array, extraTurn);
            } else if (property.id == 13){
                payUtilityOwner(player, property, array, extraTurn)
            } else if (property.id == 29){
                payUtilityOwner(player, property, array, extraTurn)
            }else{
                payPropertyOwner(player, property, array, extraTurn)
            }
        }
    }
    /////////////////////////////////////////////////////////////////////////////
    /////////////CHECKS IF NON-PROPERTY//////////////////////////////////
    const nonProperty = (property) => {
        const check = nonPropertyArray.includes(property.id);
        return check;
    } 
    //////////PLAYER PAYS TAX FROM TILE (displays too)////////////////////////////////////////////////
    const payTax = (player, property, array) => {
        const newP = document.createElement('p');
        newP.innerText = `You payed ${property.price}M in tax!`
        newP.style = 'color: white;';
        showMiddle.append(newP);
        showMiddle.className = '';
        player.cash -= property.price;
        if (player.cash<0){player.cash = 0}
        patchPlayer(player)
            .then(json=>{
                displayPlayer(json); 
                createEndTurnButton(json, array);
            })
    }
    //////////DISPLAYS GO TO JAIL MESSAGE////////////////////////////////////////////////
    const goToJailMessage = () => {
        const newP = document.createElement('p');
        newP.innerText = `Oops... You landed on Go To Jail!`;
        newP.style = 'color: white;';
        showMiddle.append(newP);
        showMiddle.className = '';
    }
    //////////MOVES PLAYER TO TARGET LOCATION////////////////////////////////////////////////
    const movePlayerDirectlyToLocation = (player, property_id, array, extraTurn) => {
        removePlayerFromBoard(player);
        player.currently_on = property_id; // update player location
        if (property_id == 11){player.jail_turn += 1}
        patchPlayer(player)
            .then(json=>{
                showPlayerOnBoard(json);
                checkForExtraTurn(json, array, extraTurn);
            })
    }
    //////////CREATE OK BUTTON////////////////////////////////////////////////
    const createOkButton = () => {
        const newButton = document.createElement('button');
        newButton.innerText = 'Ok';
        showMiddle.append(newButton);
        return newButton;
    }
    //////////REMOVE THE MIDDLE SHOW////////////////////////////////////////////////
    const removeShowMiddle = () => {
        removeChildren(showMiddle);
        showMiddle.className = 'hidden';
    }
    /////////////////////////////////////////////////////////////////////////////
    //////////ASKS PLAYER IF WANTS TO BUY PROPERTY////////////////////////////////////////////////
    const askToBuy = (player, property, array, extraTurn) => {
        removeChildren(showMiddle);
        showMiddle.className = '';
        const title = document.createElement('p');
        const buyButton = document.createElement('button');
        const dontBuyButton = document.createElement('button');
        title.style = 'color: white;'
        title.innerText = `Would you like to buy ${property.name}?`;
        buyButton.innerText = 'Buy';
        dontBuyButton.innerText = "Don't Buy";
        showMiddle.append(title, dontBuyButton, buyButton);

        dontBuyButton.addEventListener('click', ()=>notBuyProperty(player, array, extraTurn));
        buyButton.addEventListener('click', () => buyProperty(player, property, array, extraTurn));
    }
    //////////PLAYER BUYS PROPERTY////////////////////////////////////////////////
    const buyProperty = (player, property, array, extraTurn) => {
        showMiddle.className = 'hidden';
        if (player.cash>property.price){
            player.cash -= property.price;
            property.player = player
            
            patchProperty(property)
                .then(json => {
                    displayProperty(json);
                    patchPlayer(player)
                        .then(json=>{
                            displayPlayer(json);
                            checkForExtraTurn(json, array, extraTurn);
                        })
                })
        }else{
            if (showMiddle.children.length == 4){
                showMiddle.lastChild.remove();
            }
            notEnoughCash(player, property);
        }
    }
    //////////NOT ENOUGH CASH MESSAGE////////////////////////////////////////////////
    const notEnoughCash = (player, property) =>{
        const newP = document.createElement('p');
        newP.innerText = `Sorry you don't have enough cash. ${property.name} costs ${property.price}M but you only have ${player.cash}M.`;
        newP.style = 'color: white';
        showMiddle.append(newP);
        showMiddle.className = '';
    }
    //////////PLAYER DOES NOT BUY PROPERTY////////////////////////////////////////////////
    const notBuyProperty = (player, array, extraTurn) => {  
        showMiddle.className = 'hidden';
        checkForExtraTurn(player, array, extraTurn);
    }
    //////////TELLS PLAYER THAT THEY OWN THAT PROPERTY////////////////////////////////////////////////
    const youOwnThis = (player, property, array, extraTurn) => {
        const newP = document.createElement('p');
        const newButton = document.createElement('button');
        newButton.innerText = 'Ok';
        newP.innerText = `You own ${property.name}. Welcome Back!`;
        newP.style = 'color: white;';
        showMiddle.append(newP, newButton);
        showMiddle.className = '';

        newButton.addEventListener('click', () => {
            removeShowMiddle();
            checkForExtraTurn(player, array, extraTurn);
        })
    }
    //////////PAYS UTILITY OWNER RENT////////////////////////////////////////////////
    const payUtilityOwner = (player, property, array, extraTurn) => {
        const payer = player;
        const payee = property.player;
        const newP = document.createElement('p');
        const newButton = document.createElement('button');
        const rent = 4 * (extraTurn[0]+extraTurn[1]);

        newButton.innerText = 'Ok';
        newP.style = 'color: white;';
        showMiddle.append(newP, newButton);
        showMiddle.className = '';

        if (player.cash<rent){
            newP.innerText = `${property.player.name} owns ${property.name}. Rent costs £${rent}M but you could only pay ${player.cash}!`;
            payee.cash += player.cash
            player.cash = 0
        }else{
            newP.innerText = `${property.player.name} owns ${property.name}. You paid them £${rent}M for rent.`;
            payer.cash -= rent;
            payee.cash += rent;
        }

        patchPlayer(payer)
            .then(json=>{
                patchPlayer(payee);
                newButton.addEventListener('click', ()=>{
                    removeShowMiddle();
                    displayPlayer(json);
                    checkForExtraTurn(json, array, extraTurn);
                })
            })
        
    }
    //////////PAYS PROPERTY OWNER RENT////////////////////////////////////////////////
    const payPropertyOwner = (player, property, array, extraTurn) => {
        const payer = player;
        const payee = property.player;
        const newP = document.createElement('p');
        const newButton = document.createElement('button');

        newButton.innerText = 'Ok';
        newP.style = 'color: white;';
        showMiddle.append(newP,newButton);
        showMiddle.className = '';

        if (player.cash<property.rent){
            newP.innerText = `${property.player.name} owns ${property.name}. Rent costs £${property.rent}M but you could only pay ${player.cash}!`;
            payee.cash += player.cash
            player.cash = 0
        }else{
            newP.innerText = `${property.player.name} owns ${property.name}. You paid them £${property.rent}M for rent.`;
            payer.cash -= property.rent;
            payee.cash += property.rent;
        }
        
        patchPlayer(payer)
            .then(json=>{
                patchPlayer(payee);
                newButton.addEventListener('click', ()=>{
                    removeShowMiddle();
                    displayPlayer(json);
                    checkForExtraTurn(json, array, extraTurn);
                })
            })
    }
    /////////////////////////////////////////////////////////////////////////////
    //////////REMOVES ALL CHILDREN FROM PARENT NODE////////////////////////////////////////////////
    const removeChildren = (parent) => {
        while (parent.hasChildNodes()){
            parent.removeChild(parent.firstChild);
        }
    }
    ///////////////CHECK FOR EXTRA TURN/////////////////////////////////////
    const checkForExtraTurn = (player, array, extraTurn) => {
        if (extraTurn[0]==extraTurn[1]){
            patchPlayer(player)
                .then(json => playerTurn(json, array))
        }else{
            setTimeout(createEndTurnButton(player, array), 1000);
        }
    }
    ////////////////////////////////////DISPLAYS//////////////////////////////
    const displayProperty = (property) => {
        removeChildren(propertyShow);
      
        const name = document.createElement('h1');
        name.innerText = property.name;
      
        const image = document.createElement('img');
        image.src = property.url;
        image.style = 'max-height: 35%;'
      
        const set = document.createElement('h4');
        set.innerText = property.set + ' Set'
      
        const price = document.createElement('h4');
        price.innerText = `Price: ${property.price}M`;
      
        const rent = document.createElement('p');
        rent.innerText = `Rent: ${property.rent}M`;
      
        const mortgage = document.createElement('p');
        mortgage.innerText = `Mortgage: ${property.mortgage_val}M`;

        const owner = document.createElement('p');
        owner.innerText = `Owned by: ${property.player.name}`
      
        propertyShow.append(name,image,set,price,rent,mortgage, owner);
    }
    /////////////////////////////////////////////////////////////////////////////
    const displayPlayer = (player) =>{
        removeChildren(playerShow)
        const name = document.createElement('h1')
        const cash = document.createElement('h4')
        
        name.innerText = player.name;
        cash.innerText = 'Cash: ' + player.cash + 'M';
        playerShow.append(name,cash)

        if (player.properties){
            const ul = document.createElement('ul')
            const propertiesTitle = document.createElement('h4')
            propertiesTitle.innerText = 'Properties:'
            playerShow.append(propertiesTitle, ul)
            player.properties.forEach(property =>{
                const propertyLi = document.createElement('li')
                propertyLi.innerText = property.name
                ul.append(propertyLi)
            })    
        }
       return player; 
    }
    /////////////////////////////////////////////////////////////////////////////
    //////////MAKE ARRAY OF PLAYERS FOR GAME PLAYING ORDER/////////////////////
    const makePlayersArray = () => {
        getPlayers()
            .then(json=>{
                json.shift();
                let playerArray = json;
                playGame(playerArray);
            })
    }
    /////////////////////////////////////////////////////////////////////////////
    ////////RUN THE GAME///////
    getProperties()
        .then(createBoardDivs)
        .then(makePlayersArray)

})



/// THE FORM IS BELOW//////////////

// const form = document.querySelector('form')
// form.addEventListener('submit', e=>{
//     e.preventDefault()
    
//     const name = e.target.name.value;
//     const number = e.target.number.value;
//     const cash = 1500;
//     const piece = "./src/images/pic1.jpeg";
//     const currently_on = 0;
//     const new_player = { name: name, cash: cash, piece: piece, currently_on: currently_on }
//     postPlayer(new_player)
// })
