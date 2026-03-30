import React, { useState, useEffect } from 'react';
import { API_URL, IMAGE_URL } from '../api';
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
import { MagnifyingGlass } from 'react-loader-spinner';
import { Link } from 'react-router-dom';

const Chains = () => {
  const [vendorData, setVendorData] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(true);

  const vendorFirmHandler = async () => {
    try {
      const response = await fetch(`${API_URL}/vendor/all-vendors?order=desc`);

      if (!response.ok) {
        throw new Error("API error");
      }

      const newData = await response.json();
      setVendorData(newData.vendors || newData);

      console.log("✅ API Data:", newData);

      setLoading(false);

    } catch (error) {
      alert("Failed to fetch data");
      console.error("❌ Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    vendorFirmHandler();
  }, []);

  const handleScroll = (direction) => {
    const gallery = document.getElementById("chainGallery");
    const scrollAmount = 500;

    if (!gallery) return;

    gallery.scrollTo({
      left:
        direction === "left"
          ? gallery.scrollLeft - scrollAmount
          : gallery.scrollLeft + scrollAmount,
      behavior: "smooth"
    });
  };

  return (
    <div className='mediaChainSection'>

      {/* Loader */}
      <div className="loaderSection">
        {loading && (
          <>
            <div className="loader">Your 🥣 is Loading...</div>
            <MagnifyingGlass
              visible={true}
              height="80"
              width="80"
              ariaLabel="loading"
              glassColor="#c0efff"
              color="#e15b64"
            />
          </>
        )}
      </div>

      <div className="btnSection">
        <button onClick={() => handleScroll("left")}>
          <FaRegArrowAltCircleLeft className='btnIcons' />
        </button>
        <button onClick={() => handleScroll("right")}>
          <FaRegArrowAltCircleRight className='btnIcons' />
        </button>
      </div>

      <h3 className='chainTitle'>Top restaurant chains in Ireland</h3>

      <section
        className="chainSection"
        id="chainGallery"
        onScroll={(e) => setScrollPosition(e.target.scrollLeft)}
      >
        {vendorData.map((vendor) => (
          <div className="vendorBox" key={vendor._id}>
            {vendor?.firm?.map((item) => (
              <Link
                to={`/products/${item._id}/${item.firmName}`}
                className="link"
                key={item._id}
              >
                <div className="firmImage">
                  <img
                    src={`${IMAGE_URL}/uploads/${item.image}`}
                    alt={item.firmName}
                  />
                </div>
              </Link>
            ))}
          </div>
        ))}
      </section>

    </div>
  );
};

export default Chains;