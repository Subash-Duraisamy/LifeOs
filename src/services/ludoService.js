

import { db } from "../firebase/firebase";
import { releaseToken } from "../pages/Games/ludo/components/GameLogic";
import {

    moveToken,

    canMoveToken,

    sendTokenHome,

    getPathIndex,

    isBlock,

} from "../pages/Games/ludo/components/GameLogic";

import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    onSnapshot,
    getDoc,
    getDocs,
    updateDoc,
    arrayUnion,
    arrayRemove,
    query,
    where,
    deleteDoc,
    

    

} from "firebase/firestore";
import { createInitialTokens } from "../pages/Games/ludo/data/GameState";






/* =====================================
   NEXT TURN
===================================== */

function getNextTurn(room) {

    console.log("Players :", room.players);

    console.log("Current :", room.currentTurn);

    const currentIndex = room.players.findIndex(

        player => player.uid === room.currentTurn

    );

    console.log("Current Index :", currentIndex);

    let nextIndex = currentIndex + 1;

    if(nextIndex >= room.players.length){

        nextIndex = 0;

    }

    console.log("Next Index :", nextIndex);

    console.log("Next UID :", room.players[nextIndex].uid);

    return room.players[nextIndex].uid;

}

/* =====================================
   ROLL DICE
===================================== */

export async function rollDice(roomId, uid) {

    const roomRef = doc(db, "ludoRooms", roomId);

    const snapshot = await getDoc(roomRef);

    if (!snapshot.exists()) {
        throw new Error("Room not found.");
    }

    const room = snapshot.data();

    if (room.currentTurn !== uid) {
        throw new Error("Not your turn.");
    }

    const diceValue = Math.floor(Math.random() * 6) + 1;

    const myTokens = room.tokens[uid] || [];

    const canMove = myTokens.some(token =>
        canMoveToken(token, diceValue)
    );

    // No possible move
    if (!canMove) {

        // Roll was 6
        if (diceValue === 6) {

            await updateDoc(roomRef, {

                diceValue: 6,
                diceRolled: true,

            });

        }

        // Roll 1-5 and no move
        else {

            await updateDoc(roomRef, {

                diceValue,
                diceRolled: false,
                currentTurn: getNextTurn(room),

            });

        }

        return;
    }

    // Player has a move
    await updateDoc(roomRef, {

        diceValue,
        diceRolled: true,

    });

}


/* =====================================
   RELEASE TOKEN
===================================== */

export async function releaseMyToken(

    roomId,

    uid,

    tokenId

) {

    const roomRef = doc(

        db,

        "ludoRooms",

        roomId

    );

    const snapshot = await getDoc(roomRef);

    if (!snapshot.exists()) {

        throw new Error("Room not found.");

    }

    const room = snapshot.data();

    if (room.currentTurn !== uid) {

        throw new Error("Not your turn.");

    }

    if (!room.diceRolled) {

        throw new Error("Roll dice first.");

    }

    if (room.diceValue !== 6) {

        throw new Error("Need 6 to release.");

    }

    const player = room.players.find(

        p => p.uid === uid

    );

    const tokens = {

        ...room.tokens,

    };

    const myTokens = [...tokens[uid]];

    const index = myTokens.findIndex(

        token => token.id === tokenId

    );

    if (index === -1) {

        throw new Error("Token not found.");

    }

    if (!myTokens[index].home) {

        throw new Error("Already outside.");

    }

    myTokens[index] = releaseToken(

        myTokens[index],

        player.color

    );

    tokens[uid] = myTokens;

await updateDoc(roomRef,{

    tokens,

    diceRolled:false,

    diceValue:0,

    // same player gets another roll
    currentTurn: uid,

});

}

/* =====================================
   MOVE TOKEN
===================================== */

