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

import FriendActions from "./FriendActions";

import "./FriendCard.css";

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

            }

            else {

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

    <div className="friends-list">

      {

        friends.length === 0 ? (

          <div className="no-friends">

            <h3>

              No Friends Yet 😔

            </h3>

          </div>

        ) : (

          friends.map(friend => (

            <div

              key={friend.id}

              className="friend-card"

            >

              <div className="friend-left">

                <img

                  className="friend-avatar"

                  src={

                    friend.friendPhoto ||

                    `https://ui-avatars.com/api/?name=${friend.friendName}`

                  }

                  alt={friend.friendName}

                />

                <div>

                  <h3 className="friend-name">

                    {friend.friendName}

                  </h3>

                  <p className="friend-username">

                    @{friend.friendUsername}

                  </p>

                </div>

              </div>



              <div className="friend-right">

                <FriendActions

                  friend={friend}

                />

                <button

                  className="remove-btn"

                  onClick={() =>

                    removeFriendHandler(friend)

                  }

                >

                  Remove

                </button>

              </div>

            </div>

          ))

        )

      }

    </div>

  );

}

export default FriendCard;