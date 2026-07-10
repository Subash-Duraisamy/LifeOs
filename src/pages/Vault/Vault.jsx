import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../../hooks/useAuth";

import {
  getVault,
  createVault,
} from "../../services/vaultService";

import {
  getCredentials,
  addCredential,
  updateCredential,
  deleteCredential,
} from "../../services/credentialService";

import CredentialCard from "./components/CredentialCard";
import CredentialModal from "./components/CredentialModal";
import VaultToolbar from "./components/VaultToolbar";

import "./Vault.css";

function Vault() {

  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [hasAccessKey, setHasAccessKey] =
    useState(false);

  const [savedKey, setSavedKey] =
    useState("");

  const [isUnlocked, setIsUnlocked] =
    useState(false);

  const [credentials, setCredentials] =
    useState([]);

  const [showModal, setShowModal] =
    useState(false);

  const [editingCredential, setEditingCredential] =
    useState(null);

  const [accessKey, setAccessKey] =
    useState("");

  const [confirmKey, setConfirmKey] =
    useState("");

  const [enteredKey, setEnteredKey] =
    useState("");

  /* ===============================
      Toolbar States
  =============================== */

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("A-Z");

  const [groupBy, setGroupBy] =
    useState("None");

  const [favoritesOnly, setFavoritesOnly] =
    useState(false);

  /* ===============================
      Load Vault
  =============================== */

  useEffect(() => {

    async function loadVault() {

      if (!user) return;

      try {

        const vault =
          await getVault(user.uid);

        if (vault) {

          setHasAccessKey(true);

          setSavedKey(
            vault.accessKey
          );

        }

      }

      catch (error) {

        console.error(error);

      }

      finally {

        setLoading(false);

      }

    }

    loadVault();

  }, [user]);

  /* ===============================
      Load Credentials
  =============================== */

  async function loadCredentials() {

    if (!user) return;

    try {

      const data =
        await getCredentials(user.uid);

      setCredentials(data);

    }

    catch (error) {

      console.error(error);

    }

  }

  useEffect(() => {

    if (isUnlocked) {

      loadCredentials();

    }

  }, [isUnlocked]);

  /* ===============================
      Create Access Key
  =============================== */

  async function handleCreateKey() {

    if (!user) return;

    if (!accessKey.trim()) {

      alert("Please enter an Access Key.");

      return;

    }

    if (accessKey.length < 6) {

      alert(
        "Access Key must contain at least 6 characters."
      );

      return;

    }

    if (accessKey !== confirmKey) {

      alert("Access Keys do not match.");

      return;

    }

    try {

      await createVault(user.uid, {
        accessKey,
      });

      setSavedKey(accessKey);

      setHasAccessKey(true);

      setAccessKey("");

      setConfirmKey("");

      alert(
        "Access Key created successfully."
      );

    }

    catch (error) {

      console.error(error);

      alert(error.message);

    }

  }

  /* ===============================
      Unlock Vault
  =============================== */

  function handleUnlock() {

    if (!enteredKey.trim()) {

      alert(
        "Please enter your Access Key."
      );

      return;

    }

    if (enteredKey !== savedKey) {

      alert("Incorrect Access Key.");

      return;

    }

    setEnteredKey("");

    setIsUnlocked(true);

  }

  /* ===============================
      Save Credential
  =============================== */

  async function handleSaveCredential(data) {

    try {

      if (editingCredential) {

        await updateCredential(
          editingCredential.id,
          data
        );

      }

      else {

        await addCredential(
          user.uid,
          data
        );

      }

      setShowModal(false);

      setEditingCredential(null);

      await loadCredentials();

    }

    catch (error) {

      console.error(error);

      alert(error.message);

    }

  }

  /* ===============================
      Delete Credential
  =============================== */

  async function handleDeleteCredential(id) {

    const ok = window.confirm(
      "Delete this credential?"
    );

    if (!ok) return;

    try {

      await deleteCredential(id);

      await loadCredentials();

    }

    catch (error) {

      console.error(error);

      alert(error.message);

    }

  }

    /* ===============================
      Filter + Search + Sort
  =============================== */

  const filteredCredentials = useMemo(() => {

    let data = [...credentials];

    /* ---------- Search ---------- */

    if (search.trim()) {

      const keyword = search.toLowerCase();

      data = data.filter((item) =>

        item.appName
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.username
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.website
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.category
          ?.toLowerCase()
          .includes(keyword)

      );

    }

    /* ---------- Category ---------- */

    if (category !== "All") {

      data = data.filter(

        (item) =>

          item.category === category

      );

    }

    /* ---------- Favorites ---------- */

    if (favoritesOnly) {

      data = data.filter(

        (item) => item.favorite

      );

    }

    /* ---------- Sorting ---------- */

    switch (sortBy) {

      case "A-Z":

        data.sort((a, b) =>

          a.appName.localeCompare(
            b.appName
          )

        );

        break;

      case "Z-A":

        data.sort((a, b) =>

          b.appName.localeCompare(
            a.appName
          )

        );

        break;

      case "Newest":

        data.sort(

          (a, b) =>

            (b.createdAt?.seconds || 0)

            -

            (a.createdAt?.seconds || 0)

        );

        break;

      case "Oldest":

        data.sort(

          (a, b) =>

            (a.createdAt?.seconds || 0)

            -

            (b.createdAt?.seconds || 0)

        );

        break;

      default:

        break;

    }

    return data;

  }, [

    credentials,

    search,

    category,

    favoritesOnly,

    sortBy,

  ]);



  /* ===============================
      Group By Category
  =============================== */

  const groupedCredentials = useMemo(() => {

    if (groupBy !== "Category") {

      return null;

    }

    return filteredCredentials.reduce(

      (groups, item) => {

        const key =
          item.category || "General";

        if (!groups[key]) {

          groups[key] = [];

        }

        groups[key].push(item);

        return groups;

      },

      {}

    );

  }, [

    filteredCredentials,

    groupBy,

  ]);



  /* ===============================
      Loading
  =============================== */

  if (loading) {

    return (

      <div className="vault-page">

        <div className="vault-welcome">

          <h2>

            Loading Secure Vault...

          </h2>

        </div>

      </div>

    );

  }



  return (

    <div className="vault-page">

      <div className="vault-header">

        <div>

          <h1>

            🔐 Secure Vault

          </h1>

          <p>

            Store websites,

            usernames,

            passwords and other

            private credentials securely.

          </p>

        </div>

        <button className="vault-lock-btn">

          {

            isUnlocked

              ? "🔓 Unlocked"

              : "🔒 Locked"

          }

        </button>

      </div>
            {/* ===============================
          CREATE ACCESS KEY
      =============================== */}

      {!hasAccessKey && (

        <div className="vault-welcome">

          <div className="vault-icon">
            🛡️
          </div>

          <h2>
            Create Your Access Key
          </h2>

          <p>

            Create a secure Access Key to protect

            your personal vault.

          </p>

          <input

            className="vault-input"

            type="password"

            placeholder="Create Access Key"

            value={accessKey}

            onChange={(e) =>

              setAccessKey(e.target.value)

            }

          />

          <input

            className="vault-input"

            type="password"

            placeholder="Confirm Access Key"

            value={confirmKey}

            onChange={(e) =>

              setConfirmKey(e.target.value)

            }

          />

          <button

            className="unlock-btn"

            onClick={handleCreateKey}

          >

            🔐 Create Access Key

          </button>

        </div>

      )}



      {/* ===============================
          UNLOCK VAULT
      =============================== */}

      {hasAccessKey && !isUnlocked && (

        <div className="vault-welcome">

          <div className="vault-icon">
            🔒
          </div>

          <h2>

            Unlock Secure Vault

          </h2>

          <p>

            Enter your Access Key

            to continue.

          </p>

          <input

            className="vault-input"

            type="password"

            placeholder="Enter Access Key"

            value={enteredKey}

            onChange={(e) =>

              setEnteredKey(e.target.value)

            }

          />

          <button

            className="unlock-btn"

            onClick={handleUnlock}

          >

            🔓 Unlock Vault

          </button>

        </div>

      )}



      {/* ===============================
          UNLOCKED
      =============================== */}

      {isUnlocked && (

        <>

          <VaultToolbar

            search={search}

            setSearch={setSearch}

            category={category}

            setCategory={setCategory}

            sortBy={sortBy}

            setSortBy={setSortBy}

            groupBy={groupBy}

            setGroupBy={setGroupBy}

            favoritesOnly={favoritesOnly}

            setFavoritesOnly={setFavoritesOnly}

            totalCredentials={filteredCredentials.length}

            onAdd={() => {

              setEditingCredential(null);

              setShowModal(true);

            }}

          />
                    {filteredCredentials.length === 0 ? (

            <div className="empty-state">

              <h2>

                No Credentials Found

              </h2>

              <p>

                Click <b>Add Credential</b> to save your
                first website, username and password.

              </p>

            </div>

          ) : groupBy === "Category" ? (

            Object.keys(groupedCredentials).map(

              (group) => (

                <div
                  key={group}
                  className="credential-group-section"
                >

                  <div className="credential-group-header">

                    <h2>

                      {group}

                    </h2>

                    <span>

                      {

                        groupedCredentials[group]
                          .length

                      }

                      {" "}Credential

                      {

                        groupedCredentials[group]
                          .length > 1

                          && "s"

                      }

                    </span>

                  </div>

                  <div className="credentials-grid">

                    {

                      groupedCredentials[group].map(

                        (credential) => (

                          <CredentialCard

                            key={credential.id}

                            credential={credential}

                            onEdit={(item) => {

                              setEditingCredential(item);

                              setShowModal(true);

                            }}

                            onDelete={handleDeleteCredential}

                          />

                        )

                      )

                    }

                  </div>

                </div>

              )

            )

          ) : (

            <div className="credentials-grid">

              {

                filteredCredentials.map(

                  (credential) => (

                    <CredentialCard

                      key={credential.id}

                      credential={credential}

                      onEdit={(item) => {

                        setEditingCredential(item);

                        setShowModal(true);

                      }}

                      onDelete={handleDeleteCredential}

                    />

                  )

                )

              }

            </div>

          )}

        </>

      )}

      <CredentialModal

        open={showModal}

        credential={editingCredential}

        onClose={() => {

          setShowModal(false);

          setEditingCredential(null);

        }}

        onSave={handleSaveCredential}

      />

    </div>

  );

}

export default Vault;