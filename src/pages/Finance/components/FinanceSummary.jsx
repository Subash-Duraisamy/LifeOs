import "./FinanceSummary.css";

function FinanceSummary({ transactions }) {

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const savings = transactions
    .filter((t) => t.type === "saving")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance =
    income - expense - savings;

  return (

    <div className="finance-summary">

      <div className="summary-card balance">

        <h3>Available Balance</h3>

        <h2>₹{balance.toLocaleString()}</h2>

      </div>

      <div className="summary-card income">

        <h3>Total Income</h3>

        <h2>₹{income.toLocaleString()}</h2>

      </div>

      <div className="summary-card expense">

        <h3>Total Expenses</h3>

        <h2>₹{expense.toLocaleString()}</h2>

      </div>

      <div className="summary-card savings">

        <h3>Total Savings</h3>

        <h2>₹{savings.toLocaleString()}</h2>

      </div>

    </div>

  );

}

export default FinanceSummary;