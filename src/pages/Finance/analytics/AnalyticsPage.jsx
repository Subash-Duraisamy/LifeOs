import { useState, useMemo } from "react";

import "./AnalyticsPage.css";

import FilterBar from "./FilterBar";
import SummaryCards from "./SummaryCards";

import IncomePie from "./IncomePie";
import ExpensePie from "./ExpensePie";
import SavingsPie from "./SavingsPie";

import CashFlowChart from "./CashFlowChart";
import MonthlyComparison from "./MonthlyComparison";
import DailyTrend from "./DailyTrend";
import ExpenseRanking from "./ExpenseRanking";
import FinancialHealth from "./FinancialHealth";
import AIInsights from "./AIInsights";
import ExportSection from "./ExportSection";

function AnalyticsPage({ transactions }) {

  const [range, setRange] = useState("all");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const filteredTransactions = useMemo(() => {

    if (range === "all") {
      return transactions;
    }

    // Custom Date Range
    if (range === "custom") {

      if (!startDate || !endDate) {
        return transactions;
      }

      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      return transactions.filter((transaction) => {

        const transactionDate = new Date(transaction.date);

        return (
          transactionDate >= start &&
          transactionDate <= end
        );

      });

    }

    // Last X Days

    const days = Number(range);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const start = new Date();
    start.setDate(today.getDate() - days);
    start.setHours(0, 0, 0, 0);

    return transactions.filter((transaction) => {

      const transactionDate = new Date(transaction.date);

      return (
        transactionDate >= start &&
        transactionDate <= today
      );

    });

  }, [

    transactions,
    range,
    startDate,
    endDate,

  ]);

  return (

    <div className="analytics-page">

      <div className="analytics-header">

        <div>

          <h1>
            📊 Financial Analytics
          </h1>

          <p>
            Analyze every rupee earned, spent and saved.
          </p>

        </div>

        <ExportSection />

      </div>

      <FilterBar

        range={range}
        setRange={setRange}

        startDate={startDate}
        setStartDate={setStartDate}

        endDate={endDate}
        setEndDate={setEndDate}

      />

      <SummaryCards
        transactions={filteredTransactions}
      />

      <div className="pie-grid">

        <IncomePie
          transactions={filteredTransactions}
        />

        <ExpensePie
          transactions={filteredTransactions}
        />

        <SavingsPie
          transactions={filteredTransactions}
        />

      </div>

      <CashFlowChart
        transactions={filteredTransactions}
      />

      <MonthlyComparison
        transactions={filteredTransactions}
      />

      <DailyTrend
        transactions={filteredTransactions}
      />

      <ExpenseRanking
        transactions={filteredTransactions}
      />

      <FinancialHealth
        transactions={filteredTransactions}
      />

      <AIInsights
        transactions={filteredTransactions}
      />

    </div>

  );

}

export default AnalyticsPage;