import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../../../firebase/firebase";

import { useAuth } from "../../../hooks/useAuth";

function FriendCard() {

  const { user } = useAuth();

  const [friends, setFriends] = useState([]);

  useEffect(() => {

    const q = query(
      collection(db, "friends"),
      where("uid", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      setFriends(

        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

      );

    });

    return () => unsubscribe();

  }, [user.uid]);

  async function removeFriend(friend) {

    if (
      !window.confirm(
        `Remove ${friend.friendName} from friends?`
      )
    ) {
      return;
    }

    await deleteDoc(
      doc(db, "friends", friend.id)
    );

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

              marginBottom: "16px"

            }}

          >

            <div

              style={{

                display: "flex",

                alignItems: "center",

                gap: "16px"

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

                  borderRadius: "50%"

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
                removeFriend(friend)
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