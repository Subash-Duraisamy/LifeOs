import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../../../hooks/useAuth";

import {
  getUser,
  updateUserProfile,
} from "../../../services/authService";

import "./PersonalTab.css";

function PersonalTab() {

  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [data, setData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    height: "",
    weight: "",
  });

  useEffect(() => {

    async function loadProfile() {

      if (!user) return;

      try {

        const profile = await getUser(user.uid);

        if (!profile) return;

        setData({

          fullName: profile.fullName || "",

          dob: profile.dob || "",

          gender: profile.gender || "",

          height: profile.height || "",

          weight: profile.weight || "",

        });

      } catch (error) {

        console.error(error);

      }

    }

    loadProfile();

  }, [user]);
    function handleChange(e) {

    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

  }

  async function handleSave() {

    if (!user) return;

    try {

      await updateUserProfile(user.uid, {

        fullName: data.fullName.trim(),

        dob: data.dob,

        gender: data.gender,

        height:
          data.height === ""
            ? ""
            : Number(data.height),

        weight:
          data.weight === ""
            ? ""
            : Number(data.weight),

      });

      alert("Profile updated successfully.");

      setIsEditing(false);

    } catch (error) {

      console.error(error);

      alert(error.message);

    }

  }

  const age = useMemo(() => {

    if (!data.dob) return "";

    const birth = new Date(data.dob);

    const today = new Date();

    let years =
      today.getFullYear() -
      birth.getFullYear();

    const month =
      today.getMonth() -
      birth.getMonth();

    if (
      month < 0 ||
      (month === 0 &&
        today.getDate() <
          birth.getDate())
    ) {
      years--;
    }

    return years;

  }, [data.dob]);

  const bmi = useMemo(() => {

    const h = Number(data.height);

    const w = Number(data.weight);

    if (!h || !w) return "";

    return (
      w /
      Math.pow(h / 100, 2)
    ).toFixed(1);

  }, [data.height, data.weight]);
    return (

    <div className="space-card">

      <div className="card-header">

        <h2>👤 Personal Information</h2>

        {!isEditing ? (

          <button
            className="edit-btn"
            onClick={() =>
              setIsEditing(true)
            }
          >
            Edit
          </button>

        ) : (

          <button
            className="save-btn"
            onClick={handleSave}
          >
            Save
          </button>

        )}

      </div>

      <div className="profile-grid">

        <div className="input-group">

          <label>Full Name</label>

          <input
            type="text"
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Enter your name"
          />

        </div>

        <div className="input-group">

          <label>Date of Birth</label>

          <input
            type="date"
            name="dob"
            value={data.dob}
            onChange={handleChange}
            disabled={!isEditing}
          />

        </div>

        <div className="input-group">

          <label>Age</label>

          <input
            value={age}
            disabled
          />

        </div>

        <div className="input-group">

          <label>Gender</label>

          <select
            name="gender"
            value={data.gender}
            onChange={handleChange}
            disabled={!isEditing}
          >

            <option value="">
              Select Gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>

            <option value="Other">
              Other
            </option>

          </select>

        </div>

        <div className="input-group">

          <label>Height (cm)</label>

          <input
            type="number"
            name="height"
            value={data.height}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="174"
          />

        </div>

        <div className="input-group">

          <label>Weight (kg)</label>

          <input
            type="number"
            name="weight"
            value={data.weight}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="68"
          />

        </div>

        <div className="input-group">

          <label>BMI</label>

          <input
            value={bmi}
            disabled
            placeholder="Auto Calculated"
          />

        </div>

      </div>

    </div>

  );

}

export default PersonalTab;