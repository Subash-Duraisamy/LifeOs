import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../../firebase/firebase";

import { useAuth } from "../../../hooks/useAuth";

import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "../../../services/friendService";

function RequestCard() {

  const { user } = useAuth();

  const [requests, setRequests] = useState([]);

  useEffect(() => {

    const q = query(
      collection(db, "friendRequests"),
      where("toUid", "==", user.uid),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {

        setRequests(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
        );

      }
    );

    return unsubscribe;

  }, [user.uid]);

  async function handleAccept(request) {

    try {

      await acceptFriendRequest(
        request.id,
        request,
        user
      );

      alert("Friend added successfully.");

    } catch (error) {

      console.error(error);

      alert("Failed to accept request.");

    }

  }

  async function handleReject(request) {

    try {

      await rejectFriendRequest(
        request.id
      );

    } catch (error) {

      console.error(error);

      alert("Failed to reject request.");

    }

  }

  return (

    <div>

      {

        requests.length === 0 &&

        <p>No friend requests.</p>

      }

      {

        requests.map(request => (

          <div

            key={request.id}

            style={{

              display: "flex",

              justifyContent: "space-between",

              alignItems: "center",

              border: "1px solid #ddd",

              padding: 20,

              borderRadius: 12,

              marginBottom: 15,

            }}

          >

            <div

              style={{

                display: "flex",

                alignItems: "center",

                gap: 15,

              }}

            >

              <img

                src={
                  request.fromPhoto ||
                  `https://ui-avatars.com/api/?name=${request.fromName}`
                }

                width="60"

                height="60"

                alt=""

                style={{

                  borderRadius: "50%",

                }}

              />

              <div>

                <h3>{request.fromName}</h3>

                <p>@{request.fromUsername}</p>

              </div>

            </div>

            <div>

              <button
                onClick={() =>
                  handleAccept(request)
                }
              >
                Accept
              </button>

              {" "}

              <button
                onClick={() =>
                  handleReject(request)
                }
              >
                Reject
              </button>

            </div>

          </div>

        ))

      }

    </div>

  );

}

export default RequestCard;