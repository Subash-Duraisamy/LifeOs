import {

  ResponsiveContainer,

  LineChart,

  Line,

  XAxis,

  YAxis,

  Tooltip,

  CartesianGrid,

  Legend,

} from "recharts";

function CashFlowChart({ transactions }) {

  const monthlyData = {};

  transactions.forEach((item) => {

    const month = new Date(item.date).toLocaleString(
      "default",
      {
        month: "short",
        year: "2-digit",
      }
    );

    if (!monthlyData[month]) {

      monthlyData[month] = {

        month,

        income: 0,

        expense: 0,

        saving: 0,

      };

    }

    if (item.type === "income") {

      monthlyData[month].income += Number(
        item.amount
      );

    }

    if (item.type === "expense") {

      monthlyData[month].expense += Number(
        item.amount
      );

    }

    if (item.type === "saving") {

      monthlyData[month].saving += Number(
        item.amount
      );

    }

  });

  const data = Object.values(monthlyData);

  return (

    <div className="chart-card">

      <div className="chart-header">

        <h3>

          📈 Cash Flow Trend

        </h3>

      </div>

      {

        data.length === 0 ? (

          <div className="empty-chart">

            No data available

          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
            aspect={1.3}
          >

            <LineChart
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

              <Line

                type="monotone"

                dataKey="income"

                stroke="#22c55e"

                strokeWidth={4}

                dot={{ r: 5 }}

              />

              <Line

                type="monotone"

                dataKey="expense"

                stroke="#ef4444"

                strokeWidth={4}

                dot={{ r: 5 }}

              />

              <Line

                type="monotone"

                dataKey="saving"

                stroke="#2563eb"

                strokeWidth={4}

                dot={{ r: 5 }}

              />

            </LineChart>

          </ResponsiveContainer>

        )

      }

    </div>

  );

}

export default CashFlowChart;