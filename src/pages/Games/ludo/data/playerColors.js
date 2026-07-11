export function getPlayerColor(room, uid) {

    const index = room.playerIds.indexOf(uid);

    switch (index) {

        case 0:
            return "red";

        case 1:
            return "green";

        case 2:
            return "yellow";

        case 3:
            return "blue";

        default:
            return null;

    }

}