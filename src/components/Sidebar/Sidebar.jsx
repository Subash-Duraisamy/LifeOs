import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import "./Sidebar.css";

import { logout } from "../../services/authService";
import ConfirmModal from "../../Modal/ConfirmModal";

function Sidebar({ menuOpen, setMenuOpen }) {
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const closeMenu = () => {
    if (window.innerWidth <= 768) {
      setMenuOpen(false);
    }
  };

  async function handleLogout() {
    try {
      await logout();

      setShowLogoutModal(false);

      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <>
      <aside
        className={`sidebar ${menuOpen ? "open" : ""}`}
      >
        <div className="sidebar-header">
          <h2 className="logo">LifeOS</h2>

          <button
            className="close-btn"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-menu">

          <NavLink
            to="/dashboard"
            onClick={closeMenu}
          >
            <span>🏠</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/tasks"
            onClick={closeMenu}
          >
            <span>✅</span>
            Tasks
          </NavLink>

          <NavLink
            to="/habits"
            onClick={closeMenu}
          >
            <span>🔥</span>
            Habits
          </NavLink>

          <NavLink
            to="/notes"
            onClick={closeMenu}
          >
            <span>📝</span>
            Notes
          </NavLink>

          <NavLink
            to="/journal"
            onClick={closeMenu}
          >
            <span>📖</span>
            Journal
          </NavLink>

          <NavLink
            to="/goals"
            onClick={closeMenu}
          >
            <span>🎯</span>
            Goals
          </NavLink>

          <NavLink
            to="/expenses"
            onClick={closeMenu}
          >
            <span>💰</span>
            Expenses
          </NavLink>

          <NavLink
            to="/calendar"
            onClick={closeMenu}
          >
            <span>📅</span>
            Calendar
          </NavLink>

          <NavLink
            to="/ai"
            onClick={closeMenu}
          >
            <span>🤖</span>
            AI Assistant
          </NavLink>

          <NavLink
  to="/profile"
  onClick={closeMenu}
>
  <span>👤</span>
 My Space
</NavLink>

          <NavLink
            to="/settings"
            onClick={closeMenu}
          >
            <span>⚙️</span>
            Settings
          </NavLink>

        </nav>

        <div className="sidebar-footer">

          <button
            className="logout-btn"
            onClick={() =>
              setShowLogoutModal(true)
            }
          >
            <span>↩</span>
            Logout
          </button>

        </div>

      </aside>

      <ConfirmModal
        open={showLogoutModal}
        title="Logout from LifeOS?"
        message="Your data is safely synced. You can sign back in anytime."
        confirmText="Logout"
        cancelText="Cancel"
        onCancel={() =>
          setShowLogoutModal(false)
        }
        onConfirm={handleLogout}
      />
    </>
  );
}

export default Sidebar;