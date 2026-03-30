import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const isIrishPhone = (phone) => {
  return /^(\+353|0)8[3-9]\d{7}$/.test(phone);
};

const formatPhone = (phone) => {
  if (phone.startsWith("0")) {
    return "+353" + phone.substring(1);
  }
  return phone;
};

const LoginModal = ({ onClose, onSwitchToSignup }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Send OTP
  const handleSendOtp = async () => {
    if (!phone) {
      alert("Please enter phone number");
      return;
    }

    if (!isIrishPhone(phone)) {
      alert("Enter valid Irish phone number (e.g. 0871234567)");
      return;
    }

    try {
      setLoading(true);

      const formattedPhone = formatPhone(phone);

      await axios.post("/api/auth/send-otp", {
        phone: formattedPhone,
      });

      setStep(2);
      alert("OTP sent successfully");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      const formattedPhone = formatPhone(phone);

      const res = await axios.post("/api/auth/verify-otp", {
        phone: formattedPhone,
        otp,
      });

      // Save user
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful");

      navigate("/dashboard");
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Invalid OTP");
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

        <h2>
          Login or{" "}
          <span
            onClick={onSwitchToSignup}
            style={{ color: "blue", cursor: "pointer" }}
          >
            create an account
          </span>
        </h2>

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Enter Irish phone (087...)"
              className="input-field"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/[^0-9+]/g, ""))
              }
            />

            <button
              className="login-btn"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="input-field"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              className="login-btn"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Verify OTP"}
            </button>
          </>
        )}

        <p className="terms-text">
          By clicking, I accept the <span>Terms & Conditions</span> &{" "}
          <span>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;