console.log('board setup');

const row = [0,1,2,3,4,5,6,7,8];
const theBoard = document.getElementById('the-board');

const middleBoard = document.createElement('div');
middleBoard.id = 'middle-board';
theBoard.append(middleBoard);

const middleShow = document.createElement('div');
middleShow.id = 'middle-show';
middleShow.className = 'hidden';
middleBoard.append(middleShow);

const endDiv = document.createElement('div');
endDiv.id = 'end-button-container';
middleBoard.append(endDiv);

const diceDiv = document.createElement('div');
diceDiv.id = 'dice-area';
middleBoard.append(diceDiv);

const rollsDisplay = document.createElement('div');
rollsDisplay.id = 'rolls-display';
rollsDisplay.style = 'padding-top: 5%;'
diceDiv.append(rollsDisplay);

const createBotVerticalCards = (j, array) => {
    row.forEach(i=>{
        const fromRight = 13.2 + 8.12*i;
        const botDiv = document.createElement('div');
        botDiv.className = 'vertical-card';
        botDiv.id = `${j+i+1}`;
        botDiv.style = `right: ${fromRight}%; bottom: 0%;`;
        theBoard.append(botDiv);
    
        botDiv.addEventListener('click', () => doSomething(array[j+i]));
    })
    return j+9;
}

const createTopVerticalCards = (j, array) => {
    row.forEach(i=>{
        const fromLeft = 13.4 + 8.13*i;
        const topDiv = document.createElement('div');
        topDiv.className = 'vertical-card';
        topDiv.id = `${j+i+1}`;
        topDiv.style = `left: ${fromLeft}%; top: 0%;`;
        theBoard.append(topDiv);
        topDiv.addEventListener('click', () => doSomething(array[j+i]));
    })
    return j+9;
}

const createLeftHorizontalCards = (j, array) => {
    row.forEach(i=>{
        const leftDiv = document.createElement('div');
        const fromBot = 13.2 + 8.18*i;
        leftDiv.className = 'horizontal-card';
        leftDiv.id = `${j+i+1}`;
        leftDiv.style = `bottom: ${fromBot}%; left: 0%`;
        theBoard.append(leftDiv);
        leftDiv.addEventListener('click', () => doSomething(array[j+i]));
    })
    return j+9;
}

const createRightHorizontalCards = (j, array) => {
    row.forEach(i=>{
        const rightDiv = document.createElement('div');
        const fromTop = 13.2 + 8.18*i;
        rightDiv.className = 'horizontal-card';
        rightDiv.id = `${j+i+1}`;
        rightDiv.style = `top: ${fromTop}%; right: 0%`;
        theBoard.append(rightDiv);
        rightDiv.addEventListener('click', () => doSomething(array[j+i]));
    })
    return j+9;
}


const doSomething = (card) => {
    console.log(card)
}


const createGoDiv = (j, array) => {
    const botRightSqr = document.createElement('div');
    botRightSqr.className = 'sqr-card';
    botRightSqr.id = `${j+1}`;
    botRightSqr.style = 'right: 0%; bottom: 0%';
    theBoard.append(botRightSqr);
    botRightSqr.addEventListener('click', () => doSomething(array[j]));
    return j+1;
}

const createJailDiv = (j, array) => {
    const botLeftSqr = document.createElement('div');
    botLeftSqr.className = 'sqr-card';
    botLeftSqr.id = `${j+1}`;
    botLeftSqr.style = 'bottom: 0%; left: 0%'
    theBoard.append(botLeftSqr);
    botLeftSqr.addEventListener('click', () => doSomething(array[j]));
    return j+1;
}

const createFreeParkingDiv = (j, array) => {
    const topLeftSqr = document.createElement('div');
    topLeftSqr.className = 'sqr-card';
    topLeftSqr.id = `${j+1}`;
    topLeftSqr.style = 'top: 0%; left: 0%'
    theBoard.append(topLeftSqr);
    topLeftSqr.addEventListener('click', () => doSomething(array[j]));
    return j+1;
}

const createGoToJailDiv = (j, array) => {
    const topRightSqr = document.createElement('div');
    topRightSqr.className = 'sqr-card';
    topRightSqr.id = `${j+1}`;
    topRightSqr.style = 'right: 0%; top: 0%;'
    theBoard.append(topRightSqr);
    topRightSqr.addEventListener('click', () => doSomething(array[j]));
    return j+1;
}

const createBoardDivs = (propertiesArray) => {
    let j = 0;
    j = createGoDiv(j, propertiesArray);
    j = createBotVerticalCards(j, propertiesArray);
    j = createJailDiv(j, propertiesArray);
    j = createLeftHorizontalCards(j, propertiesArray);
    j = createFreeParkingDiv(j, propertiesArray);
    j = createTopVerticalCards(j, propertiesArray);
    j = createGoToJailDiv(j, propertiesArray);
    j = createRightHorizontalCards(j, propertiesArray);
}









