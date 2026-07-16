/* ==========================================
   INITIAL TOKENS
========================================== */

export function createInitialTokens(players) {

    const tokens = {};

    players.forEach(player => {

        tokens[player.uid] = [

            createToken(player.color, 0),

            createToken(player.color, 1),

            createToken(player.color, 2),

            createToken(player.color, 3),

        ];

    });

    return tokens;

}

/* ==========================================
   CREATE TOKEN
========================================== */

function createToken(color, index) {

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

    const home = homePositions[color][index];

    return {

        id:`${color}-${index}`,

        color,

        index,

        home:true,

        finished:false,

        steps:0,

        row:home.row,

        col:home.col,

    };

}