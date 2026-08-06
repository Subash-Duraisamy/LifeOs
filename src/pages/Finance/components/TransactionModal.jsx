import { useEffect, useState } from "react";
import { X } from "lucide-react";
import "./TransactionModal.css";

const categoryMap = {
  income: [
    "Salary",
    "Freelancing",
    "Business",
    "Investment",
    "Gift",
    "External",
    "Others",
  ],

  expense: [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Health",
    "Education",
    "Entertainment",
    "Others",
  ],

  saving: [
    "Emergency Fund",
    "Bank",
    "Cash",
    "FD",
    "Stocks",
    "Mutual Funds",
    "Crypto",
    "Others",
  ],
};

function TransactionModal({
  open,
  onClose,
  onSave,
  transaction,
}) {

  const [type, setType] = useState("income");
  const [category, setCategory] = useState("Salary");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");

  /* ===========================
     LOCK BODY SCROLL
  =========================== */

  useEffect(() => {

    if (open) {

      document.body.style.overflow = "hidden";

    } else {

      document.body.style.overflow = "auto";

    }

    return () => {

      document.body.style.overflow = "auto";

    };

  }, [open]);

  /* ===========================
     LOAD DATA
  =========================== */

  useEffect(() => {

    if (!open) return;

    if (transaction) {

      setType(transaction.type);

      setCategory(transaction.category);

      setAmount(transaction.amount);

      setNotes(transaction.notes || "");

      setDate(transaction.date);

    } else {

      setType("income");

      setCategory("Salary");

      setAmount("");

      setNotes("");

      setDate(
        new Date()
          .toISOString()
          .split("T")[0]
      );

    }

  }, [open, transaction]);

  /* ===========================
     CHANGE CATEGORY
  =========================== */

  useEffect(() => {

    setCategory(categoryMap[type][0]);

  }, [type]);

  if (!open) return null;

  /* ===========================
     SAVE
  =========================== */

  async function handleSubmit() {

    if (!amount) {

      alert("Please enter amount.");

      return;

    }

    if (typeof onSave !== "function") {

      console.error("onSave prop is missing");

      return;

    }

    try {

      await onSave({

        type,

        category,

        amount: Number(amount),

        notes,

        date,

      });

    }

    catch (error) {

      console.error(error);

      alert(error.message);

    }

  }

  return (

    <div
      className="transaction-overlay"
      onClick={onClose}
    >

      <div
        className="transaction-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <button
          className="close-modal"
          onClick={onClose}
        >

          <X size={22} />

        </button>

        <h2>

          {transaction
            ? "Edit Transaction"
            : "Add Transaction"}

        </h2>

        <div className="transaction-form">

          <div className="form-group">

            <label>Type</label>

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
            >

              <option value="income">

                Income

              </option>

              <option value="expense">

                Expense

              </option>

              <option value="saving">

                Saving

              </option>

            </select>

          </div>

          <div className="form-group">

            <label>Category</label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              {categoryMap[type].map(
                (item) => (

                  <option
                    key={item}
                    value={item}
                  >

                    {item}

                  </option>

                )
              )}

            </select>

          </div>

          <div className="form-group">

            <label>Amount</label>

            <input
              type="number"
              placeholder="₹ 0"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label>Date</label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
            />

          </div>

          <div className="form-group">

            <label>Notes</label>

            <textarea
              rows="4"
              placeholder="Optional"
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
            />

          </div>

        </div>

        <div className="transaction-buttons">

          <button
            className="cancel-btn"
            onClick={onClose}
          >

            Cancel

          </button>

          <button
            className="save-btn"
            onClick={handleSubmit}
          >

            {transaction
              ? "Save Changes"
              : "Add Transaction"}

          </button>

        </div>

      </div>

    </div>

  );

}

export default TransactionModal;