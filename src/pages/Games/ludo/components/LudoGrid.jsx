import "./LudoGrid.css";

import {

    createBoard,

} from "./BoardData";

import {

    releaseMyToken,

    moveMyToken,

} from "../../../../services/ludoService";

import LudoCell from "./LudoCell";
import LudoToken from "./LudoToken";

function LudoGrid({

    room,

    currentUser,

}) {

    const board = createBoard();

    async function handleTokenClick(

        uid,

        token

    ) {

        try {

            if (uid !== currentUser.uid) return;

            if (room.currentTurn !== currentUser.uid) return;

            if (token.home) {

                await releaseMyToken(

                    room.id,

                    currentUser.uid,

                    token.id

                );

            }

            else {

                await moveMyToken(

                    room.id,

                    currentUser.uid,

                    token.id

                );

            }

        }

        catch (error) {

            console.log(error);

            alert(error.message);

        }

    }

    return (

        <div className="ludo-grid-board">

            {

                board.map(row => (

                    <div

                        key={row[0].row}

                        className="board-row"

                    >

                        {

                            row.map(cell => (

                                <LudoCell

                                    key={`${cell.row}-${cell.col}`}

                                    cell={cell}

                                >

                                    {

                                        (() => {

                                            const tokensInCell = [];

                                            Object.entries(room.tokens).forEach(

                                                ([uid, tokens]) => {

                                                    tokens.forEach(token => {

                                                        if (

                                                            token.row === cell.row &&

                                                            token.col === cell.col

                                                        ) {

                                                           const player = room.players.find(
    p => p.uid === uid
);

// Player has left the room.
// Ignore orphan tokens.
if (!player) return;

tokensInCell.push({

    uid,

    token,

    player,

});

                                                        }

                                                    });

                                                }

                                            );

                                            return tokensInCell.map(

                                                (

                                                    {

                                                        uid,

                                                        token,

                                                        player,

                                                    },

                                                    index

                                                ) => (

               <LudoToken

    key={

        uid +

        "-" +

        token.id

    }

color={

    player?.color || token.color

}

    selected={

        room.currentTurn === uid

    }

    stackIndex={

        index

    }

    stackCount={

        tokensInCell.length

    }

    onClick={() =>

        handleTokenClick(

            uid,

            token

        )

    }

/>

                                                )

                                            );

                                        })()

                                    }

                                </LudoCell>

                            ))

                        }

                    </div>

                ))

            }

        </div>

    );

}

export default LudoGrid;