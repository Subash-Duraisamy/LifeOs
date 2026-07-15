

import { db } from "../firebase/firebase";

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

    await updateDoc(roomRef, {

        status: "playing",

        startedAt: serverTimestamp(),

    });

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