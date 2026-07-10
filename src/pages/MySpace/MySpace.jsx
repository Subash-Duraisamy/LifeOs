import { useState } from "react";

import "./MySpace.css";

import PersonalTab from "./components/PersonalTab";
import SizesTab from "./components/SizesTab";
import WardrobeTab from "./components/WardrobeTab";

function MySpace() {
  const [activeTab, setActiveTab] = useState("personal");

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
          <PersonalTab />
        )}

        {activeTab === "sizes" && (
          <SizesTab />
        )}

        {activeTab === "wardrobe" && (
          <WardrobeTab />
        )}

      </div>

    </div>
  );
}

export default MySpace;