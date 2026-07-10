import {

    PieChart,

    Pie,

    Cell,

    Tooltip,

    Legend,

    ResponsiveContainer,

} from "recharts";

const COLORS = [

    "#22c55e",

    "#3b82f6",

    "#8b5cf6",

    "#f59e0b",

    "#ef4444",

    "#06b6d4",

    "#84cc16",

];

function IncomePie({

    transactions,

}) {

    const incomeTransactions = transactions.filter(

        (item) => item.type === "income"

    );

    const grouped = {};

    incomeTransactions.forEach((item) => {

        grouped[item.category] =

            (grouped[item.category] || 0) +

            Number(item.amount);

    });

    const data = Object.keys(grouped).map(

        (key) => ({

            name: key,

            value: grouped[key],

        })

    );

    const totalIncome = incomeTransactions.reduce(

        (sum, item) =>

            sum + Number(item.amount),

        0

    );

    return (

        <div className="chart-card">

            <div className="chart-header">

                <h3>

                    💰 Income Breakdown

                </h3>

                <span>

                    ₹{totalIncome.toLocaleString()}

                </span>

            </div>

            {

                data.length === 0 ? (

                    <div className="empty-chart">

                        No income data available

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

                            >

                                {

                                    data.map(

                                        (

                                            entry,

                                            index

                                        ) => (

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

                            <Tooltip />

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

export default IncomePie;