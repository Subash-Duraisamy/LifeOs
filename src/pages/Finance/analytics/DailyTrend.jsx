import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function DailyTrend({ transactions }) {

  const grouped = {};

  transactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {

      const date = new Date(item.date);

      const key = date.toISOString().split("T")[0];

      if (!grouped[key]) {

        grouped[key] = {

          key,

          day: date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          }),

          amount: 0,

        };

      }

      grouped[key].amount += Number(item.amount);

    });

  const data = Object.values(grouped).sort(
    (a, b) => new Date(a.key) - new Date(b.key)
  );

  return (

    <div className="chart-card">

      <div className="chart-header">

        <h3>

          📅 Daily Spending Trend

        </h3>

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

            <AreaChart
              data={data}
            >

              <defs>

                <linearGradient
                  id="expenseGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="5%"
                    stopColor="#ef4444"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#ef4444"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="day"
              />

              <YAxis />

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString()}`,
                  "Spent",
                ]}
              />

              <Area
                type="monotone"
                dataKey="amount"
                stroke="#ef4444"
                fill="url(#expenseGradient)"
                strokeWidth={3}
              />

            </AreaChart>

          </ResponsiveContainer>

        )

      }

    </div>

  );

}

export default DailyTrend;