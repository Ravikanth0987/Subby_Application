import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { API_URL, IMAGE_URL } from "../api";
import "../../styles/cart.css";

const Cart = () => {
  const { cart, increaseQty, decreaseQty, getTotal } =
    useContext(CartContext);

  const deliveryFee = 40;
  const gst = Math.round(getTotal() * 0.1);
  const totalPay = getTotal() + deliveryFee + gst;

  const handlePlaceOrder = async () => {
    try {
      // 👉 Later connect backend API
      alert("Order placed successfully ✅");
    } catch (error) {
      alert("Order failed ❌");
    }
  };

  return (
    <div className="cartContainer">
      <h2>Your Cart 🛒</h2>

      {cart?.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div className="cartItem" key={item._id}>
              <div className="leftSide">
                <img
                  src={`${IMAGE_URL}/uploads/${item.image}`}
                  alt={item.productName}
                  className="cartImg"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/100";
                  }}
                />
                <div>
                  <p>{item.productName}</p>
                  <p>₹{item.price}</p>
                </div>
              </div>

              <div className="qtyBox">
                <button onClick={() => decreaseQty(item._id)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(item._id)}>+</button>
              </div>
            </div>
          ))}

          <div className="billBox">
            <h3>Bill Details</h3>

            <div className="billRow">
              <span>Item Total</span>
              <span>₹{getTotal()}</span>
            </div>

            <div className="billRow">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>

            <div className="billRow">
              <span>GST & Charges</span>
              <span>₹{gst}</span>
            </div>

            <hr />

            <div className="billRow total">
              <strong>TO PAY</strong>
              <strong>₹{totalPay}</strong>
            </div>
          </div>

          <button className="orderBtn" onClick={handlePlaceOrder}>
            PLACE ORDER 🚀
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;