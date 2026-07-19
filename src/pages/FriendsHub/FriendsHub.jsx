import { useState } from "react";

import SearchUsers from "./components/SearchUsers";
import FriendCard from "./components/FriendCard";
import RequestCard from "./components/RequestCard";

import "./FriendsHub.css";

function FriendsHub() {

    const [tab, setTab] = useState("search");

    return (

        <div className="friends-page">

            <h1 className="friends-title">
                👥 Friends Hub
            </h1>

            <div className="friends-tabs">

                <button
                    className={tab === "search" ? "active" : ""}
                    onClick={() => setTab("search")}
                >
                    🔍
                    <span>Search</span>
                </button>

                <button
                    className={tab === "requests" ? "active" : ""}
                    onClick={() => setTab("requests")}
                >
                    📨
                    <span>Requests</span>
                </button>

                <button
                    className={tab === "friends" ? "active" : ""}
                    onClick={() => setTab("friends")}
                >
                    👥
                    <span>Friends</span>
                </button>

            </div>

            <div className="friends-content">

                {tab === "search" && <SearchUsers />}

                {tab === "requests" && <RequestCard />}

                {tab === "friends" && <FriendCard />}

            </div>

        </div>

    );

}

export default FriendsHub;