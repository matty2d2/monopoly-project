console.log('index');

document.addEventListener('DOMContentLoaded', () => {
    const diceDisplay = document.getElementById('rolls-display');
    const rollButton = document.getElementById('roll-button');

    const getRandomInt = max => {
        return 1 + Math.floor(Math.random() * Math.floor(max));
    }

    const removeChildren = (parent) => {
        while (parent.hasChildNodes()){
            parent.removeChild(parent.firstChild);
        }
    }

    const startingOrder = () => {
        const die1 = getRandomInt(6);
        const die2 = getRandomInt(6);
        const newH1 = document.createElement('h1');
        newH1.innerText = `You rolled: ${die1} , ${die2}`;
        removeChildren(diceDisplay);
        diceDisplay.append(newH1);
    }

    rollButton.addEventListener('click', startingOrder);
    
})


