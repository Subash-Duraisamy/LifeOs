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

            if (

                uid !== currentUser.uid

            ) {

                return;

            }

            if (

                room.currentTurn !==

                currentUser.uid

            ) {

                return;

            }

if (

    token.home

) {

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

                                        Object.entries(

                                            room.tokens

                                        ).map(

                                            ([uid, tokens]) =>

                                                tokens.map(

                                                    token => {

                                                        if (

                                                            token.row !== cell.row ||

                                                            token.col !== cell.col

                                                        ) {

                                                            return null;

                                                        }

                                                        const player =

                                                            room.players.find(

                                                                item =>

                                                                    item.uid === uid

                                                            );

                                                        return (

                                                            <LudoToken

                                                                key={

                                                                    uid +

                                                                    "-" +

                                                                    token.id

                                                                }

                                                                color={

                                                                    player.color

                                                                }

                                                                selected={

                                                                    room.currentTurn === uid

                                                                }

                                                                onClick={() =>

                                                                    handleTokenClick(

                                                                        uid,

                                                                        token

                                                                    )

                                                                }

                                                            />

                                                        );

                                                    }

                                                )

                                        )

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