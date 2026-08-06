import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const COLORS = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#84cc16",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
];

function ExpensePie({ transactions }) {

    const expenseTransactions = transactions.filter(
        (item) => item.type === "expense"
    );

    const grouped = {};

    expenseTransactions.forEach((item) => {

        grouped[item.category] =
            (grouped[item.category] || 0) +
            Number(item.amount);

    });

    const data = Object.keys(grouped).map((key) => ({
        name: key,
        value: grouped[key],
    }));

    const totalExpense = expenseTransactions.reduce(
        (sum, item) =>
            sum + Number(item.amount),
        0
    );

    return (

        <div className="chart-card">

            <div className="chart-header">

                <h3>

                    💸 Expense Breakdown

                </h3>

                <span className="expense-total">

                    ₹{totalExpense.toLocaleString()}

                </span>

            </div>

            {

                data.length === 0 ? (

                    <div className="empty-chart">

                        No expense data available

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

                                    data.map((entry, index) => (

                                        <Cell
                                            key={index}
                                            fill={
                                                COLORS[
                                                    index %
                                                    COLORS.length
                                                ]
                                            }
                                        />

                                    ))

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

export default ExpensePie;