import { useEffect, useState } from "react";

import { useAuth } from "../../../hooks/useAuth";

import {
  getWardrobe,
  saveWardrobe,
} from "../../../services/wardrobeService";

import Counter from "./Counter";

import "./WardrobeTab.css";

const defaultWardrobe = {

  pants: {
    Jeans: 0,
    Baggy: 0,
    Cargo: 0,
    Parallel: 0,
    Joggers: 0,
    Formal: 0,
    Chinos: 0,
  },

  shirts: {
    Formal: 0,
    Casual: 0,
    Linen: 0,
    Flannel: 0,
  },

  tshirts: {
    Oversized: 0,
    "Round Neck": 0,
    Polo: 0,
    Henley: 0,
    VNeck: 0,
  },

  hoodies: {
    Black: 0,
    White: 0,
    Printed: 0,
  },

  shoes: {
    Sneakers: 0,
    Running: 0,
    Formal: 0,
    Slippers: 0,
    Sandals: 0,
  },

  accessories: {
    Watch: 0,
    Belt: 0,
    Cap: 0,
    Sunglasses: 0,
    Wallet: 0,
  },

};

function WardrobeTab() {

  const { user } = useAuth();

  const [category, setCategory] = useState("pants");

  const [wardrobe, setWardrobe] = useState(null);

  useEffect(() => {

    async function loadWardrobe() {

      if (!user) return;

      try {

        let data = await getWardrobe(user.uid);

        if (!data) {

          await saveWardrobe(
            user.uid,
            defaultWardrobe
          );

          data = defaultWardrobe;

        }

        setWardrobe(data);

      }

      catch (error) {

        console.error(error);

      }

    }

    loadWardrobe();

  }, [user]);

  async function saveItem(itemName, newValue) {

    const updated = {

      ...wardrobe,

      [category]: {

        ...wardrobe[category],

        [itemName]: newValue,

      },

    };

    setWardrobe(updated);

    await saveWardrobe(
      user.uid,
      updated
    );

  }

  if (!wardrobe) {

    return (

      <div className="space-card">

        Loading Wardrobe...

      </div>

    );

  }
    return (

    <div className="space-card">

      <div className="card-header">

        <h2>Wardrobe Collection</h2>

      </div>

      <div className="wardrobe-tabs">

        <button
          className={
            category === "pants"
              ? "active"
              : ""
          }
          onClick={() =>
            setCategory("pants")
          }
        >
          👖 Pants
        </button>

        <button
          className={
            category === "shirts"
              ? "active"
              : ""
          }
          onClick={() =>
            setCategory("shirts")
          }
        >
          👔 Shirts
        </button>

        <button
          className={
            category === "tshirts"
              ? "active"
              : ""
          }
          onClick={() =>
            setCategory("tshirts")
          }
        >
          👕 T-Shirts
        </button>

        <button
          className={
            category === "hoodies"
              ? "active"
              : ""
          }
          onClick={() =>
            setCategory("hoodies")
          }
        >
          🧥 Hoodies
        </button>

        <button
          className={
            category === "shoes"
              ? "active"
              : ""
          }
          onClick={() =>
            setCategory("shoes")
          }
        >
          👟 Shoes
        </button>

        <button
          className={
            category === "accessories"
              ? "active"
              : ""
          }
          onClick={() =>
            setCategory("accessories")
          }
        >
          ⌚ Accessories
        </button>

      </div>

      <div className="wardrobe-list">

        {Object.entries(
          wardrobe[category]
        ).map(([name, count]) => (

          <Counter
            key={name}
            title={name}
            count={count}
            onSave={(newValue) =>
              saveItem(
                name,
                newValue
              )
            }
          />

        ))}

      </div>

    </div>

  );

}

export default WardrobeTab;