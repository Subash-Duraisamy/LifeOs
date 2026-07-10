import "./VaultToolbar.css";

function VaultToolbar({

  search,
  setSearch,

  category,
  setCategory,

  sortBy,
  setSortBy,

  groupBy,
  setGroupBy,

  favoritesOnly,
  setFavoritesOnly,

  totalCredentials,

  onAdd,

}) {

  return (

    <div className="vault-toolbar">

      <div className="toolbar-left">

        <div className="toolbar-search">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search app, username..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      <div className="toolbar-right">

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >

          <option value="All">
            All Categories
          </option>

          <option value="General">
            General
          </option>

          <option value="Social">
            Social
          </option>

          <option value="Development">
            Development
          </option>

          <option value="Banking">
            Banking
          </option>

          <option value="Shopping">
            Shopping
          </option>

          <option value="Entertainment">
            Entertainment
          </option>

          <option value="Education">
            Education
          </option>

        </select>

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
        >

          <option value="A-Z">
            Sort : A → Z
          </option>

          <option value="Z-A">
            Sort : Z → A
          </option>

          <option value="Newest">
            Newest
          </option>

          <option value="Oldest">
            Oldest
          </option>

        </select>

        <select
          value={groupBy}
          onChange={(e) =>
            setGroupBy(e.target.value)
          }
        >

          <option value="None">
            No Group
          </option>

          <option value="Category">
            Group by Category
          </option>

        </select>

        <button

          className={
            favoritesOnly
              ? "favorite-filter active"
              : "favorite-filter"
          }

          onClick={() =>
            setFavoritesOnly(
              !favoritesOnly
            )
          }

        >

          ⭐ Favorites

        </button>

        <button
          className="add-credential-btn"
          onClick={onAdd}
        >

          ➕ Add Credential

        </button>

      </div>

      <div className="toolbar-footer">

        <span>

          {totalCredentials}

          {" "}Credential

          {totalCredentials !== 1 && "s"}

        </span>

      </div>

    </div>

  );

}

export default VaultToolbar;