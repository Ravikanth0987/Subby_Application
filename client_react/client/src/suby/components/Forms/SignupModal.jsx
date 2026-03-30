import React, { useState } from "react";
import axios from "axios";

const SignupModal = ({ onClose, onSwitchToLogin }) => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!phone || !name || !email) {
      alert("Please fill all fields");
      return;
    }

    if (phone.length !==9 ) {
      alert("Enter valid 9-digit phone number");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:4000/api/auth/signup",
        { phone, name, email }
      );

      console.log(res.data);
      alert("Signup successful ✅");

      localStorage.setItem("user", JSON.stringify(res.data.user));

      onClose();
    } catch (error) {
      console.error(error);
      alert("Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h2>Create your account</h2>

        <input
          type="text"
          placeholder="Phone number"
          className="input-field"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="text"
          placeholder="Name"
          className="input-field"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="login-btn" onClick={handleSignup} disabled={loading}>
          {loading ? "Please wait..." : "Signup"}
        </button>

        <p className="terms-text">
          Already have an account?{" "}
          <span
            onClick={onSwitchToLogin}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupModal;