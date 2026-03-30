import React, { useState, useEffect, useContext } from "react";
import { API_URL } from "../api";
import { useParams } from "react-router-dom";
import TopBar from "./TopBar";
import { CartContext } from "../../context/CartContext.jsx";

const ProductMenu = () => {
  const [products, setProducts] = useState([]);
  const { firmId, firmName } = useParams();
  const { addToCart } = useContext(CartContext);

  const productHandler = async () => {
    try {
      const response = await fetch(`${API_URL}/api/product/${firmId}/products`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("product fetch failed", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    productHandler();
  }, [firmId]);

  return (
    <>
      <TopBar />

      <section className="productSection">
        <h3 className="firmTitle">{firmName}</h3>

        {products.length === 0 ? (
          <p className="emptyText">No products available</p>
        ) : (
          products.map((item, index) => (
            <div className="productCard" key={item._id || index}>
              
              <div className="productLeft">
                <h4>{item.productName}</h4>
                <p className="price">₹{item.price}</p>
                <p className="desc">{item.description}</p>
              </div>

              <div className="productRight">
                <div className="imgBox">
                  <img
                    src={`${API_URL}/uploads/${item.image}`}
                    alt={item.productName}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/120";
                    }}
                  />
                </div>

                <button
                  className="addBtn"
                  onClick={() => addToCart(item)}
                >
                  ADD
                </button>
              </div>

            </div>
          ))
        )}
      </section>
    </>
  );
};

export default ProductMenu;