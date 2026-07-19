import { useEffect, useState } from "react";

import "./MySpace.css";

import PersonalTab from "./components/PersonalTab";
import SizesTab from "./components/SizesTab";
import WardrobeTab from "./components/WardrobeTab";
import WomensHealthTab from "./components/WomensHealthTab";

import { useAuth } from "../../hooks/useAuth";
import { getUser } from "../../services/authService";

import SuccessModal from "../../components/ui/SuccessModal";

function MySpace() {

    const { user } = useAuth();

    const [profile, setProfile] = useState(null);

    const [activeTab, setActiveTab] = useState("personal");

    const [showSuccess, setShowSuccess] = useState(false);

    const [successTitle, setSuccessTitle] = useState("");

    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {

        async function loadProfile() {

            if (!user) return;

            try {

                const data = await getUser(user.uid);

                setProfile(data);

            }

            catch (error) {

                console.log(error);

            }

        }

        loadProfile();

    }, [user]);

    function openSuccess(title, message) {

        setSuccessTitle(title);

        setSuccessMessage(message);

        setShowSuccess(true);

    }

    const gender = profile?.gender;

    return (

        <div className="my-space">

            <div className="my-space-header">

                <h1>My Space</h1>

                <p>

                    Manage your personal information, body measurements, wardrobe and health.

                </p>

            </div>

            {/* ===========================
                TOP NAVIGATION
            =========================== */}

            <div className="my-space-tabs">

                <button
                    className={activeTab === "personal" ? "active" : ""}
                    onClick={() => setActiveTab("personal")}
                >
                    👤 Personal
                </button>

                <button
                    className={activeTab === "sizes" ? "active" : ""}
                    onClick={() => setActiveTab("sizes")}
                >
                    📏 Sizes
                </button>

                <button
                    className={activeTab === "wardrobe" ? "active" : ""}
                    onClick={() => setActiveTab("wardrobe")}
                >
                    👕 Wardrobe
                </button>

                {gender === "Female" && (

                    <button
                        className={activeTab === "womenHealth" ? "active" : ""}
                        onClick={() => setActiveTab("womenHealth")}
                    >
                        🌸 Women's Health
                    </button>

                )}

                {gender === "Male" && (

                    <button
                        className={activeTab === "buddy" ? "active" : ""}
                        onClick={() => setActiveTab("buddy")}
                    >
                        🤝 Buddy
                    </button>

                )}

            </div>

            {/* ===========================
                CONTENT
            =========================== */}

            <div className="my-space-content">

                {activeTab === "personal" && (

                    <PersonalTab
                        openSuccess={openSuccess}
                    />

                )}

                {activeTab === "sizes" && (

                    <SizesTab
                        openSuccess={openSuccess}
                    />

                )}

                {activeTab === "wardrobe" && (

                    <WardrobeTab
                        openSuccess={openSuccess}
                    />

                )}

                {activeTab === "womenHealth" && (

                    <WomensHealthTab
                        openSuccess={openSuccess}
                    />

                )}

                {activeTab === "buddy" && (

                    <div className="coming-soon">

                        <h2>🤝 Buddy</h2>

                        <p>Buddy module is coming soon.</p>

                    </div>

                )}

            </div>

            <SuccessModal

                open={showSuccess}

                title={successTitle}

                message={successMessage}

                onClose={() => setShowSuccess(false)}

            />

        </div>

    );

}

export default MySpace;