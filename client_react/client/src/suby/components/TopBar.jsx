import React, { useState, useContext } from "react";
import LoginModal from "./Forms/LoginModal";
import SignupModal from "./Forms/SignupModal";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

const TopBar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null); // basic user state

  const { cart } = useContext(CartContext);

  const openLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const openSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  return (
    <section className="topBarSection">
      
      <div className="companytitle">
        <h2 className="logoText">SUBY</h2>
      </div>

      <div className="searchBar">
        <input type="text" placeholder="Search restaurants..." />
      </div>

      <div className="userAuth">

        <Link to="/cart" className="link">
          <button className="cartBtn">
            Cart 🛒 ({cart?.length || 0})
          </button>
        </Link>

        {user ? (
          <button className="authBtn">Logout</button>
        ) : (
          <button onClick={openLogin} className="authBtn">
            SignIn
          </button>
        )}
      </div>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={openSignup}
        />
      )}

      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={openLogin}
        />
      )}
    </section>
  );
};

export default TopBar;