console.log('index');

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dom content loaded');

    const playGame = () => {
        const player1 = {id: 19, name: 'Abdullah', cash: 1500, piece: 'https://www.emoji.co.uk/files/apple-emojis/symbols-ios/956-large-red-circle.png', currently_on: 1}

        const diceDisplay = document.getElementById('rolls-display');
        const theRollButton = document.getElementById('roll-button');

        const getRandomInt = max => {
            return 1 + Math.floor(Math.random() * Math.floor(max));
        }

        const removeChildren = (parent) => {
            while (parent.hasChildNodes()){
                parent.removeChild(parent.firstChild);
            }
        }

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

        theRollButton.addEventListener('click', () => movePlayer(player1));
        
        const placePlayerOnBoard = (player) => {
            const tile = document.getElementById(`${player.currently_on}`);
            getProperty(tile.id)
                .then(playerAction)
            const newImg = document.createElement('img');
            newImg.id = `player-${player.id}`
            newImg.src = player.piece;
            newImg.style = 'position: absolute; max-width: 20%; left: 50%; top: 50%;'
        
            tile.append(newImg);
        }
        
        const movePlayer = (player) => {
            const oldTile = document.getElementById(`${player.currently_on}`);
            removePlayerFromPreviousLocation(player, oldTile);
        
            const total = rollDice();
            const newPos = total + player.currently_on;
            player.currently_on  = newPos % 40;
            placePlayerOnBoard(player);
            
        }
        
        const removePlayerFromPreviousLocation = (player, tile) => {
            const to_remove = document.getElementById(`player-${player.id}`);
            tile.removeChild(to_remove);
        }

        const playerAction = (property) => {
            propertyCheck(property);
        }

        const propertyCheck = (property) => {
            if (property.player.id == 1){
                console.log(`Would you like to buy ${property.name}`)
            } else {
                console.log(`You must pay ${property.owner.name} £${property.rent}M.`)
            }
        }
        
        placePlayerOnBoard(player1);
    }
    
    getProperties()
        .then(createBoardDivs)
        .then(playGame)
    
})


