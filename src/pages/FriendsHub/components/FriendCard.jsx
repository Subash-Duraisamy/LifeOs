import { useEffect, useState } from "react";


import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import './FriendCard.css'


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


async (snapshot) => {


  const friendsList = await Promise.all(


    snapshot.docs.map(async (document) => {


      const data = document.data();


      // Get the friend's UID (the one that isn't me)
      const friendUid = data.users.find(
        uid => uid !== user.uid
      );


      // Read the latest profile from users collection
      const friendSnap = await getDoc(
        doc(db, "users", friendUid)
      );


      if (!friendSnap.exists()) {
        return null;
      }


      const friend = friendSnap.data();


      return {
        id: document.id,
        friendUid,
        friendName: friend.fullName,
        friendUsername: friend.username,
        friendPhoto: friend.photoURL || "",
      };


    })


  );


  setFriends(friendsList.filter(Boolean));


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


}return (

  <>

    {friends.length === 0 ? (

      <div className="fh-empty-state">

        <h3 className="fh-empty-title">
          No Friends Yet 😔
        </h3>

        <p className="fh-empty-text">
          Start connecting with people to build your friends list.
        </p>

      </div>

    ) : (

      <div className="fh-friends-list">

        {friends.map((friend) => (

          <div
            key={friend.id}
            className="fh-friend-card"
          >

            {/* Left Side */}

            <div className="fh-friend-info">

              <img
                src={
                  friend.friendPhoto ||
                  `https://ui-avatars.com/api/?name=${friend.friendName}`
                }
                alt={friend.friendName}
                className="fh-friend-avatar"
              />

              <div className="fh-friend-details">

                <h3 className="fh-friend-name">
                  {friend.friendName}
                </h3>

                <p className="fh-friend-username">
                  @{friend.friendUsername}
                </p>

              </div>

            </div>

            {/* Right Side */}

            <button
              className="fh-remove-btn"
              onClick={() => removeFriendHandler(friend)}
            >
              Remove Friend
            </button>

          </div>

        ))}

      </div>

    )}

  </>

);

}

export default FriendCard;