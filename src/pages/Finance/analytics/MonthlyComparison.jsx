import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function MonthlyComparison({ transactions }) {

  const grouped = {};

  transactions.forEach((item) => {

    const month = new Date(item.date).toLocaleString(
      "default",
      {
        month: "short",
        year: "2-digit",
      }
    );

    if (!grouped[month]) {

      grouped[month] = {
        month,
        income: 0,
        expense: 0,
        saving: 0,
      };

    }

    if (item.type === "income") {

      grouped[month].income += Number(item.amount);

    }

    if (item.type === "expense") {

      grouped[month].expense += Number(item.amount);

    }

    if (item.type === "saving") {

      grouped[month].saving += Number(item.amount);

    }

  });

  const data = Object.values(grouped);

  return (

    <div className="chart-card">

      <div className="chart-header">

        <h3>

          📊 Monthly Comparison

        </h3>

      </div>

      {

        data.length === 0 ? (

          <div className="empty-chart">

            No monthly data available

          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
           aspect={1.3}
          >

            <BarChart
              data={data}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="month"
              />

              <YAxis />

              <Tooltip
                formatter={(value) =>
                  `₹${value.toLocaleString()}`
                }
              />

             <Legend
    verticalAlign="bottom"
    height={30}
/>

              <Bar
                dataKey="income"
                fill="#22c55e"
                radius={[8,8,0,0]}
              />

              <Bar
                dataKey="expense"
                fill="#ef4444"
                radius={[8,8,0,0]}
              />

              <Bar
                dataKey="saving"
                fill="#2563eb"
                radius={[8,8,0,0]}
              />

            </BarChart>

          </ResponsiveContainer>

        )

      }

    </div>

  );

}

export default MonthlyComparison;