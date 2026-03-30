import React, { useEffect, useState } from 'react';

const NavBar = ({ showLoginHandler, showRegisterHandler, showLogOut, logOutHandler }) => {
  const [firmName, setFirmName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("firmName");
    if (name) setFirmName(name);
  }, []);

  return (
    <div className="navSection">

      <div className="company">
        Vendor Dashboard
      </div>

      <div className="firmName">
        <h4>Firm Name: {firmName || "N/A"}</h4>
      </div>

      <div className="userAuth">
        {!showLogOut ? (
          <>
            <span onClick={showLoginHandler}>Login / </span>
            <span onClick={showRegisterHandler}>Register</span>
          </>
        ) : (
          <span onClick={logOutHandler} className="logout">
            Logout
          </span>
        )}
      </div>

    </div>
  );
};

export default NavBar;