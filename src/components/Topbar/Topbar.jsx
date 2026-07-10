import "./Topbar.css";

function Topbar({
  setMenuOpen,
  pageTitle = "Dashboard",
  user,
  onProfileClick,
}) {

  const profileLetter =
    user?.displayName?.charAt(0).toUpperCase() ||
    user?.fullName?.charAt(0).toUpperCase() ||
    "👤";

  return (
    <header className="topbar">

      {/* Left */}

      <div className="topbar-left">

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>

        <h2 className="page-title">
          {pageTitle}
        </h2>

      </div>

      {/* Right */}

      <div className="topbar-right">

        <button
          className="profile-btn"
          type="button"
          title="My Profile"
          onClick={() => {
            if (onProfileClick) {
              onProfileClick();
            }
          }}
        >

          {user?.photoURL ? (

            <img
              src={user.photoURL}
              alt="Profile"
              className="profile-image"
            />

          ) : (

            <span className="profile-letter">
              {profileLetter}
            </span>

          )}

        </button>

      </div>

    </header>
  );
}

export default Topbar;