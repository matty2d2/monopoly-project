console.log('index.js');

document.addEventListener('DOMContentLoaded', () => {
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////CONSTANTS///////////////////////////////////
    console.log('Dom content loaded');

    const diceDisplay = document.getElementById('rolls-display');
    const propertyShow = document.getElementById('show-property');
    const playerShow = document.getElementById('show-player');
    const showMiddle = document.getElementById('middle-show');
    const endButtonContainer = document.getElementById('end-button-container');
    
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    const playGame = (playerArray) => {
        const idArray = playerArray.map(player => player.id);
        
        playerArray.forEach(placePlayerNoAction)

        const currentPlayer = playerArray.find(player => player.current_turn == true)

        if (currentPlayer){
            playerTurn(currentPlayer, idArray);
        }else{
            playerTurn(playerArray[0], idArray);
        }
    }
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    const playerTurn = (player, array) => {  
        player.current_turn = true;
        patchPlayer(player)
            .then(json => {
                displayPlayer(json);
                createRollButton(json, array);
            })
    }
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    const placePlayerNoAction = (player) => {
        getPlayer(player).then(displayPlayer)
        const tile = document.getElementById(`${player.currently_on}`);
        createPlayerImg(player, tile);
    }

    const createRollButton = (player, array) => {
        const rollButton = document.createElement('button');
        rollButton.id = 'roll-button';
        rollButton.innerText = 'Roll 🎲 🎲';
        rollButton.style = 'position: absolute; left: 30%; top: 4%;';
        diceDisplay.append(rollButton);
        rollButton.addEventListener('click', () => movePlayerFromRoll(player, array, rollButton));
    }

    const movePlayerFromRoll = (player, array, button) => {
        removePlayerFromPreviousLocation(player);
        const diceVals = updatePositionFromRoll(player);
        placePlayerOnBoard(player);
        button.remove();
        
        setTimeout(doNothing, 1000);
        const extraTurn = diceVals[0] == diceVals[1];
        if (extraTurn){
            patchPlayer(player)
                .then(json => playerTurn(json, array))
        } else{
            endTurn(player, array)
        }
    }

    const endTurn = (player, array) => {
        player.current_turn = false;
        const nextPlayerIndex = (array.indexOf(player.id) + 1) % array.length;
        const nextPlayer = {id: array[nextPlayerIndex], current_turn: true};
        patchPlayer(player)
        getPlayer(nextPlayer)
            .then(b=> {
                b.current_turn = true;
                displayEndTurnButton(b, array)
            })
    }

    const displayEndTurnButton = (player, array) => {
        const endButton = document.createElement('button');
        endButton.innerText = 'End Turn';
        endButtonContainer.append(endButton);
        endButton.addEventListener('click', () => newTurn(player, array));
        endButton.removeEventListener
    }

    const newTurn = (player, array) => {
        removeChildren(diceDisplay);
        removeChildren(endButtonContainer);
        removeChildren(showMiddle);
        showMiddle.className = 'hidden';
        playerTurn(player, array)
    }

    const removePlayerFromPreviousLocation = (player) => {
        // const oldTile = document.getElementById(`${player.currently_on}`);
        const to_remove = document.getElementById(`player-${player.id}`);
        to_remove.remove();
    }

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

    const placePlayerOnBoard = (player) => {
        getPlayer(player).then(displayPlayer(player))
        const tile = document.getElementById(`${player.currently_on}`);
        createPlayerImg(player, tile);

        getProperty(tile.id)
            .then(json => playerAction(player, json))
    }

    const createPlayerImg = (player, tile) => {
        const newImg = document.createElement('img');
            newImg.id = `player-${player.id}`
            newImg.src = player.piece;
            newImg.className = "playerImg"
            tile.append(newImg);
    }

    const playerAction = (player, property) => {
        if (nonProperty(property)){
            if ([3,18,34].includes(property.id)){
                console.log('Pick up a Community Chest card');
            }else if ([8,23,37].includes(property.id)){
                console.log('Pick up a Chance card');
            }else if ([5,39].includes(property.id)){
                payTax(player, property);
                console.log('add cash paid to middle');
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

    const goToJailMessage = () => {
        const newP = document.createElement('p');
        newP.innerText = `Oops... You landed on Go To Jail!`;
        newP.style = 'color: white;';
        showMiddle.append(newP);
        showMiddle.className = '';
    }

    const youOwnThis = (property) => {
        const newP = document.createElement('p');
        newP.innerText = `You own ${property.name}. Welcome Back!`;
        newP.style = 'color: white;';
        showMiddle.append(newP);
        showMiddle.className = '';
    }

    const payPropertyOwner = (player, property) => {
        const payer = player;
        const payee = property.player;
        const newP = document.createElement('p');
        newP.innerText = `${property.player.name} owns ${property.name}. You paid them £${property.rent}M for rent.`;
        newP.style = 'color: white;';
        showMiddle.append(newP);
        showMiddle.className = '';
        payer.cash -= property.rent;
        payee.cash += property.rent;
        patchPlayer(payer)
            .then(json=>{
                displayPlayer(json);
                patchPlayer(payee);
            })

    }

    const askToBuy = (player, property) => {
        removeChildren(showMiddle);
        showMiddle.className = '';
        const title = document.createElement('p');
        title.style = 'color: white;'
        const buyButton = document.createElement('button');

        title.innerText = `Would you like to buy ${property.name}?`;
        buyButton.innerText = 'Buy';
        showMiddle.append(title, buyButton)

        buyButton.addEventListener('click', () => buyProperty(player,property))
    }   

    const buyProperty = (player, property) => {
        showMiddle.className = 'hidden';
        if (player.cash>property.price){
            player.cash -= property.price;
            property.player = player
            patchProperty(property)
                .then(json => {
                    displayProperty(json);
                    getPlayer(player)
                        .then(displayPlayer)
                })
        }
    }

    const movePlayerDirectlyToLocation = (player, property_id) => {
        removePlayerFromPreviousLocation(player);
        // update player location
        player.currently_on = property_id;
        patchPlayer(player)
            .then(placePlayerOnBoard(player))
    }

    const makePlayersArray = () => {
        getPlayers()
            .then(json=>{
                json.shift();
                let playerArray = json;
                playGame(playerArray);
            })
    }

    const removeChildren = (parent) => {
        while (parent.hasChildNodes()){
            parent.removeChild(parent.firstChild);
        }
    }

    const payTax = (player, property) => {
        const newP = document.createElement('p');
        newP.innerText = `You payed ${property.price}M in tax!`
        newP.style = 'color: white;';
        showMiddle.append(newP);
        showMiddle.className = '';
        player.cash -= property.price;
        patchPlayer(player)
            .then(displayPlayer)
    }

    const getRandomInt = max => {
        return 1 + Math.floor(Math.random() * Math.floor(max));
    }
    
    const nonProperty = (property) => {
        const nonPropertyArray = [1,3,5,8,11,18,21,23,31,34,37,39];
        const check = nonPropertyArray.includes(property.id);
        return check;
    } 

    const doNothing = () =>{return}
    ////////////////////////////////////DISPLAYS//////////////////////////////
    const displayProperty = (property) => {
        removeChildren(propertyShow);
      
        const name = document.createElement('h1');
        name.innerText = property.name;
      
        const image = document.createElement('img');
        image.src = property.url;
        image.style = 'max-height: 35%;'
      
        const set = document.createElement('h2');
        set.innerText = property.set + ' Colour Set'
      
        const price = document.createElement('h2');
        price.innerText = `Price: ${property.price}M`;
      
        const rent = document.createElement('p');
        rent.innerText = `Rent: ${property.rent}M`;
      
        const mortgage = document.createElement('p');
        mortgage.innerText = `Mortgage: ${property.mortgage_val}M`;

        const owner = document.createElement('p');
        owner.innerText = `Owned by: ${property.player.name}`
      
        propertyShow.append(name,image,set,price,rent,mortgage, owner);
    }

    const displayPlayer = (player) =>{
        removeChildren(playerShow)
        const name = document.createElement('h1')
        const cash = document.createElement('h2')
        const ul = document.createElement('ul')
        
        name.innerText = player.name;
        cash.innerText = player.cash + 'M';

        if (player.properties){
            player.properties.forEach(property =>{
                const propertyLi = document.createElement('li')
                propertyLi.innerText = property.name
                ul.append(propertyLi)
            })    
        }
        playerShow.append(name,cash, ul)
    }
    
    const form = document.querySelector('form')
    form.addEventListener('submit', e=>{
        e.preventDefault()
        
        const name = e.target.name.value;
        const number = e.target.number.value;
        const cash = 1500;
        const piece = "./src/images/pic1.jpeg";
        const currently_on = 0;
        const new_player = { name: name, cash: cash, piece: piece, currently_on: currently_on }
        postPlayer(new_player)
    })
    
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    getProperties()
        .then(createBoardDivs)
        .then(makePlayersArray)
    
})


