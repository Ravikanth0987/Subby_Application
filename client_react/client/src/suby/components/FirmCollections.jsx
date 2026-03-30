import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ✅ Environment variables
const API_URL = import.meta.env.VITE_API_URL;
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

const FirmCollections = () => {
  const [firmData, setFirmData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [activeCategory, setActiveCategory] = useState("all");

  const firmDataHandler = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/all-vendors`);

      if (!response.ok) {
        throw new Error("API error");
      }

      const data = await response.json();

      console.log("Firm API:", data);

      setFirmData(data.vendors || data);

    } catch (error) {
      alert("Firm data not fetched");
      console.error("Error fetching firm data:", error);
    }
  };

  useEffect(() => {
    firmDataHandler();
  }, []);

  const filterHandler = (region, category) => {
    setSelectedRegion(region);
    setActiveCategory(category);
  };

  return (
    <>
      <h3>Restaurants with online food delivery</h3>

      <div className="filterButtons">
        <button onClick={() => filterHandler("All", "all")}>All</button>
        <button onClick={() => filterHandler("Irish-Classics", "irish-classics")}>Irish</button>
        <button onClick={() => filterHandler("Indian", "indian")}>Indian</button>
        <button onClick={() => filterHandler("Chinese", "chinese")}>Chinese</button>
        <button onClick={() => filterHandler("Bakery", "bakery")}>Bakery</button>
      </div>

      <section className="firmSection">
        {firmData.map((vendor) =>
          vendor?.firm?.map((item) => {
            const matchRegion =
              selectedRegion === "All" ||
              item.region.some((r) =>
                r.toLowerCase().includes(selectedRegion.toLowerCase())
              );

            if (!matchRegion) return null;

            return (
              <Link
                to={`/products/${item._id}/${item.firmName}`}
                className="link"
                key={item._id}
                onClick={() => localStorage.setItem("firmId", item._id)}
              >
                <div className="firmGroupBox">
                  <img
                    src={`${IMAGE_URL}/uploads/${item.image}`}
                    alt={item.firmName}
                  />
                  <h4>{item.firmName}</h4>
                </div>
              </Link>
            );
          })
        )}
      </section>
    </>
  );
};

export default FirmCollections;