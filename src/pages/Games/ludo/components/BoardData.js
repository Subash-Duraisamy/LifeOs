export const BOARD_SIZE = 15;

/* ==========================================
   BOARD
========================================== */

/* ==========================================
   CREATE BOARD
========================================== */

export function createBoard() {

    const board = [];

    for (let row = 0; row < BOARD_SIZE; row++) {

        const cells = [];

        for (let col = 0; col < BOARD_SIZE; col++) {

            cells.push({

                row,

                col,

                type: getCellType(row, col),

                color: getCellColor(row, col),

            });

        }

        board.push(cells);

    }

    return board;

}
/* ==========================================
   CELL TYPE
========================================== */

/* ==========================================
   CELL TYPE
========================================== */

function getCellType(row,col){

    if(isCenter(row,col))
        return "center";

    if(isSafe(row,col))
        return "safe";

    if(isPath(row,col))
        return "path";

    return "empty";

}

/* ==========================================
   CELL COLOR
========================================== */

function getCellColor(row,col){

    // RED HOME

    if(row<=5 && col<=5)
        return "red";

    // GREEN HOME

    if(row<=5 && col>=9)
        return "green";

    // YELLOW HOME

    if(row>=9 && col>=9)
        return "yellow";

    // BLUE HOME

    if(row>=9 && col<=5)
        return "blue";

    return "";

}

/* ==========================================
   SAFE CELLS
========================================== */

export const SAFE_CELLS = [

    // Red

    { row: 6, col: 1 },

    // Green

    { row: 1, col: 8 },

    // Yellow

    { row: 8, col: 13 },

    // Blue

    { row: 13, col: 6 },

    // Middle Safe Cells

    { row: 2, col: 6 },

    { row: 6, col: 12 },

    { row: 12, col: 8 },

    { row: 8, col: 2 },

];

/* ==========================================
   CENTER
========================================== */

function isCenter(row,col){

    return row===7 && col===7;

}


/* ==========================================
   PATH
========================================== */

function isPath(row,col){

    if(col>=6 && col<=8)
        return true;

    if(row>=6 && row<=8)
        return true;

    return false;

}
/* ==========================================
   SAFE CELL
========================================== */

function isSafe(row,col){

    return SAFE_CELLS.some(

        cell=>

            cell.row===row &&

            cell.col===col

    );

}

/* ==========================================
   RED HOME TOKENS
========================================== */

export const RED_HOME = [

    { row: 1, col: 1 },

    { row: 1, col: 4 },

    { row: 4, col: 1 },

    { row: 4, col: 4 },

];

/* ==========================================
   GREEN HOME TOKENS
========================================== */

export const GREEN_HOME = [

    { row: 1, col: 10 },

    { row: 1, col: 13 },

    { row: 4, col: 10 },

    { row: 4, col: 13 },

];

/* ==========================================
   YELLOW HOME TOKENS
========================================== */

export const YELLOW_HOME = [

    { row: 10, col: 10 },

    { row: 10, col: 13 },

    { row: 13, col: 10 },

    { row: 13, col: 13 },

];

/* ==========================================
   BLUE HOME TOKENS
========================================== */

export const BLUE_HOME = [

    { row: 10, col: 1 },

    { row: 10, col: 4 },

    { row: 13, col: 1 },

    { row: 13, col: 4 },

];