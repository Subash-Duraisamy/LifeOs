import { PATH } from "./PathData";

import {

    RED_HOME_PATH,

    GREEN_HOME_PATH,

    YELLOW_HOME_PATH,

    BLUE_HOME_PATH,

} from "./PathData";
import { SAFE_CELLS } from "./SafeCells";






/* ==========================================
   IS BLOCK
========================================== */

export function isBlock(

    tokens,

    row,

    col,

    color

) {

    return (

        tokens.filter(

            token =>

                !token.home &&

                !token.finished &&

                token.color === color &&

                token.row === row &&

                token.col === col

        ).length >= 2

    );

}

/* ==========================================
   START INDEX
========================================== */

export function getStartIndex(color) {

    switch (color) {

        case "red":
            return 0;

        case "green":
            return 13;

        case "yellow":
            return 26;

        case "blue":
            return 39;

        default:
            return 0;

    }

}

/* ==========================================
   FIND PATH INDEX
========================================== */

export function getPathIndex(position) {

    return PATH.findIndex(

        cell =>

            cell.row === position.row &&

            cell.col === position.col

    );

}

/* ==========================================
   SAFE CELL
========================================== */

export function isSafeCell(token) {

    const index = getPathIndex({

        row: token.row,

        col: token.col,

    });

    return SAFE_CELLS.includes(index);

}
/* ==========================================
   GET PATH CELL
========================================== */

export function getPathCell(index) {

    const total = PATH.length;

    return PATH[

        ((index % total) + total) % total

    ];

}

/* ==========================================
   GET HOME CELL
========================================== */

export function getHomeCell(

    color,

    index

) {

    switch (color) {

        case "red":
            return RED_HOME_PATH[index];

        case "green":
            return GREEN_HOME_PATH[index];

        case "yellow":
            return YELLOW_HOME_PATH[index];

        case "blue":
            return BLUE_HOME_PATH[index];

        default:
            return RED_HOME_PATH[index];

    }

}

/* ==========================================
   CAN RELEASE TOKEN
========================================== */

export function canReleaseToken(

    token,

    diceValue

) {

    return (

        token.home &&

        diceValue === 6

    );

}

/* ==========================================
   RELEASE TOKEN
========================================== */

export function releaseToken(

    token,

    color

) {

    const startIndex =

        getStartIndex(color);

    const startCell =

        getPathCell(startIndex);

    return {

        ...token,

        home: false,

        finished: false,

        row: startCell.row,

        col: startCell.col,

        steps: 0,

    };

}

/* ==========================================
   CAN MOVE TOKEN
========================================== */

export function canMoveToken(

    token,

    diceValue

) {

    // Already Finished

    if (token.finished) {

        return false;

    }

    // Inside Home

    if (token.home) {

        return diceValue === 6;

    }

    // Cannot exceed finish

    if (

        token.steps + diceValue > 57

    ) {

        return false;

    }

    return true;

}

/* ==========================================
   MOVE TOKEN
========================================== */

export function moveToken(

    token,

    diceValue,

    color

) {

    // -----------------------
    // Release
    // -----------------------

    if (token.home) {

        return releaseToken(

            token,

            color

        );

    }

    // -----------------------
    // Calculate Steps
    // -----------------------

    const newSteps =

        token.steps + diceValue;

    // -----------------------
    // Finish
    // -----------------------

    if (newSteps === 57) {

        return {

            ...token,

            steps: 57,

            finished: true,

        };

    }

    // -----------------------
    // Main Path
    // -----------------------

   if (newSteps <= 51) {

        const cell =

            getPathCell(

                getStartIndex(color) +

                newSteps

            );

        return {

            ...token,

            row: cell.row,

            col: cell.col,

            steps: newSteps,

        };

    }

    // -----------------------
    // Home Path
    // -----------------------

    const homeIndex =

        newSteps - 52;

    const homeCell =

        getHomeCell(

            color,

            homeIndex

        );

    return {

        ...token,

        row: homeCell.row,

        col: homeCell.col,

        steps: newSteps,

    };

}

/* ==========================================
   TOKEN FINISHED
========================================== */

export function hasFinished(

    token

) {

    return token.finished === true;

}

/* ==========================================
   IS WINNER
========================================== */

export function isWinner(

    tokens

) {

    return tokens.every(

        token =>

            token.finished

    );

}

/* ==========================================
   RESET TOKEN TO HOME
========================================== */

export function sendTokenHome(token) {

    const homePositions = {

        red: [

            { row:1,col:1 },

            { row:1,col:4 },

            { row:4,col:1 },

            { row:4,col:4 },

        ],

        green: [

            { row:1,col:10 },

            { row:1,col:13 },

            { row:4,col:10 },

            { row:4,col:13 },

        ],

        yellow: [

            { row:10,col:10 },

            { row:10,col:13 },

            { row:13,col:10 },

            { row:13,col:13 },

        ],

        blue: [

            { row:10,col:1 },

            { row:10,col:4 },

            { row:13,col:1 },

            { row:13,col:4 },

        ],

    };

    const home = homePositions[token.color][token.index];

    return {

        ...token,

        home: true,

        finished: false,

        steps: 0,

        row: home.row,

        col: home.col,

    };

}