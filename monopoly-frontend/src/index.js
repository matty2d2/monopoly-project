console.log('index.js');


document.addEventListener('DOMContentLoaded', () => {
    const community_chest = ["Advance to Go (Collect $200)","Bank error in your favor—Collect $200","Doctor's fee—Pay $50","From sale of stock you get $50","Get Out of Jail Free","Go to Jail–Go directly to jail–Do not pass Go–Do not collect $200","Grand Opera Night—Collect $50 from every player for opening night seats","Holiday Fund matures—Receive $100","Income tax refund–Collect $20","It is your birthday—Collect $10","Life insurance matures–Collect $100","Pay hospital fees of $100","Pay school fees of $150","Receive $25 consultancy fee","You are assessed for street repairs–$40 per house–$115 per hotel","You have won second prize in a beauty contest–Collect $10","You inherit $100"]
    const chance = ["Advance to Go (Collect $200)","Advance to Illinois Ave—If you pass Go, collect $200","Advance to St. Pall Mall – If you pass Go, collect $200","Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown.","Advance token to the nearest Railroad and pay owner twice the rental to which he/she {he} is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.","Bank pays you dividend of $50","Get Out of Jail Free","Go Back 3 Spaces","Go to Jail–Go directly to Jail–Do not pass Go, do not collect $200","Make general repairs on all your property–For each house pay $25–For each hotel $100","Pay poor tax of $15","Take a trip to Reading Railroad–If you pass Go, collect $200","Take a walk on the Park Lane–Advance token to Park Lane","You have been elected Chairman of the Board–Pay each player $50","Your building and loan matures—Collect $150","You have won a crossword competition—Collect $100"]
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
                communityCard(community_chest, player)
            }else if ([8,23,37].includes(property.id)){
                console.log('Pick up a Chance card');
                chanceCard(chance, player)
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

    ///////////////// Chance ////////////////////
    const chanceCard = (cards, player)=>{
        const new_card = getRandomInt(cards.length)
        // display instruction 
        const newP = document.createElement('p');
        newP.innerText = `${chance[new_card]}`;
        newP.style = 'color: white;';
        showMiddle.append(newP);
        showMiddle.className = '';

        const utilitis = [6,13,16,26,29,36]
        // follow the instruction 
        switch (new_card){
            case 0:
                player.cash += 200;
                break;
            case 1: 
                if (player.currently_on > 15 ){
                    player.cash += 200;
                }
                movePlayerDirectlyToLocation(player, 15);
                break;
            case 2:
                if (player.currently_on > 12 ){
                    player.cash += 200;
                }
                movePlayerDirectlyToLocation(player, 12);
                break;
            case 3:
                // "Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown."    
                if (player.currently_on == 8){
                    movePlayerDirectlyToLocation(player, 14);
                }
                if (player.currently_on == 23){
                    movePlayerDirectlyToLocation(player, 29);
                }
                if (player.currently_on == 37){
                    movePlayerDirectlyToLocation(player, 13);
                }
                break;
            case 4:
                //"Advance token to the nearest Railroad and pay owner twice the rental to which he/she {he} is otherwise entitled. If Railroad is unowned, you may buy it from the Bank."
                if (player.currently_on == 8){
                    movePlayerDirectlyToLocation(player, 16);
                }
                if (player.currently_on == 23){
                    movePlayerDirectlyToLocation(player, 26);
                }
                if (player.currently_on == 37){
                    movePlayerDirectlyToLocation(player, 6);
                }
                break;
            case 5:
                player.cash += 50;
            case 6:
                //get out of jail free
                console.log("get out of jail free");
                break;
            case 7:
                // go back 3 spaces
                if (player.currently_on == 8){
                    movePlayerDirectlyToLocation(player, 5);
                }
                if (player.currently_on == 23){
                    movePlayerDirectlyToLocation(player, 20);
                }
                if (player.currently_on == 37){
                    movePlayerDirectlyToLocation(player, 34);
                }
                break;
            case 8:
                movePlayerDirectlyToLocation(player, 11);
                break;
            case 9:
                console.log("Make general repairs on all your property–For each house pay $25–For each hotel $100");
                break;
            case 10:
                player.cash -= 10;
                break;
            case 11:
                    if (player.currently_on == 8){
                        movePlayerDirectlyToLocation(player, 16);
                    }
                    if (player.currently_on == 23){
                        movePlayerDirectlyToLocation(player, 26);
                    }
                    if (player.currently_on == 37){
                        movePlayerDirectlyToLocation(player, 6);
                        player.cash += 200
                    }
                break;
            case 12:
                    movePlayerDirectlyToLocation(player, 38);
                break;
            case 13:
                //"You have been elected Chairman of the Board– Pay each player $50"
                player.cash -= 50;
                break;
            case 14:
                player.cash += 150;
                break;
            case 15:
                player.cash += 100;
               
        }

    }
    ///////////////// Community Chest ////////////////////
    const communityCard = (cards, player)=>{
        const new_card = getRandomInt(cards.length)
        // display instruction 
        const newP = document.createElement('p');
        newP.innerText = `${community_chest[new_card]}`;
        newP.style = 'color: white;';
        showMiddle.append(newP);
        showMiddle.className = '';

        // follow the instruction 
        switch (new_card){
            case 0:
                movePlayerDirectlyToLocation(player, 1);
                break;
            case 1: 
                player.cash += 200;
                break;
            case 2:
                player.cash -= 50;
                break;
            case 3:
                player.cash += 50;
                break;
            case 4:
                //get out of jail free
                console.log("get out of jail free");
                break;
            case 5:
                movePlayerDirectlyToLocation(player, 11);
            case 6:
                player.cash += 50;
                break;
                // deduct 50 from all player
                console.log("get 50 from all player");
                break;
            case 7:
                player.cash += 100;
                break;
            case 8:
                player.cash += 20;
                break;
            case 9:
                player.cash += 10;
                break;
            case 10:
                player.cash += 100;
                break;
            case 11:
                player.cash -= 100;
                break;
            case 12:
                player.cash -= 150;
                break;
            case 13:
                player.cash += 25;
                break;
            case 14:
                // You are assessed for street repairs–$40 per house–$115 per hotel
                break;
            case 15:
                player.cash += 10;
                break;
            case 16:
                player.cash += 100;
        }

    }
    ///////////////////////////////////

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


