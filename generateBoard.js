// A helper function to randomly shuffle an array! Expected output: A shuffled version of the array
function shuffleArray(array) {
    let outputArray = [];
    while (array.length > 0) {
        let randomIndex = Math.floor(Math.random() * array.length);
        outputArray.push(array[randomIndex]);
        array.splice(randomIndex, 1);
    }
    return outputArray;
}

// A simple helper function to turn x & y cords into an index number. Expected output: An index value from 0 - 80.
function cordsToIndex(x, y) {
    return (x + y * 9);
}

// Another helper function to return a string with a character changed at an index. Expected output: The string with the character at the index.
function changeCharAtIndex(string, index, character) {
    return string.substr(0, index) + character + string.substr(index + 1);
}

// this code is just taken from online. after so long of trying i just gave up.
// Of course with modifications to make the function work with a string instead of a 2d array and to return a solved board. A lot of modifications.
// Expected output: One solution to the solved board. If there are multiple solutions, both functions will return different ones. If there are none, returns "No solution! :("
function solver(board) {
    for(let index = 0; index < 81; index++){

        //Need to replace the cell with value if the cell is empty.
        if(board.charAt(index) == "0"){
            for(let digit = 1; digit < 10; digit++){

                //Checks with every possible value.
                if(validateDigit(board, index, digit.toString())){
                    board = changeCharAtIndex(board, index, digit);
                    test = solver(board);
                    if(test != "No solution! :("){
                        return test;
                    }
                    board = changeCharAtIndex(board, index, "0");
                }
            }
            return "No solution! :(";
        }

    }
    return board;
}
function altSolver(board) {
    for(let index = 0; index < 81; index++){
        //Need to replace the cell with value if the cell is empty.
        if(board.charAt(index) == "0"){
            for(let digit = 9; digit >= 1; digit--){
                //Checks with every possible value.
                if(validateDigit(board, index, digit.toString())){
                    board = changeCharAtIndex(board, index, digit);
                    test = altSolver(board);
                    if(test != "No solution! :("){
                        return test;
                    }
                    board = changeCharAtIndex(board, index, "0");
                }
            }
            return "No solution! :(";
        }

    }
    return board;
}

// This function will validate if a number can be placed in a cell. Expected output: A boolean value
function validateDigit(board, index, digit) {
    let x = index % 9;
    let y = Math.floor(index / 9)

    for (let index = 0; index < 9; index++) {
        if (board.charAt(cordsToIndex(x, index)) == digit || board.charAt(cordsToIndex(index, y)) == digit) {
            return false;
        }
    }

    let xSection = Math.floor(x / 3);
    let ySection = Math.floor(y / 3);
    for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
            if (board.charAt(cordsToIndex(columnIndex + (xSection * 3), rowIndex + (ySection * 3))) == digit) {
                return false;
            }
        }
    }
    
    return true;
}

// LET'S GO IT ACTUALLY MAKES SOLVABLE BOARDS I NEVER WANT TO LOOK AT THIS CODE AGAIN this took so long
// Expected output: A sudoku puzzle with 1 solution with 0 to represent empty spots, & about 25 (usually 20 - 30) filled in spots.
function generateBoard() {
    // Generate a random sudoku board! The actual algorithm is taken from https://stackoverflow.com/questions/6924216/how-to-generate-sudoku-boards-with-unique-solutions in bits & pieces
    // Hey, if you are reading this code, pls tell me if I could make this algorithm better!

    // This is the initial board. This could also be used on it's own as an initial board, but we're gonna shuffle it while following the sudoku rules!
    let initialBoard = "123456789456789123789123456231564897564897231897231564312645978645978312978312645";
    // hm this isn't good enough (every 1x3 row/column with the same digits has... the same digits) lemme try to randomly make the initial board.
    initialBoard = "000000000000000000000000000000000000000000000000000000000000000000000000123456789"
    
    for (let index = 0; index < 72; index++) {
        let digitOrder = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9])

        for (let digitIndex = 0; digitIndex < 9; digitIndex++) {
            if (initialBoard.charAt(index) == "0") {
                if (validateDigit(initialBoard, index, digitOrder[digitIndex])) {
                    initialBoard = changeCharAtIndex(initialBoard, index, digitOrder[digitIndex]);
                    if (solver(initialBoard) == "No solution! :(") {
                        initialBoard = changeCharAtIndex(initialBoard, index, "0");
                    }
                }
            }
        }
    }

    
    // Create a row, column, & digit order to shuffle
    let temporaryArray = shuffleArray([shuffleArray([0, 1, 2]), shuffleArray([3, 4, 5]), shuffleArray([6, 7, 8])]);
    let rowOrder = temporaryArray[0].concat(temporaryArray[1].concat(temporaryArray[2]));
    temporaryArray = shuffleArray([shuffleArray([0, 1, 2]), shuffleArray([3, 4, 5]), shuffleArray([6, 7, 8])]);
    let columnOrder = temporaryArray[0].concat(temporaryArray[1].concat(temporaryArray[2]));
    digitOrder = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    
    // Now to assemble the board!
    let outputBoard = "";
    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
        for (let columnIndex = 0; columnIndex < 9; columnIndex++) {
            outputBoard = outputBoard.concat(digitOrder[Number(initialBoard.charAt(cordsToIndex(columnOrder[columnIndex], rowOrder[rowIndex]))) - 1]);
        }
    }
    
    
    // Now time to randomly start popping numbers out! Right now we're gonna make an array of the order of positions we'll remove.
    let removeNumberList = [];
    for (let index = 0; index < 81; index++) {
        removeNumberList.push(index);
    }
    removeNumberList = shuffleArray(removeNumberList);

    // Start to remove the positions, & if the board has multiple solutions, undo the removing.
    let solutionBoard = outputBoard;
    
    for (let index = 0; index < 81; index++) {
        outputBoard = changeCharAtIndex(outputBoard, removeNumberList[index], "0");

        // The solver and alt solver try to find solutions from opposite directions kinda, so if they return the same solution, it's the only solution.
        if (solver(outputBoard) != altSolver(outputBoard)) {
            //console.log(altSolver(outputBoard))
            outputBoard = changeCharAtIndex(outputBoard, removeNumberList[index], solutionBoard.charAt(removeNumberList[index]));
        }
    }

    return outputBoard;
}
let generatingBoard = false;
setInterval(test, 1000)

function test() {
    if (!generatingBoard && localStorage.getItem("boardCache").length < 211) {
        // originally this was gonna be done with promises but they're confusing and idk how to work with them yet.
        generatingBoard = true;
        localStorage.setItem("boardCache", localStorage.getItem("boardCache") + generateBoard());
        generatingBoard = false;
        
    }
}