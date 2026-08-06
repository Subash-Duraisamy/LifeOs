import {
  Pencil,
  Trash2,
} from "lucide-react";

import "./TransactionCard.css";

function TransactionCard({

  transaction,

  onEdit,

  onDelete,

}) {

  const {

    type,

    category,

    amount,

    notes,

    date,

  } = transaction;

  const isIncome = type === "income";
  const isExpense = type === "expense";
  const isSaving = type === "saving";

  return (

    <div className="transaction-card">

      <div className="transaction-left">

        <div
          className={`transaction-icon ${type}`}
        >

          {isIncome && "💼"}

          {isExpense && "🍔"}

          {isSaving && "🏦"}

        </div>

        <div>

          <h3>{category}</h3>

          <p>{notes || "No Notes"}</p>

          <span>{date}</span>

        </div>

      </div>

      <div className="transaction-right">

        <h2
          className={
            isIncome
              ? "income"

              : isExpense
              ? "expense"

              : "saving"
          }
        >

          {isIncome ? "+" : "-"}

          ₹{Number(amount).toLocaleString()}

        </h2>

        <div className="transaction-actions">

          <button
            onClick={() => onEdit(transaction)}
          >

            <Pencil size={18} />

          </button>

          <button
            onClick={() =>
              onDelete(transaction.id)
            }
          >

            <Trash2 size={18} />

          </button>

        </div>

      </div>

    </div>

  );

}

export default TransactionCard;