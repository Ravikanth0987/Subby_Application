import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath';

const AddFirm = () => {
  const [form, setForm] = useState({
    firmName: "",
    area: "",
    offer: ""
  });

  const [category, setCategory] = useState([]);
  const [region, setRegion] = useState([]);
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleRegionChange = (e) => {
    const value = e.target.value;
    setRegion((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      return setError("Only image files are allowed ❌");
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      return setError("Image must be less than 2MB ❌");
    }

    setError("");
    setFile(selectedFile);
  };

  const validateForm = () => {
    if (!form.firmName.trim()) return "Firm name is required";
    if (!form.area.trim()) return "Area is required";
    if (category.length === 0) return "Select at least one category";
    if (region.length === 0) return "Select at least one region";
    if (!file) return "Image is required";
    return null;
  };

  const handleFirmSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      return setError(validationError);
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("loginToken");

      if (!token) {
        throw new Error("Please login first");
      }

      const formData = new FormData();
      formData.append("firmName", form.firmName);
      formData.append("area", form.area);
      formData.append("offer", form.offer);
      formData.append("image", file);

      category.forEach((c) => formData.append("category", c));
      region.forEach((r) => formData.append("region", r));

      const response = await fetch(`${API_URL}/firm/add-firm`, {
        method: "POST",
        headers: {
          token
        },
        body: formData
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server error. Not valid JSON");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to add firm");
      }

      alert("Firm added successfully ✅");

      setForm({ firmName: "", area: "", offer: "" });
      setCategory([]);
      setRegion([]);
      setFile(null);

      if (data.firmId) {
        localStorage.setItem("firmId", data.firmId);
      }

      if (data.vendorFirmName) {
        localStorage.setItem("firmName", data.vendorFirmName);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="firmSection">

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      )}

      <form className="tableForm" onSubmit={handleFirmSubmit}>
        <h3>Add Firm</h3>

        <label>Firm Name</label>
        <input
          type="text"
          name="firmName"
          value={form.firmName}
          onChange={handleChange}
        />

        <label>Area</label>
        <input
          type="text"
          name="area"
          value={form.area}
          onChange={handleChange}
        />

        <div className="checkInp">
          <label>Category</label>
          <div className="inputsContainer">
            {["veg", "non-veg"].map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  value={item}
                  checked={category.includes(item)}
                  onChange={handleCategoryChange}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <label>Offer</label>
        <input
          type="text"
          name="offer"
          value={form.offer}
          onChange={handleChange}
        />

        <div className="checkInp">
          <label>Region</label>
          <div className="inputsContainer">
            {["Irish-Classics", "Indian", "chinese", "bakery"].map((r) => (
              <label key={r}>
                <input
                  type="checkbox"
                  value={r}
                  checked={region.includes(r)}
                  onChange={handleRegionChange}
                />
                {r}
              </label>
            ))}
          </div>
        </div>

        <label>Firm Image</label>
        <input type="file" onChange={handleImageUpload} />

        <div className="btnSubmit">
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFirm;