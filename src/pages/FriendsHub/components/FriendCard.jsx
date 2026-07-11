import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../../firebase/firebase";

import { useAuth } from "../../../hooks/useAuth";

import {
  removeFriend,
} from "../../../services/friendService";

function FriendCard() {

  const { user } = useAuth();

  const [friends, setFriends] = useState([]);

  useEffect(() => {

    const q = query(
      collection(db, "friends"),
      where("users", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {

        const list = snapshot.docs.map((document) => {

          const data = document.data();

          const friend =
            data.user1.uid === user.uid
              ? data.user2
              : data.user1;

          return {

            id: document.id,

            friendUid: friend.uid,

            friendName: friend.fullName,

            friendUsername: friend.username,

            friendPhoto: friend.photoURL,

          };

        });

        setFriends(list);

      }
    );

    return unsubscribe;

  }, [user.uid]);

  async function removeFriendHandler(friend) {

    const ok = window.confirm(
      `Remove ${friend.friendName} from friends?`
    );

    if (!ok) return;

    try {

      await removeFriend(
        user.uid,
        friend.friendUid
      );

      alert("Friend removed successfully.");

    } catch (error) {

      console.error(error);

      alert("Failed to remove friend.");

    }

  }

  if (friends.length === 0) {

    return (

      <div>

        <h3>No Friends Yet 😔</h3>

      </div>

    );

  }

  return (

    <div>

      {

        friends.map(friend => (

          <div

            key={friend.id}

            style={{

              display: "flex",

              justifyContent: "space-between",

              alignItems: "center",

              padding: "18px",

              border: "1px solid #ddd",

              borderRadius: "12px",

              marginBottom: "16px",

            }}

          >

            <div

              style={{

                display: "flex",

                alignItems: "center",

                gap: "16px",

              }}

            >

              <img

                src={
                  friend.friendPhoto ||
                  `https://ui-avatars.com/api/?name=${friend.friendName}`
                }

                width="60"

                height="60"

                alt=""

                style={{

                  borderRadius: "50%",

                }}

              />

              <div>

                <h3>{friend.friendName}</h3>

                <p>@{friend.friendUsername}</p>

              </div>

            </div>

            <button
              onClick={() =>
                removeFriendHandler(friend)
              }
            >
              Remove
            </button>

          </div>

        ))

      }

    </div>

  );

}

export default FriendCard;