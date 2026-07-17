import { Menu, X } from "lucide-react";

import "./Topbar.css";

function Topbar({

    menuOpen,

    setMenuOpen,

    user,

    onProfileClick,

}) {

    const profileLetter =

        user?.displayName?.charAt(0).toUpperCase() ||

        user?.fullName?.charAt(0).toUpperCase() ||

        "👤";

    function handleToggleMenu() {

        setMenuOpen(!menuOpen);

    }

    return (

        <header className="topbar">

            {/* ================= LEFT ================= */}

            <div className="topbar-left">

                <button

                    className="menu-btn"

                    onClick={handleToggleMenu}

                    aria-label="Toggle Sidebar"

                >

                    {

                        menuOpen

                            ?

                            <X size={22} />

                            :

                            <Menu size={22} />

                    }

                </button>

            </div>

            {/* ================= RIGHT ================= */}

            <div className="topbar-right">

                <button

                    className="profile-btn"

                    type="button"

                    title="My Profile"

                    onClick={onProfileClick}

                >

                    {

                        user?.photoURL

                            ?

                            <img

                                src={user.photoURL}

                                alt="Profile"

                                className="profile-image"

                            />

                            :

                            <span className="profile-letter">

                                {profileLetter}

                            </span>

                    }

                </button>

            </div>

        </header>

    );

}

export default Topbar;