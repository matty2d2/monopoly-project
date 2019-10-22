console.log('index');

document.addEventListener('DOMContentLoaded', () => {
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////CONSTANTS///////////////////////////////////
    console.log('Dom content loaded');
    const player1 = {id: 2, name: 'Abdullah', cash: 1500, piece: 'https://www.emoji.co.uk/files/apple-emojis/symbols-ios/956-large-red-circle.png', currently_on: 1}
    const diceDisplay = document.getElementById('rolls-display');
    const theRollButton = document.getElementById('roll-button');
    const propertyShow = document.getElementById('show-property');
    const playerShow = document.getElementById('show-player');

    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    const playGame = () => {

        theRollButton.addEventListener('click', () => movePlayer(player1));

        const rollDice = () => {
            const die1 = getRandomInt(6);
            const die2 = getRandomInt(6);
            const newP = document.createElement('p');
            newP.style = 'padding-top: 5%;'
            newP.innerText = `Rolled: ${die1} , ${die2}`;
            removeChildren(diceDisplay);
            diceDisplay.append(newP);
            return die1 + die2;
        }

        const updatePositionFromRoll = (player) => {
            const total = rollDice();
            const oldPos = player.currently_on
            let newPos = (total + oldPos) % 40;
            if (newPos == 0){newPos = 40;}
            player.currently_on  = newPos;

            if (newPos < oldPos){
                //player has passed go
                player.cash += 200;
                patchPlayer(player)
                .then(displayPlayer(player))
                }
                
        }
        
        const placePlayerOnBoard = (player) => {
            getPlayer(player).then(displayPlayer(player))
            const tile = document.getElementById(`${player.currently_on}`);
            createPlayerImg(player, tile);

            getProperty(tile.id)
                .then(playerAction)
        }
        
        const movePlayer = (player) => {
            removePlayerFromPreviousLocation(player)
            updatePositionFromRoll(player);
            placePlayerOnBoard(player);
        }
        
        const playerAction = (property) => {
            if (nonProperty(property)){
                if ([3,18,34].includes(property.id)){
                    console.log('Pick up a Community Chest card');
                }else if ([8,23,37].includes(property.id)){
                    console.log('Pick up a Chance card');
                }else if ([5,39].includes(property.id)){
                    console.log('tax must be paid')
                }else if (property.id == 21){
                    console.log('collect cash from the middle')
                }else if (property.id == 31){
                    console.log('go to jail')
                }
            }else{
                if (property.player.id == 1){
                    console.log(`Would you like to buy ${property.name}?`);
                    displayProperty(property);
                } else {
                    console.log(`You must pay ${property.owner.name} £${property.rent}M.`);
                }
            }
        }
        
        const placePlayerOnGo = (player) => {
            getPlayer(player).then(displayPlayer(player))
            const tile = document.getElementById(`${player.currently_on}`);
            createPlayerImg(player, tile);
        }

        placePlayerOnGo(player1);
    }
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    const createPlayerImg = (player, tile) =>{
        const newImg = document.createElement('img');
            newImg.id = `player-${player.id}`
            newImg.src = player.piece;
            newImg.style = 'position: absolute; max-width: 20%; left: 50%; top: 50%;'
            tile.append(newImg);
    }

    const removeChildren = (parent) => {
        while (parent.hasChildNodes()){
            parent.removeChild(parent.firstChild);
        }
    }

    const getRandomInt = max => {
        return 1 + Math.floor(Math.random() * Math.floor(max));
    }

    const removePlayerFromPreviousLocation = (player) => {
        const oldTile = document.getElementById(`${player.currently_on}`);
        const to_remove = document.getElementById(`player-${player.id}`);
        oldTile.removeChild(to_remove);
    }
    
    const nonProperty = (property) => {
        const nonPropertyArray = [1,3,5,8,11,18,21,23,31,34,37,39];
        const check = nonPropertyArray.includes(property.id);
        return check;
    } 


    const displayProperty = (property) => {
        removeChildren(propertyShow);
      
        const name = document.createElement('h1');
        name.innerText = property.name;
      
        const image = document.createElement('img');
        image.src = property.url;
        image.style = 'max-height: 15%;'
      
        const set = document.createElement('h2');
        set.innerText = property.set + ' Colour Set'
      
        const price = document.createElement('h2');
        price.innerText = `Price: ${property.price}M`;
      
        const rent = document.createElement('p');
        rent.innerText = `Rent: ${property.rent}M`;
      
        const mortgage = document.createElement('p');
        mortgage.innerText = `Mortgage: ${property.mortgage_val}M`;
      
        propertyShow.append(name,image,set,price,rent,mortgage);
    }

    const displayPlayer = player =>{
        removeChildren(playerShow)
        const name = document.createElement('h1')
        const cash = document.createElement('h2')
        const ul = document.createElement('ul')
        
        name.innerText = player.name
        cash.innerText = player.cash + 'M'
        // let properties;
        if (player.properties){
            
            player.properties.forEach(property =>{
                const propertyLi = document.createElement('li')
                propertyLi.innerText = property
                ul.append(name,cash, propertyLi)
            })    
        }else {
            ul.append(name,cash)
        }

        playerShow.append(ul)

    }
    const updatePlayerProfile = (player) => {
        console.log('will implement profile and update');
    }
    //////////////////////////////////////////////////////////////////////////////
    getProperties()
        .then(createBoardDivs)
        .then(playGame)

    // getPlayer(player1).then(displayPlayer(player1))
    
})


