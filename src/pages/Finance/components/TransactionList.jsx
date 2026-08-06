import "./TransactionList.css";

import TransactionCard from "./TransactionCard";

function TransactionList({

  transactions,

  onEdit,

  onDelete,

}) {

  if (transactions.length === 0) {

    return (

      <div className="empty-transactions">

        <div className="empty-icon">

          💰

        </div>

        <h2>

          No Transactions Yet

        </h2>

        <p>

          Start tracking your finances by clicking
          <strong> Add Transaction</strong>

        </p>

      </div>

    );

  }

  return (

    <div className="transaction-list">

      {

        transactions.map((item) => (

          <TransactionCard

            key={item.id}

            transaction={item}

            onEdit={onEdit}

            onDelete={onDelete}

          />

        ))

      }

    </div>

  );

}

export default TransactionList;