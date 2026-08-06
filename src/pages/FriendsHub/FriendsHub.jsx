import { useState } from "react";

import SearchUsers from "./components/SearchUsers";
import FriendCard from "./components/FriendCard";
import RequestCard from "./components/RequestCard";

import "./FriendsHub.css";

function FriendsHub() {

  const [tab, setTab] = useState("search");

  return (

    <div className="friends-page">

      <h1>👥 Friends Hub</h1>

      <div className="friends-tabs">

        <button
          className={tab==="search" ? "active" : ""}
          onClick={()=>setTab("search")}
        >
          Search
        </button>

        <button
          className={tab==="requests" ? "active" : ""}
          onClick={()=>setTab("requests")}
        >
          Requests
        </button>

        <button
          className={tab==="friends" ? "active" : ""}
          onClick={()=>setTab("friends")}
        >
          Friends
        </button>

      </div>

      {tab==="search" && <SearchUsers/>}

      {tab==="requests" && <RequestCard/>}

      {tab==="friends" && <FriendCard/>}

    </div>

  );

}

export default FriendsHub;