export async function moveMyToken(

    roomId,

    uid,

    tokenId

) {

    const roomRef = doc(

        db,

        "ludoRooms",

        roomId

    );

    const snapshot = await getDoc(

        roomRef

    );

    if (!snapshot.exists()) {

        throw new Error("Room not found.");

    }

    const room = snapshot.data();

    if (room.currentTurn !== uid) {

        throw new Error("Not your turn.");

    }

    if (!room.diceRolled) {

        throw new Error("Roll dice first.");

    }

    const player = room.players.find(

        player =>

            player.uid === uid

    );

    const tokens = {

        ...room.tokens,

    };

    const myTokens = [

        ...tokens[uid]

    ];

    const index = myTokens.findIndex(

        token =>

            token.id === tokenId

    );

    if (index === -1) {

        throw new Error("Token not found.");

    }

    if (

        !canMoveToken(

            myTokens[index],

            room.diceValue

        )

    ) {

        throw new Error(

            "Cannot move token."

        );

    }

// Move token

myTokens[index] = moveToken(

    myTokens[index],

    room.diceValue,

    player.color

);

tokens[uid] = myTokens;

// --------------------------------
// Check Capture
// --------------------------------

// --------------------------------
// Check Capture (Ignore Safe Cells)
// --------------------------------

let killed = false;

const movedToken = myTokens[index];
const allTokens = Object.values(tokens).flat();

const blocked = allTokens.some(

    token =>

        token.color !== movedToken.color &&

        !token.home &&

        !token.finished &&

        token.row === movedToken.row &&

        token.col === movedToken.col &&

        isBlock(

            allTokens,

            token.row,

            token.col,

            token.color

        )

);

if (blocked) {

    throw new Error(

        "Enemy block. Cannot move there."

    );

}

// Find moved token path index

const movedIndex = getPathIndex({

    row: movedToken.row,

    col: movedToken.col,

});

// Safe cells cannot kill

const safeIndexes = [

    0,

    8,

    13,

    21,

    26,

    34,

    39,

    47,

];

if (!safeIndexes.includes(movedIndex)) {

    for (const otherUid of Object.keys(tokens)) {

        if (otherUid === uid) continue;

        const enemyTokens = [...tokens[otherUid]];

        let changed = false;

        for (let i = 0; i < enemyTokens.length; i++) {

            const enemy = enemyTokens[i];

            if (

                enemy.home ||

                enemy.finished

            ) {

                continue;

            }

const allTokens = Object.values(tokens).flat();

if (

    enemy.row === movedToken.row &&

    enemy.col === movedToken.col &&

    !isBlock(

        allTokens,

        enemy.row,

        enemy.col,

        enemy.color

    )

) {

    enemyTokens[i] = sendTokenHome(enemy);

    killed = true;

    changed = true;

}

        }

        if (changed) {

            tokens[otherUid] = enemyTokens;

        }

    }

}

// --------------------------------
// Update Turn
// --------------------------------

const updates = {

    tokens,

    diceRolled: false,

    diceValue: 0,

};

// ----------------------
// Check Winner
// ----------------------

const myFinished = tokens[uid].every(

    token => token.finished

);

if (myFinished) {

    updates.status = "finished";

    updates.winner = uid;

}

else if (

    room.diceValue === 6 ||

    killed

) {

    updates.currentTurn = uid;

}

else {

    updates.currentTurn = getNextTurn(room);

}

await updateDoc(

    roomRef,

    updates

);

}
/* =====================================
   GET MY ACTIVE ROOM
===================================== */

export async function getMyActiveRoom(uid) {

    const snapshot = await getDocs(
        collection(db, "ludoRooms")
    );

    for (const document of snapshot.docs) {

        const room = document.data();

        const joined = room.players.some(
            player => player.uid === uid
        );

        if (

            joined &&

            room.status !== "finished"

        ) {

            return {

                id: document.id,

                ...room,

            };

        }

    }

    return null;

}


/* =====================================
   START GAME
===================================== */

