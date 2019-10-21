console.log('index');

document.addEventListener('DOMContentLoaded', () => {
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////CONSTANTS///////////////////////////////////
    console.log('Dom content loaded');
    const player1 = {id: 2, name: 'Abdullah', cash: 1500, piece: 'https://www.emoji.co.uk/files/apple-emojis/symbols-ios/956-large-red-circle.png', currently_on: 1}
    const diceDisplay = document.getElementById('rolls-display');
    const theRollButton = document.getElementById('roll-button');
    const propertyShow = document.getElementById('show-property');

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
                //player has passed go (I think)
                player.cash += 200;
                patchPlayer(player)
                    .then(json => {
                        console.log(json);
                        updatePlayerProfile(json);
                    })
            }
        }
        
        const placePlayerOnBoard = (player) => {
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
                console.log('Do Non-Property action');
                if (property.id == 1){

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
        const set = document.createElement('h2');
        set.innerText = property.set + ' Colour Set'
        const price = document.createElement('h2');
        price.innerText = `Price: ${property.price}M`;
        const rent = document.createElement('p');
        rent.innerText = `Rent: ${property.rent}`;
        const mortgage = document.createElement('p');
        mortgage.innerText = `Mortgage: ${property.mortgage_val}`;

        propertyShow.append(name,set,price,rent,mortgage);
        
    }

    const updatePlayerProfile = (player) => {
        console.log('will implement profile and update');
    }
    //////////////////////////////////////////////////////////////////////////////
    getProperties()
        .then(createBoardDivs)
        .then(playGame)
    
})


