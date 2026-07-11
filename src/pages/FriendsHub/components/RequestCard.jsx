import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../../firebase/firebase";
import { useAuth } from "../../../hooks/useAuth";

function RequestCard() {

  const { user } = useAuth();

  const [requests, setRequests] = useState([]);

  useEffect(() => {

    const q = query(
      collection(db, "friendRequests"),
      where("toUid", "==", user.uid),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      setRequests(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );

    });

    return () => unsubscribe();

  }, [user.uid]);

  async function acceptRequest(request) {

    // update request status
    await updateDoc(
      doc(db, "friendRequests", request.id),
      {
        status: "accepted"
      }
    );

    // Friend for current user
    await addDoc(
      collection(db, "friends"),
      {
        uid: user.uid,

        friendUid: request.fromUid,
        friendName: request.fromName,
        friendUsername: request.fromUsername,
        friendPhoto: request.fromPhoto,

        createdAt: serverTimestamp(),
      }
    );

    // Friend for sender
    await addDoc(
      collection(db, "friends"),
      {
        uid: request.fromUid,

        friendUid: user.uid,
        friendName: user.fullName,
        friendUsername: user.username,
        friendPhoto: user.photoURL,

        createdAt: serverTimestamp(),
      }
    );

    alert("Friend added successfully.");

  }

  async function rejectRequest(request) {

    await updateDoc(
      doc(db, "friendRequests", request.id),
      {
        status: "rejected"
      }
    );

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
              marginBottom: 15
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 15
              }}
            >

              <img
                src={
                  request.fromPhoto ||
                  "https://ui-avatars.com/api/?name=" +
                    request.fromName
                }
                width="60"
                height="60"
                alt=""
                style={{
                  borderRadius: "50%"
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
                  acceptRequest(request)
                }
              >
                Accept
              </button>

              {" "}

              <button
                onClick={() =>
                  rejectRequest(request)
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