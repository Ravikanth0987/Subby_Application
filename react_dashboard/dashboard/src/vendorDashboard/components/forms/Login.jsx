import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath';
import { ThreeCircles } from 'react-loader-spinner';

const Login = ({ showWelcomeHandler }) => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validate = () => {
    if (!form.email.trim()) return "Email is required";
    if (!form.password.trim()) return "Password is required";
    return null;
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      return setError(validationError);
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/vendor/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("loginToken", data.token);

      const vendorId = data.vendorId;

      const vendorResponse = await fetch(`${API_URL}/vendor/single-vendor/${vendorId}`, {
        headers: {
          token: data.token
        }
      });

      const vendorText = await vendorResponse.text();
      let vendorData;

      try {
        vendorData = JSON.parse(vendorText);
      } catch {
        throw new Error("Invalid vendor data");
      }

      if (vendorResponse.ok) {
        const vendorFirmId = vendorData.vendorFirmId;
        const vendorFirmName = vendorData.vendor?.firm?.[0]?.firmName;

        if (vendorFirmId) {
          localStorage.setItem("firmId", vendorFirmId);
        }

        if (vendorFirmName) {
          localStorage.setItem("firmName", vendorFirmName);
        }
      }

      setForm({ email: "", password: "" });

      showWelcomeHandler();

    } catch (err) {
      setError(err.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginSection">

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      )}

      {loading && (
        <div className="loaderSection">
          <ThreeCircles visible height={100} width={100} color="#4fa94d" />
          <p>Login in process... Please wait</p>
        </div>
      )}

      {!loading && (
        <form className="authForm" onSubmit={loginHandler} autoComplete="off">
          <h3>Vendor Login</h3>

          <label>Email</label>
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="enter your email"
          />

          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="enter your password"
          />

          <span className="showPassword" onClick={handleShowPassword}>
            {showPassword ? "Hide" : "Show"}
          </span>

          <div className="btnSubmit">
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;