export async function startGame(roomId) {

    const roomRef =
        doc(db, "ludoRooms", roomId);

    const snapshot =
        await getDoc(roomRef);

    if (!snapshot.exists()) {

        throw new Error("Room not found.");

    }

    const room =
        snapshot.data();
        const tokens = createInitialTokens(

    room.players

);

    // -----------------------------
    // Minimum Players
    // -----------------------------

    if (room.players.length < 2) {

        throw new Error(
            "At least 2 players are required."
        );

    }

    // -----------------------------
    // Everyone Ready?
    // -----------------------------

    const allReady =
        room.players.every(

            player =>

                player.ready

        );

    if (!allReady) {

        throw new Error(
            "All players must be Ready."
        );

    }

    // -----------------------------
    // Start Game
    // -----------------------------

   await updateDoc(

    roomRef,

    {

        status: "playing",

        currentTurn: room.players[0].uid,

        diceValue: 0,

        diceRolled: false,

        winner: null,

        tokens,

        startedAt: serverTimestamp(),

    }

);
}


/* =====================================
   ACCEPT LUDO INVITE
===================================== */

export async function acceptLudoInvite(
    invite
) {

    const roomRef =
        doc(db, "ludoRooms", invite.roomId);

    const roomSnap =
        await getDoc(roomRef);

    if (!roomSnap.exists()) {

        throw new Error("Room no longer exists.");

    }

    const room =
        roomSnap.data();

    const alreadyJoined =
        room.players.some(

            player =>

                player.uid === invite.toUid

        );

    if (!alreadyJoined) {

        const userSnap =
            await getDoc(

                doc(
                    db,
                    "users",
                    invite.toUid
                )

            );

        const profile =
            userSnap.data();
            const availableColors = [

    "red",

    "green",

    "yellow",

    "blue",

];

const usedColors = room.players.map(

    player => player.color

);

const color = availableColors.find(

    item => !usedColors.includes(item)

);

        await updateDoc(

            roomRef,

            {

                players: arrayUnion({

                    uid: invite.toUid,

                    fullName:
                        profile.fullName,

                    username:
                        profile.username,

                    photoURL:
                        profile.photoURL || "",

                    ready: false,

                    color,

                })

            }

        );

    }

    await deleteDoc(

        doc(
            db,
            "ludoInvites",
            invite.id
        )

    );

    return invite.roomId;

}

/* =====================================
   REJECT LUDO INVITE
===================================== */

export async function rejectLudoInvite(
    inviteId
) {

    await deleteDoc(

        doc(
            db,
            "ludoInvites",
            inviteId
        )

    );

}

/* =====================================
   LISTEN LUDO INVITES
===================================== */

export function listenLudoInvites(

    uid,

    callback

){

    const q = query(

        collection(db,"ludoInvites"),

        where("toUid","==",uid),

        where("status","==","pending")

    );

    return onSnapshot(

        q,

        snapshot=>{

            const invites=[];

            snapshot.forEach(document=>{

                invites.push({

                    id:document.id,

                    ...document.data(),

                });

            });

            callback(invites);

        }

    );

}


// _________________________________
export async function sendLudoInvite(

    roomId,

    currentUser,

    friend

){

    await addDoc(

        collection(db,"ludoInvites"),

        {

            roomId,

            fromUid:currentUser.uid,

            fromName:currentUser.fullName,

            toUid:friend.uid,

            status:"pending",

            createdAt:serverTimestamp(),

        }

    );

}
/* =====================================
   LEAVE ROOM
===================================== */

/* =====================================
   LEAVE ROOM
===================================== */



