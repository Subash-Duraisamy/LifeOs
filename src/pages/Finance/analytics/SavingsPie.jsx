import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const COLORS = [
    "#2563eb",
    "#06b6d4",
    "#14b8a6",
    "#22c55e",
    "#84cc16",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
];

function SavingsPie({ transactions }) {

    const savingTransactions = transactions.filter(
        (item) => item.type === "saving"
    );

    const grouped = {};

    savingTransactions.forEach((item) => {

        grouped[item.category] =
            (grouped[item.category] || 0) +
            Number(item.amount);

    });

    const data = Object.keys(grouped).map((key) => ({

        name: key,

        value: grouped[key],

    }));

    const totalSavings = savingTransactions.reduce(

        (sum, item) =>

            sum + Number(item.amount),

        0

    );

    return (

        <div className="chart-card">

            <div className="chart-header">

                <h3>

                    🏦 Savings Breakdown

                </h3>

                <span className="saving-total">

                    ₹{totalSavings.toLocaleString()}

                </span>

            </div>

            {

                data.length === 0 ? (

                    <div className="empty-chart">

                        No savings data available

                    </div>

                ) : (

                    <ResponsiveContainer
                        width="100%"
                       aspect={1.3}
                    >

                        <PieChart>

                            <Pie

                                data={data}

                                dataKey="value"

                                nameKey="name"

                               cx="50%"
    cy="50%"
    innerRadius="45%"
    outerRadius="70%"

                                paddingAngle={3}

                                label

                            >

                                {

                                    data.map(

                                        (entry, index) => (

                                            <Cell

                                                key={index}

                                                fill={
                                                    COLORS[
                                                        index %
                                                        COLORS.length
                                                    ]
                                                }

                                            />

                                        )

                                    )

                                }

                            </Pie>

                            <Tooltip
                                formatter={(value) =>
                                    `₹${value.toLocaleString()}`
                                }
                            />

                           <Legend
    verticalAlign="bottom"
    height={30}
/>

                        </PieChart>

                    </ResponsiveContainer>

                )

            }

        </div>

    );

}

export default SavingsPie;