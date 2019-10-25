console.log('index.js');

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dom content loaded');
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////CONSTANTS///////////////////////////////////
    const community_chest = ["Advance to Go (Collect $200)","Bank error in your favor—Collect $200","Doctor's fee—Pay $50","From sale of stock you get $50","Get Out of Jail Free","Go to Jail–Go directly to jail–Do not pass Go–Do not collect $200","Grand Opera Night—Collect $50 from every player for opening night seats","Holiday Fund matures—Receive $100","Income tax refund–Collect $20","It is your birthday—Collect $10","Life insurance matures–Collect $100","Pay hospital fees of $100","Pay school fees of $150","Receive $25 consultancy fee","You are assessed for street repairs–$40 per house–$115 per hotel","You have won second prize in a beauty contest–Collect $10","You inherit $100"]
    const chance = ["Advance to Go (Collect $200)","Advance to Illinois Ave—If you pass Go, collect $200","Advance to St. Pall Mall – If you pass Go, collect $200","Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown.","Advance token to the nearest Railroad and pay owner twice the rental to which he/she {he} is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.","Bank pays you dividend of $50","Get Out of Jail Free","Go Back 3 Spaces","Go to Jail–Go directly to Jail–Do not pass Go, do not collect $200","Make general repairs on all your property–For each house pay $25–For each hotel $100","Pay poor tax of $15","Take a trip to Reading Railroad–If you pass Go, collect $200","Take a walk on the Park Lane–Advance token to Park Lane","You have been elected Chairman of the Board–Pay each player $50","Your building and loan matures—Collect $150","You have won a crossword competition—Collect $100"]

    const redCirlceUrl = 'https://www.emoji.co.uk/files/apple-emojis/symbols-ios/956-large-red-circle.png';
    const blueCircleUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Circle-blue.svg/512px-Circle-blue.svg.png';
    const greenCircleUrl = 'https://www.pinclipart.com/picdir/middle/157-1571732_button-clipart-green-circle-green-button-icon-png.png';
    const pinkCircleUrl = 'https://www.pngfind.com/pngs/m/3-37199_vector-circle-design-png-pink-circle-with-design.png';
    ///////////////////////////////DOM CONSTANTS/////////////////////////////////
    const diceDisplay = document.getElementById('rolls-display');
    const propertyShow = document.getElementById('show-property');
    const playerShow = document.getElementById('show-player');
    const showMiddle = document.getElementById('middle-show');
    const endButtonContainer = document.getElementById('end-button-container');
    const createForm = document.getElementById('create-player-form');
    const theBoard = document.getElementById('the-board');

    const nonPropertyArray = [1,3,5,8,11,18,21,23,31,34,37,39];
    /////////////////////////////////////////////////////////////////////////////
    const playGame = (playerArray) => {
        makeQuitGameButton();
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
    const makeQuitGameButton = () => {
        const quitGameDiv = document.getElementById('quit-game');
        const quitButton = document.createElement('button');
        quitButton.innerText = 'Quit Game';
        quitButton.addEventListener('click', quitGame)
        quitGameDiv.append(quitButton);
    }
    /////////////////////////////////////////////////////////////////////////////
    const quitGame = (e) => {
        e.target.remove();
        getPlayers()
            .then(json => {
                const playerArray = json;
                while (playerArray.length>1){
                    removePlayerFromBoard(playerArray.pop());
                }
                resetGame();
                removeChildren(diceDisplay);
                removeChildren(endButtonContainer);
                removeChildren(showMiddle);
                showMiddle.className = 'hidden';
                createForm.className = '';
            })
    }
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
        newP.style = 'padding-top: 20%;'
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
                communityCard(community_chest, player)
                checkForExtraTurn(player, array, extraTurn);
            }else if ([8,23,37].includes(property.id)){
                console.log('Pick up a Chance card');
                chanceCard(chance, player)
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
    ///////////////// Chance ////////////////////
    const chanceCard = (cards, player)=>{
        const new_card = getRandomInt(cards.length);
        // display instruction 
        const newP = document.createElement('p');
        newP.innerText = `${chance[new_card]}`;
        newP.style = 'color: white;';
        showMiddle.append(newP);
        showMiddle.className = '';
    
        const utilities = [6,13,16,26,29,36]
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
                player.cash -= 15;
                break;
            case 11:
                if (player.currently_on == 8){
                    movePlayerDirectlyToLocation(player, 16);
                }else if (player.currently_on == 23){
                    movePlayerDirectlyToLocation(player, 26);
                }else if (player.currently_on == 37){
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
                break;
        }
    
    }
    ///////////////// Community Chest ////////////////////
    const communityCard = (cards, player)=>{
        const new_card = getRandomInt(cards.length);
        // display instruction 
        const newP = document.createElement('p');
        newP.innerText = `${community_chest[new_card]}`;
        newP.style = 'color: white;';
        showMiddle.append(newP);
        showMiddle.className = '';
    
        // follow the instruction 
        switch (new_card - 1){
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
    const  startGame = () => {
        getPlayers()
            .then(json=>{
                if (json.length==1){
                    createForm.className = '';
                }else{
                    removeDivCards();
                    createForm.className = 'hidden';
                    getProperties()
                        .then(createBoardDivs)
                        .then(makePlayersArray)
                }
            })
        
    }
    //////////REMOVE DIV CARDS FROM BOARD (SO NOT TO DUPLICATE)//////////////////////////////
    const removeDivCards = () => {
        const horizontalDivs = [...document.getElementsByClassName('horizontal-card')];
        const verticalDivs = [...document.getElementsByClassName('vertical-card')];
        const sqrDivs = [...document.getElementsByClassName('sqr-card')];

        if (horizontalDivs.length > 0){
            horizontalDivs.forEach(div=>div.remove());
            verticalDivs.forEach(div=>div.remove());
            sqrDivs.forEach(div=>div.remove());
        }
    }

    //////////// THE FORM IS BELOW//////////////
    const createPlayersAndStartGame = (e) => {
        e.preventDefault();

        const players = {
            player1: { name: e.target.name1.value, piece: redCirlceUrl},
            player2: { name: e.target.name2.value, piece: blueCircleUrl},
            player3: { name: e.target.name3.value, piece: greenCircleUrl},
            player4: { name: e.target.name4.value, piece: pinkCircleUrl},
        }
        e.target.reset();
        // const piece = "./src/images/pic1.jpeg";
        postPlayers(players)
            .then(()=>startGame())
    }
    /////////////////////////
    createForm.addEventListener('submit', createPlayersAndStartGame);


    ////////RUN THE GAME///////
    startGame();

})







