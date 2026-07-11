import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    onSnapshot,
    updateDoc,
    doc,
    setDoc,
    getDoc,
    getDocs,
    limit,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { START_POSITION } from "../pages/Games/ludo/data/ludoStartPositions";


/* ==========================================
   SEND GAME INVITE
========================================== */

export async function sendGameInvite({

    game,

    roomId,

    fromUser,

    toUser,

}) {

    try {

        await addDoc(

            collection(db, "gameInvites"),

            {

                game,

                roomId,

                fromUid: fromUser.uid,

                fromName: fromUser.fullName,

                fromUsername: fromUser.username,

                fromPhoto: fromUser.photoURL || "",

                toUid: toUser.uid,

                toName: toUser.fullName,

                toUsername: toUser.username,

                toPhoto: toUser.photoURL || "",

                status: "pending",

                createdAt: serverTimestamp(),

            }

        );

    }

    catch (error) {

        console.log(error);

        throw error;

    }

}

/* ==========================================
   GENERATE ROOM ID
========================================== */

export function generateRoomId() {

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let room = "LUDO-";

    for (let i = 0; i < 6; i++) {

        room += chars.charAt(

            Math.floor(

                Math.random() * chars.length

            )

        );

    }

    return room;

}

/* ==========================================
   LISTEN FOR MY GAME INVITES
========================================== */

export function listenGameInvites(

    uid,

    callback

) {

    const q = query(

        collection(db, "gameInvites"),

        where("toUid", "==", uid),

        where("status", "==", "pending")

    );

    return onSnapshot(

        q,

        (snapshot) => {

            const invites = snapshot.docs.map(doc => ({

                id: doc.id,

                ...doc.data(),

            }));

            callback(invites);

        },

        (error) => {

            console.log(error);

        }

    );

}


/* ==========================================
   ACCEPT GAME INVITE
========================================== */

export async function acceptGameInvite(invite) {

    try {

        // Update invitation

        await updateDoc(

            doc(db, "gameInvites", invite.id),

            {

                status: "accepted",

            }

        );

        // Create Game Room

        await setDoc(

            doc(db, "gameRooms", invite.roomId),

            {

                roomId: invite.roomId,

                game: invite.game,

                hostUid: invite.fromUid,
playerIds: [

    invite.fromUid,

    invite.toUid,

],

players: [

    {

        uid: invite.fromUid,

        name: invite.fromName,

        username: invite.fromUsername,

        photo: invite.fromPhoto || "",

    },

    {

        uid: invite.toUid,

        name: invite.toName,

        username: invite.toUsername,

        photo: invite.toPhoto || "",

    },

],

                turn: invite.fromUid,

                status: "waiting",

readyPlayers: [],

                winner: null,

                createdAt: serverTimestamp(),

            }

        );

    }

    catch (error) {

        console.log(error);

        throw error;

    }

}

/* ==========================================
   DECLINE GAME INVITE
========================================== */

export async function declineGameInvite(

    inviteId

) {

    try {

        await updateDoc(

            doc(db, "gameInvites", inviteId),

            {

                status: "declined",

            }

        );

    }

    catch (error) {

        console.log(error);

        throw error;

    }

}
/* ==========================================
   LISTEN GAME ROOM
========================================== */

export function listenGameRoom(

    roomId,

    callback

) {

    return onSnapshot(

        doc(db, "gameRooms", roomId),

        (snapshot) => {

            if (!snapshot.exists()) return;

            callback({

                id: snapshot.id,

                ...snapshot.data(),

            });

        }

    );

}
/* ==========================================
   READY PLAYER
========================================== */

export async function readyPlayer(

    roomId,

    uid

) {

    const roomRef = doc(

        db,

        "gameRooms",

        roomId

    );

    const snapshot = await getDoc(roomRef);

    if (!snapshot.exists()) return;

    const room = snapshot.data();

    const ready = room.readyPlayers || [];

    if (!ready.includes(uid)) {

        ready.push(uid);

    }

    await updateDoc(

        roomRef,

        {

            readyPlayers: ready,

        }

    );

}

/* ==========================================
   LISTEN MY SENT INVITES
========================================== */

