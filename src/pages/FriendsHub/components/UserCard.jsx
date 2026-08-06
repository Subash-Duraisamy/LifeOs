import "./UserCard.css";

function UserCard({
  user,
  onAddFriend,
}) {

  return (

    <div className="user-card">

      <div className="user-left">

        <img
          src={
            user.photoURL ||
            "https://ui-avatars.com/api/?name=" +
              user.fullName
          }
          alt={user.fullName}
        />

        <div>

          <h3>{user.fullName}</h3>

          <p>@{user.username}</p>

        </div>

      </div>

      <button
        className="add-btn"
        onClick={() =>
          onAddFriend(user)
        }
      >
        + Add Friend
      </button>

    </div>

  );

}

export default UserCard;