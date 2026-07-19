/* ===========================================
   DATE HELPERS
=========================================== */

function toDate(date) {

    if (!date) return null;

    if (date instanceof Date) return date;

    if (date.seconds) {
        return new Date(date.seconds * 1000);
    }

    return new Date(date);

}

function daysBetween(date1, date2) {

    const oneDay = 1000 * 60 * 60 * 24;

    return Math.round(
        (toDate(date2) - toDate(date1)) / oneDay
    );

}

/* ===========================================
   AVERAGE CYCLE LENGTH
=========================================== */

export function calculateAverageCycle(cycles) {

    if (!cycles || cycles.length < 2) {
        return 28;
    }

    let total = 0;

    let count = 0;

    const sorted = [...cycles].sort(
        (a, b) =>
            toDate(a.startDate) - toDate(b.startDate)
    );

    for (let i = 1; i < sorted.length; i++) {

        total += daysBetween(
            sorted[i - 1].startDate,
            sorted[i].startDate
        );

        count++;

    }

    return Math.round(total / count);

}

/* ===========================================
   AVERAGE PERIOD LENGTH
=========================================== */

export function calculateAveragePeriod(cycles) {

    if (!cycles || cycles.length === 0) {

        return 5;

    }

    let total = 0;

    let count = 0;

    cycles.forEach(cycle => {

        if (
            cycle.startDate &&
            cycle.endDate
        ) {

            total +=
                daysBetween(
                    cycle.startDate,
                    cycle.endDate
                ) + 1;

            count++;

        }

    });

    if (count === 0) return 5;

    return Math.round(total / count);

}

/* ===========================================
   NEXT PERIOD
=========================================== */

export function predictNextPeriod(cycles) {

    if (!cycles || cycles.length === 0) {

        return null;

    }

    const averageCycle =
        calculateAverageCycle(cycles);

    const latest = [...cycles].sort(

        (a, b) =>

            toDate(b.startDate) -
            toDate(a.startDate)

    )[0];

    const next = new Date(

        toDate(latest.startDate)

    );

    next.setDate(

        next.getDate() + averageCycle

    );

    return next;

}

/* ===========================================
   OVULATION
=========================================== */

export function predictOvulation(cycles) {

    const nextPeriod =
        predictNextPeriod(cycles);

    if (!nextPeriod) return null;

    const ovulation =
        new Date(nextPeriod);

    ovulation.setDate(

        ovulation.getDate() - 14

    );

    return ovulation;

}

/* ===========================================
   FERTILE WINDOW
=========================================== */

export function predictFertileWindow(cycles) {

    const ovulation =
        predictOvulation(cycles);

    if (!ovulation) return null;

    const start =
        new Date(ovulation);

    const end =
        new Date(ovulation);

    start.setDate(start.getDate() - 5);

    end.setDate(end.getDate() + 1);

    return {

        start,

        end,

    };

}

/* ===========================================
   CURRENT CYCLE DAY
=========================================== */

export function calculateCycleDay(currentCycle) {

    if (!currentCycle) return 0;

    return (

        daysBetween(

            currentCycle.startDate,

            new Date()

        ) + 1

    );

}

/* ===========================================
   CURRENT PERIOD DAY
=========================================== */

export function calculatePeriodDay(currentCycle) {

    if (!currentCycle) return 0;

    if (
        currentCycle.status !== "ACTIVE"
    ) {
        return 0;
    }

    return (

        daysBetween(

            currentCycle.startDate,

            new Date()

        ) + 1

    );

}

/* ===========================================
   CURRENT PHASE
=========================================== */

export function calculateCurrentPhase(

    currentCycle,

    cycles

) {

    if (!currentCycle) {

        return "Unknown";

    }

    const cycleDay =
        calculateCycleDay(currentCycle);

    const averageCycle =
        calculateAverageCycle(cycles);

    const averagePeriod =
        calculateAveragePeriod(cycles);

    if (cycleDay <= averagePeriod) {

        return "Menstrual";

    }

    if (cycleDay <= averageCycle / 2 - 2) {

        return "Follicular";

    }

    if (

        cycleDay >= averageCycle / 2 - 1 &&

        cycleDay <= averageCycle / 2 + 1

    ) {

        return "Ovulation";

    }

    return "Luteal";

}

/* ===========================================
   REGULARITY SCORE
=========================================== */

export function calculateRegularity(cycles) {

    if (!cycles || cycles.length < 3) {

        return {

            score: 100,

            label: "Need More Data",

        };

    }

    const lengths = [];

    const sorted = [...cycles].sort(

        (a, b) =>

            toDate(a.startDate) -

            toDate(b.startDate)

    );

    for (let i = 1; i < sorted.length; i++) {

        lengths.push(

            daysBetween(

                sorted[i - 1].startDate,

                sorted[i].startDate

            )

        );

    }

    const avg =

        lengths.reduce(

            (a, b) => a + b,

            0

        ) / lengths.length;

    let deviation = 0;

    lengths.forEach(length => {

        deviation += Math.abs(

            length - avg

        );

    });

    deviation /= lengths.length;

    const score = Math.max(

        0,

        100 - deviation * 10

    );

    let label = "Regular";

    if (score < 80) {

        label = "Moderately Regular";

    }

    if (score < 60) {

        label = "Irregular";

    }

    return {

        score: Math.round(score),

        label,

    };

}

/* ===========================================
   DAYS UNTIL NEXT PERIOD
=========================================== */

export function getDaysUntilNextPeriod(cycles) {

    const next = predictNextPeriod(cycles);

    if (!next) return 0;

    return daysBetween(

        new Date(),

        next

    );

}

/* ===========================================
   SUMMARY
=========================================== */

export function getPredictionSummary(

    currentCycle,

    cycles

) {

    return {

        averageCycle:

            calculateAverageCycle(cycles),

        averagePeriod:

            calculateAveragePeriod(cycles),

        cycleDay:

            calculateCycleDay(currentCycle),

        periodDay:

            calculatePeriodDay(currentCycle),

        currentPhase:

            calculateCurrentPhase(

                currentCycle,

                cycles

            ),

        nextPeriod:

            predictNextPeriod(cycles),

        ovulation:

            predictOvulation(cycles),

        fertileWindow:

            predictFertileWindow(cycles),

        regularity:

            calculateRegularity(cycles),

        daysUntilNext:

            getDaysUntilNextPeriod(cycles),

    };

}