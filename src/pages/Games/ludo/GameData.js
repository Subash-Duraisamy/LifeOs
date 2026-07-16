/* ==========================================
   COLORS
========================================== */

export const PLAYER_COLORS = [

    "red",

    "green",

    "yellow",

    "blue",

];

/* ==========================================
   INITIAL TOKENS
========================================== */

export function createTokens() {

    return {

        red: [

            createToken(0),

            createToken(1),

            createToken(2),

            createToken(3),

        ],

        green: [

            createToken(0),

            createToken(1),

            createToken(2),

            createToken(3),

        ],

        yellow: [

            createToken(0),

            createToken(1),

            createToken(2),

            createToken(3),

        ],

        blue: [

            createToken(0),

            createToken(1),

            createToken(2),

            createToken(3),

        ],

    };

}

/* ==========================================
   TOKEN
========================================== */

function createToken(id){

    return{

        id,

        position:-1,

        finished:false,

    };

}