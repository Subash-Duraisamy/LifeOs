export function getCurrentStreak(calendarRecords = {}) {

    let current = 0;

    let pointer = new Date();

    pointer.setHours(0, 0, 0, 0);

    const todayKey =
        `${pointer.getFullYear()}-${String(pointer.getMonth() + 1).padStart(2, "0")}-${String(pointer.getDate()).padStart(2, "0")}`;

    if (
        !calendarRecords[todayKey] ||
        (
            !calendarRecords[todayKey].submitted &&
            !calendarRecords[todayKey].breakFree
        )
    ) {

        pointer.setDate(pointer.getDate() - 1);

    }

    while (true) {

        const key =
            `${pointer.getFullYear()}-${String(pointer.getMonth() + 1).padStart(2, "0")}-${String(pointer.getDate()).padStart(2, "0")}`;

        const record = calendarRecords[key];

        if (
            record &&
            (
                record.submitted ||
                record.breakFree
            )
        ) {

            current++;

            pointer.setDate(pointer.getDate() - 1);

        }

        else {

            break;

        }

    }

    return current;

}