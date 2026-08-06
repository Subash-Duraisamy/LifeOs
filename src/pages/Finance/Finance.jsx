import { useEffect, useMemo, useState } from "react";

import "./Finance.css";

import { useAuth } from "../../hooks/useAuth";

import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../services/financeService";

import FinanceHeader from "./components/FinanceHeader";
import FinanceSummary from "./components/FinanceSummary";
import FinanceToolbar from "./components/FinanceToolbar";
import TransactionList from "./components/TransactionList";
import TransactionModal from "./components/TransactionModal";
import AnalyticsPage from "./analytics/AnalyticsPage";

function Finance() {

  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);

  const [openModal, setOpenModal] = useState(false);

  const [editingTransaction, setEditingTransaction] = useState(null);

  const [showAnalytics, setShowAnalytics] = useState(false);

  /* ===============================
      SEARCH / FILTER / SORT
  =============================== */

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState("all");

  const [sortBy, setSortBy] = useState("newest");

  /* ===============================
      LOAD DATA
  =============================== */

  useEffect(() => {

    if (user) {

      loadTransactions();

    }

  }, [user]);

  async function loadTransactions() {

    try {

      const data = await getTransactions(user.uid);

      setTransactions(data);

    }

    catch (error) {

      console.error(error);

    }

  }

  /* ===============================
      SAVE
  =============================== */

  async function handleSave(data) {

    try {

      if (editingTransaction) {

        await updateTransaction(

          user.uid,

          editingTransaction.id,

          data

        );

      }

      else {

        await addTransaction(

          user.uid,

          data

        );

      }

      setEditingTransaction(null);

      setOpenModal(false);

      loadTransactions();

    }

    catch (error) {

      console.error(error);

    }

  }

  /* ===============================
      DELETE
  =============================== */

  async function handleDelete(id) {

    try {

      await deleteTransaction(

        user.uid,

        id

      );

      loadTransactions();

    }

    catch (error) {

      console.error(error);

    }

  }

  /* ===============================
      EDIT
  =============================== */

  function handleEdit(item) {

    setEditingTransaction(item);

    setOpenModal(true);

  }

  /* ===============================
      FILTER + SORT
  =============================== */

  const filteredTransactions = useMemo(() => {

    let data = [...transactions];

    // Search

    if (search.trim()) {

      const text = search.toLowerCase();

      data = data.filter((item) =>

        item.category?.toLowerCase().includes(text) ||

        item.notes?.toLowerCase().includes(text)

      );

    }

    // Type Filter

    if (typeFilter !== "all") {

      data = data.filter(

        (item) => item.type === typeFilter

      );

    }

    // Sort

    switch (sortBy) {

      case "oldest":

        data.sort(

          (a, b) =>

            new Date(a.date) -

            new Date(b.date)

        );

        break;

      case "highest":

        data.sort(

          (a, b) =>

            b.amount - a.amount

        );

        break;

      case "lowest":

        data.sort(

          (a, b) =>

            a.amount - b.amount

        );

        break;

      case "az":

        data.sort((a, b) =>

          a.category.localeCompare(

            b.category

          )

        );

        break;

      case "za":

        data.sort((a, b) =>

          b.category.localeCompare(

            a.category

          )

        );

        break;

      default:

        data.sort(

          (a, b) =>

            new Date(b.date) -

            new Date(a.date)

        );

    }

    return data;

  }, [

    transactions,

    search,

    typeFilter,

    sortBy,

  ]);

  return (

    <div className="finance-page">

      <FinanceHeader />

      <FinanceSummary

        transactions={transactions}

      />

      <FinanceToolbar

        onAdd={() => {

          setEditingTransaction(null);

          setOpenModal(true);

        }}

        onVisualize={() =>

          setShowAnalytics(

            !showAnalytics

          )

        }

        search={search}

        setSearch={setSearch}

        typeFilter={typeFilter}

        setTypeFilter={setTypeFilter}

        sortBy={sortBy}

        setSortBy={setSortBy}

      />

      <TransactionList

        transactions={filteredTransactions}

        onEdit={handleEdit}

        onDelete={handleDelete}

      />

{
  showAnalytics && (

    <AnalyticsPage
      transactions={filteredTransactions}
    />

  )
}

      <TransactionModal

        open={openModal}

        transaction={editingTransaction}

        onClose={() => {

          setEditingTransaction(null);

          setOpenModal(false);

        }}

        onSave={handleSave}

      />

    </div>

  );

}

export default Finance;