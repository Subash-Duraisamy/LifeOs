import {
  PieChart,
  BarChart3,
  TrendingUp,
  Wallet,
  Target,
  CalendarDays,
} from "lucide-react";

import "./VisualizeSection.css";

function VisualizeSection() {

  return (

    <div className="visualize-page">

      <div className="visualize-header">

        <h2>

          📊 Financial Analytics

        </h2>

        <p>

          Understand where your money comes from and where it goes.

        </p>

      </div>

      <div className="analytics-grid">

        <div className="analytics-card">

          <PieChart size={40} />

          <h3>Income Breakdown</h3>

          <p>

            Salary, Business, Gift, Investment

          </p>

        </div>

        <div className="analytics-card">

          <Wallet size={40} />

          <h3>Expense Categories</h3>

          <p>

            Food, Bills, Shopping, Travel

          </p>

        </div>

        <div className="analytics-card">

          <Target size={40} />

          <h3>Savings Analysis</h3>

          <p>

            Bank, Cash, Emergency, Stocks

          </p>

        </div>

        <div className="analytics-card">

          <TrendingUp size={40} />

          <h3>Cash Flow</h3>

          <p>

            Income vs Expense vs Savings

          </p>

        </div>

        <div className="analytics-card">

          <CalendarDays size={40} />

          <h3>Monthly Report</h3>

          <p>

            Month by Month Comparison

          </p>

        </div>

        <div className="analytics-card">

          <BarChart3 size={40} />

          <h3>Financial Health</h3>

          <p>

            Savings Rate & Spending Score

          </p>

        </div>

      </div>

    </div>

  );

}

export default VisualizeSection;