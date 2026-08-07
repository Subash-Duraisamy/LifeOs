import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import './RequestCard.css'
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

  <div className="fr-container">

    {requests.length === 0 ? (

      <div className="fr-empty">

        <div className="fr-empty-icon">
          📭
        </div>

        <h2 className="fr-empty-title">
          No Friend Requests
        </h2>

        <p className="fr-empty-text">
          New friend requests will appear here.
        </p>

      </div>

    ) : (

      <div className="fr-list">

        {requests.map((request) => (

          <div
            key={request.id}
            className="fr-card"
          >

            {/* =====================
                LEFT
            ====================== */}

            <div className="fr-user">

              <img

                src={
                  request.fromPhoto ||
                  `https://ui-avatars.com/api/?name=${request.fromName}`
                }

                alt={request.fromName}

                className="fr-avatar"

              />

              <div className="fr-details">

                <h3 className="fr-name">

                  {request.fromName}

                </h3>

                <p className="fr-username">

                  @{request.fromUsername}

                </p>

              </div>

            </div>

            {/* =====================
                RIGHT
            ====================== */}

            <div className="fr-actions">

              <button

                className="fr-accept-btn"

                onClick={() =>
                  handleAccept(request)
                }

              >

                ✓ Accept

              </button>

              <button

                className="fr-reject-btn"

                onClick={() =>
                  handleReject(request)
                }

              >

                ✕ Reject

              </button>

            </div>

          </div>

        ))}

      </div>

    )}

  </div>

);

}

export default RequestCard;