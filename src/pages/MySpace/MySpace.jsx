import { useState } from "react";

import "./MySpace.css";

import PersonalTab from "./components/PersonalTab";
import SizesTab from "./components/SizesTab";
import WardrobeTab from "./components/WardrobeTab";

import SuccessModal from "../../components/ui/SuccessModal";

function MySpace() {

  const [activeTab, setActiveTab] = useState("personal");

  const [showSuccess, setShowSuccess] = useState(false);

  const [successTitle, setSuccessTitle] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  function openSuccess(title, message) {

    setSuccessTitle(title);

    setSuccessMessage(message);

    setShowSuccess(true);

  }

  return (

    <div className="my-space">

      <div className="my-space-header">

        <h1>My Space</h1>

        <p>
          Manage your personal information, body measurements and wardrobe.
        </p>

      </div>

      {/* Top Navigation */}

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

      </div>

      {/* Content */}

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