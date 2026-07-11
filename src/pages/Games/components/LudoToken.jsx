import "./LudoToken.css";

function LudoToken({

    color,

    token,

    colorName,

    room,

    currentUid,

    onTokenClick,

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

    /* ===========================
       CAN RELEASE TOKEN
    =========================== */

    const canRelease =

        myTurn &&
        room.diceValue === 6 &&
        token.pos === -1;

    /* ===========================
       CLICK
    =========================== */

    function handleClick() {

        if (!canRelease) return;

        if (onTokenClick) {

           onTokenClick(

    colorName,

    token.id,

    token

);

        }

    }

    /* ===========================
       UI
    =========================== */

    return (

        <div

            className={`token ${color} ${canRelease ? "clickable" : ""}`}

            onClick={handleClick}

        />

    );

}

export default LudoToken;