import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath';
import { ThreeCircles } from 'react-loader-spinner';

const AddProduct = () => {
  const [form, setForm] = useState({
    productName: "",
    price: "",
    description: ""
  });

  const [category, setCategory] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [image, setImage] = useState(null);

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

  const handleBestSeller = (e) => {
    setBestSeller(e.target.value === "true");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return setError("Only image files allowed ❌");
    }

    if (file.size > 2 * 1024 * 1024) {
      return setError("Image must be less than 2MB ❌");
    }

    setError("");
    setImage(file);
  };

  const validate = () => {
    if (!form.productName.trim()) return "Product name required";
    if (!form.price || isNaN(form.price)) return "Valid price required";
    if (category.length === 0) return "Select category";
    if (!image) return "Image required";
    return null;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      return setError(validationError);
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("loginToken");
      const firmId = localStorage.getItem("firmId");

      if (!token || !firmId) {
        throw new Error("Please login again");
      }

      const formData = new FormData();
      formData.append("productName", form.productName);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("bestSeller", bestSeller);
      formData.append("image", image);

      category.forEach((c) => formData.append("category", c));

      const response = await fetch(`${API_URL}/product/add-product/${firmId}`, {
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
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      alert("Product added successfully ✅");

      setForm({ productName: "", price: "", description: "" });
      setCategory([]);
      setBestSeller(false);
      setImage(null);

    } catch (err) {
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

      {loading && (
        <div className="loaderSection">
          <ThreeCircles visible height={100} width={100} color="#4fa94d" />
          <p>Please wait, your product is being added...</p>
        </div>
      )}

      {!loading && (
        <form className="tableForm" onSubmit={handleAddProduct}>
          <h3>Add Product</h3>

          <label>Product Name</label>
          <input
            type="text"
            name="productName"
            value={form.productName}
            onChange={handleChange}
          />

          <label>Price</label>
          <input
            type="text"
            name="price"
            value={form.price}
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

          <div className="checkInp">
            <label>Best Seller</label>
            <div className="inputsContainer">
              <label>
                <input
                  type="radio"
                  value="true"
                  checked={bestSeller === true}
                  onChange={handleBestSeller}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  value="false"
                  checked={bestSeller === false}
                  onChange={handleBestSeller}
                />
                No
              </label>
            </div>
          </div>

          <label>Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <label>Product Image</label>
          <input type="file" onChange={handleImageUpload} />

          <div className="btnSubmit">
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddProduct;