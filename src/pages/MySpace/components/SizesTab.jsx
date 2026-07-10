import { useEffect, useState } from "react";

import { useAuth } from "../../../hooks/useAuth";

import {
  getUser,
  updateUserProfile,
} from "../../../services/authService";

import "./SizesTab.css";

function SizesTab() {

  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const [sizes, setSizes] = useState({

    chest: "",

    waist: "",

    hip: "",

    shoulder: "",

    neck: "",

    sleeve: "",

    inseam: "",

    pantSize: "",

    shirtSize: "",

    tshirtSize: "",

    shoeSize: "",

  });

  useEffect(() => {

    async function loadSizes() {

      if (!user) return;

      try {

        const profile = await getUser(user.uid);

        if (!profile) return;

        setSizes({

          chest: profile.chest || "",

          waist: profile.waist || "",

          hip: profile.hip || "",

          shoulder: profile.shoulder || "",

          neck: profile.neck || "",

          sleeve: profile.sleeve || "",

          inseam: profile.inseam || "",

          pantSize: profile.pantSize || "",

          shirtSize: profile.shirtSize || "",

          tshirtSize: profile.tshirtSize || "",

          shoeSize: profile.shoeSize || "",

        });

      }

      catch(error){

        console.error(error);

      }

    }

    loadSizes();

  }, [user]);
    function handleChange(e) {

    const { name, value } = e.target;

    setSizes((prev) => ({

      ...prev,

      [name]: value,

    }));

  }

  async function handleSave() {

    if (!user) return;

    try {

      await updateUserProfile(user.uid, {

        chest:
          sizes.chest === ""
            ? ""
            : Number(sizes.chest),

        waist:
          sizes.waist === ""
            ? ""
            : Number(sizes.waist),

        hip:
          sizes.hip === ""
            ? ""
            : Number(sizes.hip),

        shoulder:
          sizes.shoulder === ""
            ? ""
            : Number(sizes.shoulder),

        neck:
          sizes.neck === ""
            ? ""
            : Number(sizes.neck),

        sleeve:
          sizes.sleeve === ""
            ? ""
            : Number(sizes.sleeve),

        inseam:
          sizes.inseam === ""
            ? ""
            : Number(sizes.inseam),

        pantSize: sizes.pantSize,

        shirtSize: sizes.shirtSize,

        tshirtSize: sizes.tshirtSize,

        shoeSize: sizes.shoeSize,

      });

      const latest = await getUser(user.uid);

      if (latest) {

        setSizes({

          chest: latest.chest || "",

          waist: latest.waist || "",

          hip: latest.hip || "",

          shoulder: latest.shoulder || "",

          neck: latest.neck || "",

          sleeve: latest.sleeve || "",

          inseam: latest.inseam || "",

          pantSize: latest.pantSize || "",

          shirtSize: latest.shirtSize || "",

          tshirtSize: latest.tshirtSize || "",

          shoeSize: latest.shoeSize || "",

        });

      }

      setIsEditing(false);

      alert("Sizes updated successfully.");

    }

    catch (error) {

      console.error(error);

      alert(error.message);

    }

  }
    return (
    <div className="space-card">

      <div className="card-header">

        <h2>📏 Body Measurements & Sizes</h2>

        {!isEditing ? (

          <button
            className="edit-btn"
            onClick={() => setIsEditing(true)}
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
          <label>Chest (cm)</label>

          <input
            type="number"
            name="chest"
            value={sizes.chest}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="94"
          />
        </div>

        <div className="input-group">
          <label>Waist (cm)</label>

          <input
            type="number"
            name="waist"
            value={sizes.waist}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="82"
          />
        </div>

        <div className="input-group">
          <label>Hip (cm)</label>

          <input
            type="number"
            name="hip"
            value={sizes.hip}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="94"
          />
        </div>

        <div className="input-group">
          <label>Shoulder (cm)</label>

          <input
            type="number"
            name="shoulder"
            value={sizes.shoulder}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="46"
          />
        </div>

        <div className="input-group">
          <label>Neck (cm)</label>

          <input
            type="number"
            name="neck"
            value={sizes.neck}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="39"
          />
        </div>

        <div className="input-group">
          <label>Sleeve Length (cm)</label>

          <input
            type="number"
            name="sleeve"
            value={sizes.sleeve}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="62"
          />
        </div>

        <div className="input-group">
          <label>Inseam (cm)</label>

          <input
            type="number"
            name="inseam"
            value={sizes.inseam}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="78"
          />
        </div>

        <div className="input-group">
          <label>Pant Size</label>

          <input
            type="text"
            name="pantSize"
            value={sizes.pantSize}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="32"
          />
        </div>

        <div className="input-group">
          <label>Shirt Size</label>

          <select
            name="shirtSize"
            value={sizes.shirtSize}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="">Select</option>
            <option>XS</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
            <option>XXL</option>
          </select>
        </div>

        <div className="input-group">
          <label>T-Shirt Size</label>

          <select
            name="tshirtSize"
            value={sizes.tshirtSize}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="">Select</option>
            <option>XS</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
            <option>XXL</option>
          </select>
        </div>

        <div className="input-group">
          <label>Shoe Size (UK)</label>

          <input
            type="text"
            name="shoeSize"
            value={sizes.shoeSize}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="9"
          />
        </div>

      </div>

    </div>
  );

}

export default SizesTab;