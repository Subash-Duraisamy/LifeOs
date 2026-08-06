import "./AnalyticsPage.css";

function FinancialHealth({ transactions }) {

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const saving = transactions
    .filter((t) => t.type === "saving")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expense - saving;

  const savingsRate =
    income > 0
      ? (saving / income) * 100
      : 0;

  const expenseRate =
    income > 0
      ? (expense / income) * 100
      : 0;

  let score = 100;

  if (expenseRate > 80) score -= 40;
  else if (expenseRate > 60) score -= 20;
  else if (expenseRate > 40) score -= 10;

  if (savingsRate < 10) score -= 25;
  else if (savingsRate < 20) score -= 10;

  if (balance < 0) score -= 30;

  score = Math.max(0, Math.min(score, 100));

  let status = "";
  let color = "";

  if (score >= 85) {

    status = "Excellent";
    color = "#16a34a";

  } else if (score >= 70) {

    status = "Good";
    color = "#22c55e";

  } else if (score >= 50) {

    status = "Average";
    color = "#f59e0b";

  } else {

    status = "Needs Improvement";
    color = "#ef4444";

  }

  return (

    <div className="chart-card">

      <div className="chart-header">

        <h3>

          ❤️ Financial Health

        </h3>

      </div>

      <div className="health-container">

        <div
          className="health-circle"
          style={{
            borderColor: color,
          }}
        >

          <h1
            style={{
              color,
            }}
          >

            {score}

          </h1>

          <span>/100</span>

        </div>

        <div className="health-details">

          <h2
            style={{
              color,
            }}
          >

            {status}

          </h2>

          <p>

            Balance :
            <strong>

              {" "}
              ₹{balance.toLocaleString()}

            </strong>

          </p>

          <p>

            Savings Rate :
            <strong>

              {" "}
              {savingsRate.toFixed(1)}%

            </strong>

          </p>

          <p>

            Expense Rate :
            <strong>

              {" "}
              {expenseRate.toFixed(1)}%

            </strong>

          </p>

        </div>

      </div>

    </div>

  );

}

export default FinancialHealth;