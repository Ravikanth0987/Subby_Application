import React from "react";

const SideBar = ({
  showFirmHandler,
  showProductHandler,
  showAllProductsHandler,
  showFirmTitle,
}) => {
  return (
    <aside className="sideBarSection">
      <ul className="sideBarMenu">
        {showFirmTitle && (
          <li onClick={showFirmHandler}>🏢 Add Firm</li>
        )}
        <li onClick={showProductHandler}>🛒 Add Product</li>
        <li onClick={showAllProductsHandler}>📦 All Products</li>
        <li>👤 User Details</li>
      </ul>
    </aside>
  );
};

export default SideBar;
