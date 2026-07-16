import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";
import ProfileModal from "../components/ProfileModal/ProfileModal";

import InviteNotification from "../pages/Games/ludo/components/InviteNotification";

import { useAuth } from "../hooks/useAuth";

import {
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import "./MainLayout.css";

function MainLayout() {

  const [menuOpen, setMenuOpen] = useState(true);

  const [profileOpen, setProfileOpen] = useState(false);

  const {
    user,
    refreshUser,
  } = useAuth();

  async function handleSaveProfile(data) {

    try {

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      await updateDoc(userRef, {

        fullName: data.fullName,

        username: data.username,

        photoURL: data.photoURL,

        bio: data.bio,

        updatedAt: serverTimestamp(),

      });

      await refreshUser();

      alert("Profile updated successfully!");

      setProfileOpen(false);

    }

    catch (error) {

      console.error(error);

      alert("Failed to update profile.");

    }

  }

  function handleDeleteAccount() {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    alert("Delete account feature coming next.");

  }

  return (

    <>

      {menuOpen && (

        <div

          className="overlay"

          onClick={() => setMenuOpen(false)}

        />

      )}

      <div
        className={`layout ${
          menuOpen ? "sidebar-open" : "sidebar-close"
        }`}
      >

        <Sidebar

          menuOpen={menuOpen}

          setMenuOpen={setMenuOpen}

        />

        <main className="main">

          <Topbar

            menuOpen={menuOpen}

            setMenuOpen={setMenuOpen}

            pageTitle="Dashboard"

            user={user}

            onProfileClick={() =>
              setProfileOpen(true)
            }

          />

          <section className="content">

            <Outlet />

          </section>

        </main>

      </div>

      <ProfileModal

        open={profileOpen}

        user={user}

        onClose={() =>
          setProfileOpen(false)
        }

        onSave={handleSaveProfile}

        onDelete={handleDeleteAccount}

      />

      <InviteNotification />

    </>

  );

}

export default MainLayout;