export function listenMySentInvites(uid, callback) {

    const q = query(

        collection(db, "gameInvites"),

        where("fromUid", "==", uid)

    );

    return onSnapshot(q, (snapshot) => {

        const invites = snapshot.docs.map(doc => ({

            id: doc.id,

            ...doc.data(),

        }));

        callback(invites);

    });

}

/* ==========================================
   CANCEL GAME
========================================== */

export async function cancelGame(roomId) {

    await updateDoc(

        doc(db, "gameRooms", roomId),

        {

            status: "cancelled",

        }

    );

}

/* ==========================================
   START GAME
========================================== */

/* ==========================================
   START GAME
========================================== */

export async function startGame(roomId) {

    console.log("Starting Game:", roomId);

    await updateDoc(

        doc(db, "gameRooms", roomId),

        {

            status: "playing",

            currentPlayer: 0,

            diceValue: null,

            winner: null,

            board: {

                red: [

                    { id: 1, pos: -1, active: false },

                    { id: 2, pos: -1, active: false },

                    { id: 3, pos: -1, active: false },

                    { id: 4, pos: -1, active: false },

                ],

                green: [

                    { id: 1, pos: -1, active: false },

                    { id: 2, pos: -1, active: false },

                    { id: 3, pos: -1, active: false },

                    { id: 4, pos: -1, active: false },

                ],

                blue: [

                    { id: 1, pos: -1, active: false },

                    { id: 2, pos: -1, active: false },

                    { id: 3, pos: -1, active: false },

                    { id: 4, pos: -1, active: false },

                ],

                yellow: [

                    { id: 1, pos: -1, active: false },

                    { id: 2, pos: -1, active: false },

                    { id: 3, pos: -1, active: false },

                    { id: 4, pos: -1, active: false },

                ],

            },

        }

    );

    console.log("Game Started");

}
/* ==========================================
   FIND MY ACTIVE ROOM
========================================== */

export async function getMyActiveRoom(uid) {

    const q = query(
        collection(db, "gameRooms"),
        where("playerIds", "array-contains", uid)
    );

    const snapshot = await getDocs(q);

    for (const document of snapshot.docs) {

        const room = {
            id: document.id,
            ...document.data(),
        };

        if (
            room.status === "waiting" ||
            room.status === "playing"
        ) {
            return room;
        }

    }

    return null;

}

/* ==========================================
   LISTEN MY ACTIVE ROOM
========================================== */

export function listenMyActiveRoom(

    uid,

    callback

) {

    const q = query(

        collection(db, "gameRooms"),

        where("playerIds", "array-contains", uid),

        limit(1)

    );

    return onSnapshot(

        q,

        (snapshot) => {

            if (snapshot.empty) {

                callback(null);

                return;

            }

            const room = {

                id: snapshot.docs[0].id,

                ...snapshot.docs[0].data(),

            };

            callback(room);

        }

    );

}

/* ==========================================
   ROLL DICE
========================================== */

export async function rollDice(roomId) {

    const roomRef = doc(db, "gameRooms", roomId);

    const snapshot = await getDoc(roomRef);

    if (!snapshot.exists()) return;

    const room = snapshot.data();

    const dice = Math.floor(Math.random() * 6) + 1;

    let nextPlayer = room.currentPlayer;

    // If dice isn't 6, pass the turn
    if (dice !== 6) {

        nextPlayer =
            (room.currentPlayer + 1) %
            room.playerIds.length;

    }

    await updateDoc(roomRef, {

        diceValue: dice,

        currentPlayer: nextPlayer,

    });

}

/* ==========================================
   MOVE TOKEN FROM HOME
========================================== */

export async function releaseToken(

    roomId,

    color,

    tokenId

){

    const roomRef = doc(db,"gameRooms",roomId);

    const snapshot = await getDoc(roomRef);

    if(!snapshot.exists()) return;

    const room = snapshot.data();

    if(room.diceValue !== 6){

        return;

    }

    const board = room.board;

    const tokens = [...board[color]];

    const token = tokens.find(

        t => t.id === tokenId

    );

    if(!token) return;

    if(token.pos !== -1){

        return;

    }

    token.pos = START_POSITION[color];

    token.active = true;

    board[color] = tokens;

    await updateDoc(

        roomRef,

        {

            board,

            diceValue:null,

        }

    );

}