import {
  Plus,
  BarChart3,
  Search,
  ArrowUpDown,
  Filter,
} from "lucide-react";

import "./FinanceToolbar.css";

function FinanceToolbar({

  onAdd,

  onVisualize,

  search,

  setSearch,

  typeFilter,

  setTypeFilter,

  sortBy,

  setSortBy,

}) {

  return (

    <div className="finance-toolbar">

      <div className="toolbar-left">

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by category or notes..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      <div className="toolbar-center">

        <div className="filter-box">

          <Filter size={18} />

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
          >

            <option value="all">
              All Types
            </option>

            <option value="income">
              Income
            </option>

            <option value="expense">
              Expense
            </option>

            <option value="saving">
              Savings
            </option>

          </select>

        </div>

        <div className="filter-box">

          <ArrowUpDown size={18} />

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >

            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>

            <option value="highest">
              Highest Amount
            </option>

            <option value="lowest">
              Lowest Amount
            </option>

            <option value="az">
              Category A-Z
            </option>

            <option value="za">
              Category Z-A
            </option>

          </select>

        </div>

      </div>

      <div className="toolbar-right">

        <button
          className="visualize-btn"
          onClick={onVisualize}
        >

          <BarChart3 size={18} />

          Visualize

        </button>

        <button
          className="add-btn"
          onClick={onAdd}
        >

          <Plus size={18} />

          Add Transaction

        </button>

      </div>

    </div>

  );

}

export default FinanceToolbar;