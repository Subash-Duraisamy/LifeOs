import { useEffect, useState } from "react";

import { useAuth } from "../../../hooks/useAuth";

import {
  searchUsers,
  sendFriendRequest,
} from "../../../services/friendService";

function SearchUsers() {

  const { user } = useAuth();

  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([]);

  useEffect(() => {

    async function load() {

      if (!search.trim()) {

        setUsers([]);

        return;

      }

      const data =
        await searchUsers(search);

      setUsers(data);

    }

    load();

  }, [search]);

  async function handleAddFriend(friend) {

    await sendFriendRequest(
      user,
      friend
    );

    alert("Friend request sent.");

  }

  return (

    <div>

      <input

        placeholder="Search username..."

        value={search}

        onChange={(e)=>
          setSearch(e.target.value)
        }

      />

      <br/>

      <br/>

      {

        users

          .filter(
            item=>item.uid!==user.uid
          )

          .map(friend=>(

            <div

              key={friend.uid}

              style={{

                display:"flex",

                alignItems:"center",

                gap:20,

                marginBottom:20,

                border:"1px solid #ddd",

                padding:15,

                borderRadius:12

              }}

            >

              <img

                src={
                  friend.photoURL ||
                  "https://ui-avatars.com/api/?name="+friend.fullName
                }

                width="60"

                height="60"

                alt=""

                style={{

                  borderRadius:"50%"

                }}

              />

              <div
                style={{
                  flex:1
                }}
              >

                <h3>

                  {friend.fullName}

                </h3>

                <p>

                  @{friend.username}

                </p>

              </div>

              <button

                onClick={()=>
                  handleAddFriend(friend)
                }

              >

                Add Friend

              </button>

            </div>

          ))

      }

    </div>

  );

}

export default SearchUsers;