export async function leaveRoom(
    roomId,
    currentUser
) {

    const roomRef =
        doc(db, "ludoRooms", roomId);

    const snapshot =
        await getDoc(roomRef);

    if (!snapshot.exists()) {

        return;

    }

    const room =
        snapshot.data();

    // -------------------------
    // Remove Current Player
    // -------------------------

    const players =
        room.players.filter(

            player =>

                player.uid !== currentUser.uid

        );

    // -------------------------
    // No Players Left
    // -------------------------

    if (players.length === 0) {

        await deleteDoc(roomRef);

        return;

    }

    // -------------------------
    // Host Left?
    // -------------------------

    let hostUid =
        room.hostUid;

    if (room.hostUid === currentUser.uid) {

        hostUid =
            players[0].uid;

    }

    // -------------------------
    // Save
    // -------------------------

    await updateDoc(

        roomRef,

        {

            players,

            hostUid,

        }

    );

}
/* =====================================
   TOGGLE READY
===================================== */

/* =====================================
   TOGGLE READY
===================================== */

export async function toggleReady(
    roomId,
    uid
) {

    const roomRef =
        doc(db, "ludoRooms", roomId);

    const snapshot =
        await getDoc(roomRef);

    if (!snapshot.exists()) {

        throw new Error("Room not found.");

    }

    const room =
        snapshot.data();

    const players =
        room.players.map(player => {

            if (player.uid === uid) {

                return {

                    ...player,

                    ready: !player.ready,

                };

            }

            return player;

        });

    await updateDoc(roomRef, {

        players,

    });

}
/* =====================================
   JOIN ROOM
===================================== */

export async function joinRoom(
    roomCode,
    currentUser
) {

    const snapshot = await getDocs(
        collection(db, "ludoRooms")
    );

    let room = null;

    snapshot.forEach(document => {

        const data = document.data();

        if (data.roomCode === roomCode) {

            room = {

                id: document.id,

                ...data,

            };

        }

    });

    if (!room) {

        throw new Error("Room not found.");

    }

    if (room.players.length >= room.maxPlayers) {

        throw new Error("Room is full.");

    }

    const alreadyJoined =
        room.players.some(player =>
            player.uid === currentUser.uid
        );
        const availableColors = [

    "red",

    "green",

    "yellow",

    "blue",

];

const usedColors = room.players.map(

    player => player.color

);

const color = availableColors.find(

    item => !usedColors.includes(item)

);

    if (alreadyJoined) {

        return room.id;

    }

    await updateDoc(

        doc(db, "ludoRooms", room.id),

        {

            players: arrayUnion({

                uid: currentUser.uid,

                fullName: currentUser.fullName,

                username: currentUser.username,

                photoURL:
                    currentUser.photoURL || "",

                ready: false,

                color,

            })

        }

    );

    return room.id;

}
/* =====================================
   LISTEN ROOM
===================================== */

export function listenRoom(roomId, callback) {

    return onSnapshot(

        doc(db, "ludoRooms", roomId),

        snapshot => {

            if (!snapshot.exists()) {

                callback(null);

                return;

            }

            callback({

                id: snapshot.id,

                ...snapshot.data(),

            });

        }

    );

}

/* =====================================
   ROOM CODE
===================================== */

function generateRoomCode() {

    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";

    let code = "";

    for (let i = 0; i < 6; i++) {

        code += chars[
            Math.floor(
                Math.random() * chars.length
            )
        ];

    }

    return code;

}

/* =====================================
   CREATE ROOM
===================================== */

export async function createRoom(
    currentUser,
    maxPlayers
) {

    const roomCode =
        generateRoomCode();

    const roomRef =
        await addDoc(

            collection(db, "ludoRooms"),

            {

                roomCode,

                hostUid:
                    currentUser.uid,

                maxPlayers,

                status:
                    "waiting",

                createdAt:
                    serverTimestamp(),

                players: [

                    {

                        uid:
                            currentUser.uid,

                        fullName:
                            currentUser.fullName,

                        username:
                            currentUser.username,

                        photoURL:
                            currentUser.photoURL || "",

                        ready:false,

                        color:"red",

                    }

                ]

            }

        );

    return {

        roomId:
            roomRef.id,

        roomCode,

    };

}