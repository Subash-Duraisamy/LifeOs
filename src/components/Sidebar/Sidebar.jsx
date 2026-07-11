import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  CheckSquare,
  Library,
  FileText,
  Shield,
  Wallet,
  CalendarDays,
  User,
  Settings,
  LogOut,
  X,
  Users,
} from "lucide-react";

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

    }

    catch (error) {

      alert(error.message);

    }

  }

  return (

    <>

      <aside
        className={`sidebar ${menuOpen ? "open" : ""}`}
      >

        {/* ================= HEADER ================= */}

        <div className="sidebar-header">

          <h2 className="logo">

            LifeOS

          </h2>

          <button
            className="close-btn"
            onClick={() => setMenuOpen(false)}
          >

            <X size={22} />

          </button>

        </div>

        {/* ================= MENU ================= */}

        <nav className="sidebar-menu">

          <NavLink
            to="/dashboard"
            onClick={closeMenu}
          >

            <LayoutDashboard size={20} />

            Dashboard

          </NavLink>

          <NavLink
            to="/tasks"
            onClick={closeMenu}
          >

            <CheckSquare size={20} />

            Tasks

          </NavLink>

          <NavLink
            to="/library"
            onClick={closeMenu}
          >

            <Library size={20} />

            My Library

          </NavLink>

<NavLink
  to="/finance"
  onClick={closeMenu}
>

  <Wallet size={20} />

  Finance

</NavLink>
          <NavLink
            to="/notes"
            onClick={closeMenu}
          >

            <FileText size={20} />

            Notes

          </NavLink>

          {/* <NavLink
            to="/journal"
            onClick={closeMenu}
          >

            <BookOpen size={20} />

            Journal

          </NavLink> */}

          <NavLink
            to="/vault"
            onClick={closeMenu}
          >

            <Shield size={20} />

            Secure Vault

          </NavLink>


          <NavLink
            to="/expenses"
            onClick={closeMenu}
          >

            <Wallet size={20} />

            Expenses

          </NavLink>

          <NavLink
            to="/calendar"
            onClick={closeMenu}
          >

            <CalendarDays size={20} />

            Calendar

          </NavLink>
          <NavLink
  to="/friends"
  onClick={closeMenu}
>
  <Users size={20} />
  Friends Hub
</NavLink>

        

          <NavLink
            to="/profile"
            onClick={closeMenu}
          >

            <User size={20} />

            My Space

          </NavLink>

          <NavLink
            to="/settings"
            onClick={closeMenu}
          >

            <Settings size={20} />

            Settings

          </NavLink>

        </nav>

        {/* ================= FOOTER ================= */}

        <div className="sidebar-footer">

          <button
            className="logout-btn"
            onClick={() =>
              setShowLogoutModal(true)
            }
          >

            <LogOut size={20} />

            Logout

          </button>

        </div>

      </aside>

      {/* ================= LOGOUT MODAL ================= */}

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