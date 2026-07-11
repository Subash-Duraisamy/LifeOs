import "./LudoGrid.css";
import LudoToken from "./LudoToken";
import { LUDO_PATH } from "../ludo/data/ludoPath";

/* ==========================================
   HOME POSITIONS
========================================== */

const RED_HOME = [
    { row: 1, col: 3 },
    { row: 1, col: 4 },
    { row: 3, col: 3 },
    { row: 3, col: 4 },
];

const GREEN_HOME = [
    { row: 1, col: 10 },
    { row: 1, col: 11 },
    { row: 3, col: 10 },
    { row: 3, col: 11 },
];

const BLUE_HOME = [
    { row: 10, col: 3 },
    { row: 10, col: 4 },
    { row: 12, col: 3 },
    { row: 12, col: 4 },
];

const YELLOW_HOME = [
    { row: 10, col: 10 },
    { row: 10, col: 11 },
    { row: 12, col: 10 },
    { row: 12, col: 11 },
];
/* ==========================================
   CELL COLOR
========================================== */

function getCellClass(row, col) {

    if (row <= 5 && col <= 5)
        return "red-home";

    if (row <= 5 && col >= 9)
        return "green-home";

    if (row >= 9 && col <= 5)
        return "blue-home";

    if (row >= 9 && col >= 9)
        return "yellow-home";

    if (col === 7)
        return "path";

    if (row === 7)
        return "path";

    return "empty";
}

/* ==========================================
   COMPONENT
========================================== */

function LudoGrid({

    board,

    room,

    currentUid,

    onTokenClick,

})  {

    const cells = [];

    for (let row = 0; row < 15; row++) {

        for (let col = 0; col < 15; col++) {

            const tokens = [];

            /* ======================================
               RED TOKENS
            ====================================== */

            board?.red?.forEach((token, index) => {

                if (token.pos === -1) {

                    const home = RED_HOME[index];

                    if (
                        home.row === row &&
                        home.col === col
                    ) {

                        tokens.push(

<LudoToken
    key={`red-home-${token.id}`}
    color="red"
    token={token}
    colorName="red"
    room={room}
    currentUid={currentUid}
    onTokenClick={onTokenClick}
/>

                        );

                    }

                    return;
                }

                const cell = LUDO_PATH[token.pos];

                if (
                    cell &&
                    cell.row === row &&
                    cell.col === col
                ) {

                    tokens.push(

<LudoToken
    key={`red-${token.id}`}
    color="red"
    token={token}
    colorName="red"
    room={room}
    currentUid={currentUid}
    onTokenClick={onTokenClick}
/>

                    );

                }

            });

            /* ======================================
               GREEN TOKENS
            ====================================== */

            board?.green?.forEach((token, index) => {

                if (token.pos === -1) {

                    const home = GREEN_HOME[index];

                    if (
                        home.row === row &&
                        home.col === col
                    ) {

                        tokens.push(

<LudoToken
    key={`green-home-${token.id}`}
    color="green"
    token={token}
    colorName="green"
    room={room}
    currentUid={currentUid}
    onTokenClick={onTokenClick}
/>

                        );

                    }

                    return;
                }

                const cell = LUDO_PATH[token.pos];

                if (
                    cell &&
                    cell.row === row &&
                    cell.col === col
                ) {

                    tokens.push(

<LudoToken
    key={`green-${token.id}`}
    color="green"
    token={token}
    colorName="green"
    room={room}
    currentUid={currentUid}
    onTokenClick={onTokenClick}
/>

                    );

                }

            });

            /* ======================================
               BLUE TOKENS (Ready for later)
            ====================================== */

            board?.blue?.forEach((token, index) => {

                if (token.pos === -1) {

                    const home = BLUE_HOME[index];

                    if (
                        home.row === row &&
                        home.col === col
                    ) {

                        tokens.push(

<LudoToken
    key={`blue-home-${token.id}`}
    color="blue"
    token={token}
    colorName="blue"
    room={room}
    currentUid={currentUid}
    onTokenClick={onTokenClick}
/>

                        );

                    }

                    return;
                }

                const cell = LUDO_PATH[token.pos];

                if (
                    cell &&
                    cell.row === row &&
                    cell.col === col
                ) {

                    tokens.push(

                <LudoToken
    key={`blue-${token.id}`}
    color="blue"
    token={token}
    colorName="blue"
    room={room}
    currentUid={currentUid}
    onTokenClick={onTokenClick}
/>

                    );

                }

            });

            /* ======================================
               YELLOW TOKENS (Ready for later)
            ====================================== */

            board?.yellow?.forEach((token, index) => {

                if (token.pos === -1) {

                    const home = YELLOW_HOME[index];

                    if (
                        home.row === row &&
                        home.col === col
                    ) {

                        tokens.push(

                   <LudoToken
    key={`yellow-home-${token.id}`}
    color="yellow"
    token={token}
    colorName="yellow"
    room={room}
    currentUid={currentUid}
    onTokenClick={onTokenClick}
/>

                        );

                    }

                    return;
                }

                const cell = LUDO_PATH[token.pos];

                if (
                    cell &&
                    cell.row === row &&
                    cell.col === col
                ) {

                    tokens.push(

             <LudoToken
    key={`yellow-home-${token.id}`}
    color="yellow"
    token={token}
    colorName="yellow"
    room={room}
    currentUid={currentUid}
    onTokenClick={onTokenClick}
/>

                    );

                }

            });

            cells.push(

                <div
                    key={`${row}-${col}`}
                    className={`cell ${getCellClass(row, col)}`}
                >

                    {tokens}

                </div>

            );

        }

    }

    return (

        <div className="ludo-grid">

            {cells}

        </div>

    );

}

export default LudoGrid;