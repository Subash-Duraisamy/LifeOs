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

  if (!user) return;

  const friendsQuery = query(

    collection(db, "friends"),

    where(
      "users",
      "array-contains",
      user.uid
    )

  );

  const unsubscribe = onSnapshot(

    friendsQuery,

    (snapshot) => {

      const friendsList = snapshot.docs.map(
        (document) => {

          const data = document.data();

          let friend;

          if (data.user1.uid === user.uid) {

            friend = data.user2;

          } else {

            friend = data.user1;

          }

          return {

            id: document.id,

            friendUid: friend.uid,

            friendName: friend.fullName,

            friendUsername: friend.username,

            friendPhoto: friend.photoURL || "",

          };

        }

      );

      setFriends(friendsList);

    },

    (error) => {

      console.error(
        "Friend Listener Error:",
        error
      );

    }

  );

  return () => unsubscribe();

}, [user]);
async function removeFriendHandler(friend) {

  const confirmRemove = window.confirm(

    `Are you sure you want to remove ${friend.friendName} from your friends?`

  );

  if (!confirmRemove) {

    return;

  }

  try {

    await removeFriend(

      user.uid,

      friend.friendUid

    );

    alert(

      `${friend.friendName} has been removed successfully.`

    );

  }

  catch (error) {

    console.error(

      "Remove Friend Error:",

      error

    );

    alert(

      "Unable to remove friend."

    );

  }

}
return (

  <div>

    {

      friends.length === 0 ? (

        <div>

          <h3>

            No Friends Yet 😔

          </h3>

        </div>

      ) : (

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

                alt={friend.friendName}

                style={{

                  borderRadius: "50%",

                  objectFit: "cover",

                }}

              />

              <div>

                <h3>

                  {friend.friendName}

                </h3>

                <p>

                  @{friend.friendUsername}

                </p>

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

      )

    }

  </div>

);

}
export default FriendCard;