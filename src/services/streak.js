import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

/* ==========================================================
   CONSTANTS
========================================================== */

const DAY_MS = 24 * 60 * 60 * 1000;

/* ==========================================================
   FORMAT DATE
========================================================== */

function formatDate(date) {

    return `${date.getFullYear()}-${String(

        date.getMonth() + 1

    ).padStart(2, "0")}-${String(

        date.getDate()

    ).padStart(2, "0")}`;

}

/* ==========================================================
   NORMALIZE DATE
========================================================== */

function normalizeDate(date) {

    const d = new Date(date);

    d.setHours(

        0,
        0,
        0,
        0

    );

    return d;

}

/* ==========================================================
   DAY DIFFERENCE
========================================================== */

function dayDifference(

    date1,
    date2

) {

    return (

        normalizeDate(date2) -

        normalizeDate(date1)

    ) / DAY_MS;

}

/* ==========================================================
   LOAD ALL CALENDAR DAYS
========================================================== */

async function loadCalendarDays(uid) {

    const q = query(

        collection(

            db,
            "calendar"

        ),

        where(

            "uid",
            "==",
            uid

        )

    );

    const snapshot = await getDocs(q);

    const records = snapshot.docs

        .map(doc => doc.data())

        .sort(

            (a, b) =>

                new Date(a.date) -

                new Date(b.date)

        );

    return records;

}

/* ==========================================================
   SAVE STREAK
========================================================== */

export async function saveUserStreak(

    uid,
    streakData

) {

    await setDoc(

        doc(

            db,
            "streak",
            uid

        ),

        {

            ...streakData,

            updatedAt:

                serverTimestamp(),

        },

        {

            merge: true,

        }

    );

}

/* ==========================================================
   LOAD STREAK
========================================================== */

export async function loadUserStreak(uid) {

    const snapshot = await getDoc(

        doc(

            db,
            "streak",
            uid

        )

    );

    if (

        !snapshot.exists()

    ) {

        return null;

    }

    return snapshot.data();

}

/* ==========================================================
   MAIN FUNCTION
========================================================== */

export async function calculateAndSaveStreak(uid) {

    const records =

        await loadCalendarDays(uid);

    if (

        records.length === 0

    ) {

        const empty = {

            currentStreak: 0,

            currentStartDate: null,

            currentEndDate: null,

            longestStreak: 0,

            longestStartDate: null,

            longestEndDate: null,

            lastCalculatedDate:

                formatDate(

                    new Date()

                ),

        };

        await saveUserStreak(

            uid,
            empty

        );

        return empty;

    }

    /* ==========================================
       CONTINUE IN PART 2
    ========================================== */




/* ==========================================================
   BUILD DAY MAP
========================================================== */

const dayMap = new Map();

records.forEach(record => {

    dayMap.set(

        record.date,

        record

    );

});

/* ==========================================================
   LONGEST STREAK
========================================================== */

let longestStreak = 0;

let longestStartDate = null;

let longestEndDate = null;

/* Current sequence */

let runningLength = 0;

let runningStartDate = null;

for (

    let i = 0;

    i < records.length;

    i++

) {

    const today = records[i];

    const yesterday =

        records[i - 1];

/* ==========================================
   PRODUCTIVE DAY
========================================== */

    const productive =

        today.submitted === true &&

        (today.completionPercentage ?? 0) > 0;

/* ==========================================
   BREAK FREE DAY
========================================== */

    const breakFree =

        today.breakFree === true;

/* ==========================================
   INVALID DAY
========================================== */

    const invalid =

        !productive &&

        !breakFree;

/* ==========================================
   INVALID DAY
========================================== */

    if (invalid) {

        runningLength = 0;

        runningStartDate = null;

        continue;

    }

/* ==========================================
   FIRST VALID DAY
========================================== */

    if (

        runningStartDate === null

    ) {

        runningStartDate =

            today.date;

    }

/* ==========================================
   GAP CHECK
========================================== */

    if (

        yesterday

    ) {

        const gap = dayDifference(

            yesterday.date,

            today.date

        );

if (

    gap !== 1

) {

            runningLength = 0;

            runningStartDate =

                today.date;

        }

    }

/* ==========================================
   PRODUCTIVE DAY
========================================== */

if (

    productive || breakFree

) {

    runningLength++;

}

/* ==========================================
   UPDATE LONGEST
========================================== */

    if (

        runningLength >

        longestStreak

    ) {

        longestStreak =

            runningLength;

        longestStartDate =

            runningStartDate;

        longestEndDate =

            today.date;

    }

}


/* ==========================================================
   CURRENT STREAK
========================================================== */

let currentStreak = 0;

let currentStartDate = null;

let currentEndDate = null;

let pointer = new Date();

pointer.setHours(

    0,
    0,
    0,
    0

);

const todayKey = formatDate(pointer);

const todayRecord =

    dayMap.get(todayKey);

/* ==========================================
   TODAY SUBMITTED WITH 0%
   BREAK IMMEDIATELY
========================================== */

if (

    todayRecord &&

    todayRecord.submitted === true &&

    !todayRecord.breakFree &&

    (todayRecord.completionPercentage ?? 0) <= 0

) {

    currentStreak = 0;

    currentStartDate = null;

    currentEndDate = null;

}

/* ==========================================
   START FROM YESTERDAY
========================================== */

else {

    if (

        !todayRecord

    ) {

        pointer.setDate(

            pointer.getDate() - 1

        );

    }

let previousDate = null;

while (true) {

    const key = formatDate(pointer);

    const record = dayMap.get(key);

    if (!record) {

        break;

    }

    // Check consecutive dates
    if (previousDate) {

        const diff = dayDifference(

            key,

            previousDate

        );

        if (diff !== 1) {

            break;

        }

    }

    const productive =

        record.submitted === true &&

        (record.completionPercentage ?? 0) > 0;

    const breakFree =

        record.breakFree === true;

    if (!productive && !breakFree) {

        break;

    }

    if (currentEndDate === null) {

        currentEndDate = key;

    }

    currentStartDate = key;

if (

    productive || breakFree

) {

    currentStreak++;

}

    previousDate = key;

    pointer.setDate(

        pointer.getDate() - 1

    );

}

}


/* ==========================================================
   FINAL STREAK OBJECT
========================================================== */

const streakData = {

    /* ==========================
       CURRENT STREAK
    ========================== */

    currentStreak,

    currentStartDate,

    currentEndDate,

    /* ==========================
       LONGEST STREAK
    ========================== */

    longestStreak,

    longestStartDate,

    longestEndDate,

    /* ==========================
       EXTRA INFORMATION
    ========================== */

    totalCalendarDays: records.length,

    productiveDays:

        records.filter(record =>

            record.submitted === true &&

            (record.completionPercentage ?? 0) > 0

        ).length,

    breakFreeDays:

        records.filter(record =>

            record.breakFree === true

        ).length,

    lastCalculatedDate:

        formatDate(

            new Date()

        ),

};

/* ==========================================================
   SAVE TO FIRESTORE
========================================================== */

await saveUserStreak(

    uid,

    streakData

);

/* ==========================================================
   RETURN
========================================================== */

return streakData;

}