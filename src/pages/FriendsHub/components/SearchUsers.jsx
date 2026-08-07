import { useEffect, useState } from "react";

import { useAuth } from "../../../hooks/useAuth";
import './SearchUsers.css'
import {
  searchUsers,
  sendFriendRequest,
  checkFriend,
  checkFriendRequest,
} from "../../../services/friendService";



function SearchUsers() {

  const { user } = useAuth();

  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([]);

useEffect(() => {

  async function loadUsers() {

    const text = search.trim();

    if (!text) {

      setUsers([]);
      return;

    }

    try {

      const results = await searchUsers(text);

      const filtered = [];

      for (const friend of results) {

        if (friend.uid === user.uid) {
          continue;
        }

        console.log("================================");
        console.log("Checking:", friend.username);

        let isFriend = false;
        let pending = false;

        // -------------------------
        // CHECK FRIEND
        // -------------------------

        try {

          isFriend = await checkFriend(
            user.uid,
            friend.uid
          );

          console.log("isFriend:", isFriend);

        } catch (error) {

          console.error(
            "checkFriend FAILED",
            error
          );

        }

        // -------------------------
        // CHECK PENDING
        // -------------------------

        try {

          pending = await checkFriendRequest(
            user.uid,
            friend.uid
          );

          console.log("pending:", pending);

        } catch (error) {

          console.error(
            "checkFriendRequest FAILED",
            error
          );

        }

        if (!isFriend && !pending) {

          filtered.push(friend);

        }

      }

      setUsers(filtered);

    }

    catch (error) {

      console.error(
        "loadUsers FAILED",
        error
      );

    }

  }

  loadUsers();

}, [search, user.uid]);

  async function handleAddFriend(friend) {

    try {

      await sendFriendRequest(
        user,
        friend
      );

      alert("Friend request sent.");

      setUsers((prev) =>
        prev.filter(
          (item) => item.uid !== friend.uid
        )
      );

    } catch (error) {

      console.error(error);

      alert(error.message);

    }

  }
return (

  <div className="su-container">

    {/* ==========================
        SEARCH BAR
    ========================== */}

    <div className="su-search-box">

      <input
        className="su-search-input"
        placeholder="Search username..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

    </div>

    {/* ==========================
        EMPTY RESULT
    ========================== */}

    {users.length === 0 && search && (

      <div className="su-empty-state">

        <h3 className="su-empty-title">
          No Users Found 😔
        </h3>

        <p className="su-empty-text">
          Try searching with another username.
        </p>

      </div>

    )}

    {/* ==========================
        USER LIST
    ========================== */}

    <div className="su-users-list">

      {users.map((friend) => (

        <div
          key={friend.uid}
          className="su-user-card"
        >

          {/* Left */}

          <div className="su-user-info">

            <img

              src={
                friend.photoURL ||
                `https://ui-avatars.com/api/?name=${friend.fullName}`
              }

              alt={friend.fullName}

              className="su-user-avatar"

            />

            <div className="su-user-details">

              <h3 className="su-user-name">

                {friend.fullName}

              </h3>

              <p className="su-user-username">

                @{friend.username}

              </p>

            </div>

          </div>

          {/* Right */}

          <button

            className="su-add-btn"

            onClick={() =>
              handleAddFriend(friend)
            }

          >

            Add Friend

          </button>

        </div>

      ))}

    </div>

  </div>

);

}

export default SearchUsers;