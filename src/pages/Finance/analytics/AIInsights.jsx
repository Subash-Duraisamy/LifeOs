import "./AnalyticsPage.css";

function AIInsights({ transactions }) {

  const income = transactions.filter(
    (t) => t.type === "income"
  );

  const expense = transactions.filter(
    (t) => t.type === "expense"
  );

  const saving = transactions.filter(
    (t) => t.type === "saving"
  );

  const totalIncome = income.reduce(
    (sum, t) => sum + Number(t.amount),
    0
  );

  const totalExpense = expense.reduce(
    (sum, t) => sum + Number(t.amount),
    0
  );

  const totalSaving = saving.reduce(
    (sum, t) => sum + Number(t.amount),
    0
  );

  /* ===========================
      Biggest Expense Category
  =========================== */

  const expenseCategory = {};

  expense.forEach((item) => {

    expenseCategory[item.category] =
      (expenseCategory[item.category] || 0) +
      Number(item.amount);

  });

  let topExpense = "-";
  let topExpenseAmount = 0;

  Object.entries(expenseCategory).forEach(
    ([category, amount]) => {

      if (amount > topExpenseAmount) {

        topExpense = category;
        topExpenseAmount = amount;

      }

    }
  );

  /* ===========================
      Biggest Income Source
  =========================== */

  const incomeCategory = {};

  income.forEach((item) => {

    incomeCategory[item.category] =
      (incomeCategory[item.category] || 0) +
      Number(item.amount);

  });

  let topIncome = "-";
  let topIncomeAmount = 0;

  Object.entries(incomeCategory).forEach(
    ([category, amount]) => {

      if (amount > topIncomeAmount) {

        topIncome = category;
        topIncomeAmount = amount;

      }

    }
  );

  /* ===========================
      Highest Expense
  =========================== */

  let highestExpense = null;

  expense.forEach((item) => {

    if (
      !highestExpense ||
      item.amount > highestExpense.amount
    ) {

      highestExpense = item;

    }

  });

  /* ===========================
      Average Expense
  =========================== */

  const averageExpense =

    expense.length > 0

      ? Math.round(
          totalExpense / expense.length
        )

      : 0;

  /* ===========================
      Savings %
  =========================== */

  const savingsRate =

    totalIncome > 0

      ? (
          (totalSaving / totalIncome) *
          100
        ).toFixed(1)

      : 0;

  return (

    <div className="chart-card">

      <div className="chart-header">

        <h3>

          🤖 Smart Insights

        </h3>

      </div>

      <div className="insight-list">

        <div className="insight-item">

          💰 Largest income source:

          <strong>

            {" "}
            {topIncome}

          </strong>

          {" "}
          (₹{topIncomeAmount.toLocaleString()})

        </div>

        <div className="insight-item">

          🍔 Biggest expense category:

          <strong>

            {" "}
            {topExpense}

          </strong>

          {" "}
          (₹{topExpenseAmount.toLocaleString()})

        </div>

        <div className="insight-item">

          💸 Average expense per transaction:

          <strong>

            {" "}
            ₹{averageExpense.toLocaleString()}

          </strong>

        </div>

        <div className="insight-item">

          🏦 Savings Rate:

          <strong>

            {" "}
            {savingsRate}%

          </strong>

        </div>

        {

          highestExpense && (

            <div className="insight-item">

              🚨 Highest single expense:

              <strong>

                {" "}

                {highestExpense.category}

              </strong>

              {" "}

              ₹{highestExpense.amount.toLocaleString()}

            </div>

          )

        }

        <div className="insight-item">

          📈 Total Income:

          <strong>

            {" "}

            ₹{totalIncome.toLocaleString()}

          </strong>

        </div>

        <div className="insight-item">

          📉 Total Expense:

          <strong>

            {" "}

            ₹{totalExpense.toLocaleString()}

          </strong>

        </div>

        <div className="insight-item">

          💙 Total Savings:

          <strong>

            {" "}

            ₹{totalSaving.toLocaleString()}

          </strong>

        </div>

      </div>

    </div>

  );

}

export default AIInsights;