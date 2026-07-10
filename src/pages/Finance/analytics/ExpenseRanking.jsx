function ExpenseRanking({ transactions }) {

  const grouped = {};

  transactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {

      grouped[item.category] =
        (grouped[item.category] || 0) +
        Number(item.amount);

    });

  const data = Object.entries(grouped)
    .map(([category, amount]) => ({
      category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  const maxAmount =
    data.length > 0
      ? data[0].amount
      : 1;

  return (

    <div className="chart-card">

      <div className="chart-header">

        <h3>

          🏆 Top Expense Categories

        </h3>

      </div>

      {

        data.length === 0 ? (

          <div className="empty-chart">

            No expense data available

          </div>

        ) : (

          <div className="expense-ranking">

            {

              data.map((item, index) => (

                <div
                  key={item.category}
                  className="expense-item"
                >

                  <div className="expense-top">

                    <span>

                      #{index + 1} {item.category}

                    </span>

                    <strong>

                      ₹{item.amount.toLocaleString()}

                    </strong>

                  </div>

                  <div className="expense-bar">

                    <div
                      className="expense-fill"
                      style={{
                        width: `${(item.amount / maxAmount) * 100}%`,
                      }}
                    />

                  </div>

                </div>

              ))

            }

          </div>

        )

      }

    </div>

  );

}

export default ExpenseRanking;