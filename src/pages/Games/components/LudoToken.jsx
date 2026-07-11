import "./LudoToken.css";

function LudoToken({

    color,

    token,

    colorName,

    room,

    currentUid,

    onTokenClick,

    disabled,

}) {

    /* ===========================
       SAFETY
    =========================== */

    if (!room || !token) {

        return null;

    }

    /* ===========================
       IS MY TURN
    =========================== */

    const myTurn =

        room.playerIds?.[
            room.currentPlayer ?? 0
        ] === currentUid;


        const canRelease =
    !disabled &&
    myTurn &&
    room.diceValue === 6 &&
    token.pos === -1;

const canMove =
    !disabled &&
    myTurn &&
    token.pos >= 0 &&
    room.diceValue > 0;

    const clickable =
    canRelease || canMove;
    /* ===========================
       CAN RELEASE TOKEN
    =========================== */



    /* ===========================
       CLICK
    =========================== */

function handleClick() {

    if (!clickable) return;

    onTokenClick(
        colorName,
        token.id,
        token
    );

}

    /* ===========================
       UI
    =========================== */

    return (

        <div

       className={`token ${color} ${clickable ? "clickable" : ""}`}

            onClick={handleClick}

        />

    );

}

export default LudoToken;