import { useEffect, useState } from "react";

import { useAuth } from "../../../hooks/useAuth";

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

    <div>

      <input

        placeholder="Search username..."

        value={search}

        onChange={(e) =>
          setSearch(e.target.value)
        }

      />

      <br />
      <br />

      {

        users.length === 0 && search && (

          <p>No users found.</p>

        )

      }

      {

        users.map(friend => (

          <div

            key={friend.uid}

            style={{

              display: "flex",

              alignItems: "center",

              gap: 20,

              marginBottom: 20,

              border: "1px solid #ddd",

              padding: 15,

              borderRadius: 12,

            }}

          >

            <img

              src={
                friend.photoURL ||
                `https://ui-avatars.com/api/?name=${friend.fullName}`
              }

              width="60"

              height="60"

              alt=""

              style={{

                borderRadius: "50%",

              }}

            />

            <div
              style={{
                flex: 1,
              }}
            >

              <h3>{friend.fullName}</h3>

              <p>@{friend.username}</p>

            </div>

            <button

              onClick={() =>
                handleAddFriend(friend)
              }

            >

              Add Friend

            </button>

          </div>

        ))

      }

    </div>

  );

}

export default SearchUsers;