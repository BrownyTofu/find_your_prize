const prompt = require('prompt-sync')({sigint: true});


const prize = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const upKey = 'u';
const downKey = 'd';
const leftKey = 'l';
const rightKey = 'r';
const exitWord = 'exit';


//Since js array is by
function createNew2DArray(array){
    const newArray = [];
    array.forEach(firstDimension => {
        const insideArray = [];
        firstDimension.forEach(element => {
            insideArray.push(element);
        })
        newArray.push(insideArray);
    })
    return newArray;
}


class Field {
    constructor(array){
        this.field = array;
        this.initField = createNew2DArray(array);
        this.currentPosition = [0, 0]; //should be within [6, 5]
        this.oldPosition = [0, 0];
    }
    
    print() {
        let wholeField = '';
        this.field.forEach(row => {
            let rowField = '';
            row.forEach(element => {
                rowField += element;
            })
            wholeField += rowField + '\n'; 
        });
        console.log(wholeField);
    }
    move(userDecision) {
        //change the current posion base on the user's decision
        
        let rowIndex = this.currentPosition[0];
        let columnIndex = this.currentPosition[1];
        this.oldPosition[0] = rowIndex;
        this.oldPosition[1] = columnIndex;
        switch (userDecision) {
            case upKey :
                this.currentPosition = [rowIndex - 1, columnIndex];
                break;
            case downKey :
                this.currentPosition = [rowIndex + 1, columnIndex];
                break;
            case leftKey :
                this.currentPosition = [rowIndex, columnIndex - 1];
                break;
            case rightKey :
                this.currentPosition = [rowIndex, columnIndex + 1];
                break;
        }
        
    }
    checkStatus() {
        let rowIndex = this.currentPosition[0];
        let columnIndex = this.currentPosition[1];

        //Out of boundary
        if (rowIndex < 0 || columnIndex < 0 || rowIndex > 6 || columnIndex > 5){
            this.currentPosition = this.oldPosition;
            return 'Out of boundary!';
        }
        switch (this.field[rowIndex][columnIndex]){
            case hole: //Fall into the hole
                this.field = createNew2DArray(this.initField);
                this.currentPosition = [0, 0];
                return 'Oh no! You fell into the hole, please try again.';
            case pathCharacter: //Can't moved Back
                this.currentPosition = this.oldPosition.slice();
                return 'You can not hold back!';
            case prize: //Get the prize
                return 'Congrats! You get the prize.';
            case fieldCharacter: //Moved Success
                this.field[rowIndex][columnIndex] = pathCharacter;
                return '';
        }    
    }
}

const myField = new Field([
    ['*', 'O', 'O', '░', '░', '░'],
    ['░', 'O', '^', '░', 'O', '░'],
    ['░', 'O', 'O', 'O', 'O', '░'],
    ['░', '░', 'O', 'O', 'O', '░'],
    ['O', '░', 'O', 'O', '░', '░'],
    ['O', '░', 'O', '░', '░', 'O'],
    ['░', '░', '░', '░', 'O', 'O'],
  ]);



let userDecision;
let gameOngoing = true;
let playerStatus = 'Start The Game';

 while (gameOngoing) {
    console.clear();
    console.log(`Welcome to the maze. Please make your move by the keyboard(${upKey}, ${downKey}, ${leftKey}, ${rightKey} + Enter) to get the prize("${prize}").`);
    console.log(`To exit the game, key in "${exitWord}" + Enter.`);
    myField.print();
    console.log(playerStatus);
    userDecision = prompt(`Please key in your move(${upKey}, ${downKey}, ${leftKey}, ${rightKey}):`).toLowerCase();
    if (userDecision === upKey || userDecision === downKey || userDecision === leftKey || userDecision === rightKey ) {
        myField.move(userDecision)
        playerStatus = myField.checkStatus();
    } else if (userDecision === 'exit') {
        console.clear();
        playerStatus = 'Bye, see you next time! ';
        break;
    } else {
        playerStatus = `Error! Please key the right commands.(${upKey}, ${downKey}, ${leftKey}, ${rightKey})`;
    }

    //End the game if the game not ongoing
    gameOngoing = (playerStatus === 'Congrats! You get the prize.')? false : true;
 }
 //Print the win or exit message
console.log('\n\n\n' + playerStatus);
