import { useEffect, useState } from "react";

import "./InviteFriendsModal.css";

import { getFriends } from "../../../services/friendService";

import {
  sendGameInvite,
  generateRoomId,
} from "../../../services/gameService";

import { useAuth } from "../../../hooks/useAuth";

function InviteFriendsModal({

  open,

  onClose,

}) {

  const { user } = useAuth();

  const [friends, setFriends] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (!open) return;

    loadFriends();

  }, [open]);

  async function loadFriends() {

    try {

      setLoading(true);

      const data =
        await getFriends(user);

      setFriends(data);

    }

    catch (error) {

      console.log(error);

    }

    finally {

      setLoading(false);

    }

  }

  async function invite(friend) {

    try {

      await sendGameInvite({

        game: "ludo",

        roomId: generateRoomId(),

        fromUser: user,

        toUser: friend,

      });

      alert(
        "Invitation Sent"
      );

    }

    catch (error) {

      alert(error.message);

    }

  }

  if (!open) return null;

  return (

    <div className="invite-overlay">

      <div className="invite-modal">

        <div className="invite-header">

          <h2>

            Invite Friends

          </h2>

          <button
            onClick={onClose}
          >

            ✕

          </button>

        </div>

        {loading ? (

          <p>

            Loading...

          </p>

        ) : friends.length === 0 ? (

          <p>

            No friends found.

          </p>

        ) : (

          friends.map(friend => (

            <div

              className="friend-row"

              key={friend.uid}

            >

              <div>

                <h4>

                  {friend.fullName}

                </h4>

                <small>

                  @{friend.username}

                </small>

              </div>

              <button
                onClick={() =>
                  invite(friend)
                }
              >

                Invite

              </button>

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default InviteFriendsModal;