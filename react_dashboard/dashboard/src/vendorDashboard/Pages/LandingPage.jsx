import React, { useState, useEffect } from 'react';

import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import Login from '../components/forms/Login';
import Register from '../components/forms/Register';
import AddFirm from '../components/forms/AddFirm';
import AddProduct from '../components/forms/AddProduct';
import AllProducts from '../components/AllProducts';

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showFirm, setShowFirm] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showLogOut, setShowLogOut] = useState(false);
  const [showFirmTitle, setShowFirmTitle] = useState(true);

  useEffect(() => {
    const loginToken = localStorage.getItem('loginToken');
    if (loginToken) {
      setShowLogOut(true);
    }
  }, []);

  useEffect(() => {
    const firmName = localStorage.getItem('firmName');
    const firmId = localStorage.getItem('firmId');

    if (firmName || firmId) {
      setShowFirmTitle(false);
    }
  }, []);

  const logOutHandler = () => {
    const confirmLogout = window.confirm("Are you sure to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("loginToken");
    localStorage.removeItem("firmId");
    localStorage.removeItem("firmName");

    setShowLogOut(false);
    setShowFirmTitle(true);
    setShowLogin(true);
  };

  const resetAll = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowFirm(false);
    setShowProduct(false);
    setShowAllProducts(false);
  };

  const showLoginHandler = () => {
    resetAll();
    setShowLogin(true);
  };

  const showRegisterHandler = () => {
    resetAll();
    setShowRegister(true);
  };

  const showFirmHandler = () => {
    if (!showLogOut) {
      alert("Please login");
      setShowLogin(true);
      return;
    }
    resetAll();
    setShowFirm(true);
  };

  const showProductHandler = () => {
    if (!showLogOut) {
      alert("Please login");
      setShowLogin(true);
      return;
    }
    resetAll();
    setShowProduct(true);
  };

  const showAllProductsHandler = () => {
    if (!showLogOut) {
      alert("Please login");
      setShowLogin(true);
      return;
    }
    resetAll();
    setShowAllProducts(true);
  };

  return (
    <section className="landingSection">
      <NavBar
        showLoginHandler={showLoginHandler}
        showRegisterHandler={showRegisterHandler}
        showLogOut={showLogOut}
        logOutHandler={logOutHandler}
      />

      <div className="collectionSection">
        <SideBar
          showFirmHandler={showFirmHandler}
          showProductHandler={showProductHandler}
          showAllProductsHandler={showAllProductsHandler}
          showFirmTitle={showFirmTitle}
        />

        {showFirm && showLogOut && <AddFirm />}
        {showProduct && showLogOut && <AddProduct />}
        {showAllProducts && showLogOut && <AllProducts />}
        {showLogin && <Login />}
        {showRegister && <Register showLoginHandler={showLoginHandler} />}
      </div>
    </section>
  );
};

export default LandingPage;