// src/pages/Register.jsx
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    address: "",
    contact_number: "",
    dob: "",
    profile_photo: null,
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState(null); // { type: "success" | "error", message: "" }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "profile_photo") {
      setFormData({ ...formData, profile_photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.username.trim())
      errors.username = "Username is required";
    else if (formData.username.trim().length < 3)
      errors.username = "Username must be at least 3 characters";

    if (!formData.email.trim())
      errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Enter a valid email address";

    if (!formData.password)
      errors.password = "Password is required";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";

    if (!formData.confirm_password)
      errors.confirm_password = "Please confirm your password";
    else if (formData.password !== formData.confirm_password)
      errors.confirm_password = "Passwords do not match";

    if (!formData.address.trim())
      errors.address = "Address is required";

    if (!formData.contact_number.trim())
      errors.contact_number = "Contact number is required";
    else if (!/^\d{10}$/.test(formData.contact_number.trim()))
      errors.contact_number = "Enter a valid 10-digit number";

    if (!formData.dob)
      errors.dob = "Date of birth is required";
    else {
      const today = new Date();
      const dob = new Date(formData.dob);
      const age = today.getFullYear() - dob.getFullYear();
      if (dob >= today) errors.dob = "Enter a valid date of birth";
      else if (age < 13) errors.dob = "Must be at least 13 years old";
    }

    return errors;
  };

  const handleSubmit = async () => {
    try {
      setError("");
      const errors = validate();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      const data = new FormData();
      for (let key in formData) {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      }

      await API.post("register/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setToast({ type: "success", message: "Registration successful! Redirecting to login…" });
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      console.log(err.response?.data || err);
      setToast({ type: "error", message: "Registration failed. Please try again." });
      setTimeout(() => setToast(null), 3000);
    }
  };

  // ── Registration Form ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start px-4 py-4 overflow-y-auto">

      {/* ── Overlay Toast ── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            animation: "slideDown 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}
        >
          <style>{`
            @keyframes slideDown {
              from { transform: translate(-50%, -80px); opacity: 0; }
              to   { transform: translate(-50%, 0);     opacity: 1; }
            }
          `}</style>

          <div className="bg-white border border-gray-200 rounded-xl shadow-lg flex items-center gap-3 px-4 py-3 min-w-[280px] max-w-sm">

            {/* Icon */}
            {toast.type === "success" ? (
              <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2.5}>
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
            )}

            {/* Text */}
            <div>
              <p className="text-xs font-semibold text-black mb-0.5">
                {toast.type === "success" ? "Registration Successful" : "Registration Failed"}
              </p>
              <p className="text-[11px] text-gray-500">{toast.message}</p>
            </div>

          </div>
        </div>
      )}

      {/* ── Form Card ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-md px-6 py-5 my-auto">

        {/* Title */}
        <h2 className="text-lg font-bold text-black mb-0.5">Register</h2>
        <p className="text-xs text-gray-500 mb-3">Create your account to get started</p>

        {/* Global Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg mb-3">
            {error}
          </div>
        )}

        {/* Username */}
        <div className="mb-2.5">
          <label className="block text-xs font-semibold text-black mb-1">
            Username <span className="text-red-400">*</span>
          </label>
          <input
            name="username"
            placeholder="Enter username"
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 text-xs text-black placeholder-gray-400 outline-none focus:border-gray-400 transition-colors ${
              fieldErrors.username ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
          />
          {fieldErrors.username && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.username}</p>}
        </div>

        {/* Email */}
        <div className="mb-2.5">
          <label className="block text-xs font-semibold text-black mb-1">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 text-xs text-black placeholder-gray-400 outline-none focus:border-gray-400 transition-colors ${
              fieldErrors.email ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
          />
          {fieldErrors.email && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.email}</p>}
        </div>

        {/* Password */}
        <div className="mb-2.5">
          <label className="block text-xs font-semibold text-black mb-1">
            Password <span className="text-red-400">*</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 text-xs text-black placeholder-gray-400 outline-none focus:border-gray-400 transition-colors ${
              fieldErrors.password ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
          />
          {fieldErrors.password && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="mb-2.5">
          <label className="block text-xs font-semibold text-black mb-1">
            Confirm Password <span className="text-red-400">*</span>
          </label>
          <input
            type="password"
            name="confirm_password"
            placeholder="Re-enter password"
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 text-xs text-black placeholder-gray-400 outline-none focus:border-gray-400 transition-colors ${
              fieldErrors.confirm_password ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
          />
          {fieldErrors.confirm_password && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.confirm_password}</p>}
        </div>

        {/* Address */}
        <div className="mb-2.5">
          <label className="block text-xs font-semibold text-black mb-1">
            Address <span className="text-red-400">*</span>
          </label>
          <input
            name="address"
            placeholder="Enter address"
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 text-xs text-black placeholder-gray-400 outline-none focus:border-gray-400 transition-colors ${
              fieldErrors.address ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
          />
          {fieldErrors.address && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.address}</p>}
        </div>

        {/* Contact Number */}
        <div className="mb-2.5">
          <label className="block text-xs font-semibold text-black mb-1">
            Contact Number <span className="text-red-400">*</span>
          </label>
          <input
            name="contact_number"
            placeholder="Enter 10-digit number"
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 text-xs text-black placeholder-gray-400 outline-none focus:border-gray-400 transition-colors ${
              fieldErrors.contact_number ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
          />
          {fieldErrors.contact_number && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.contact_number}</p>}
        </div>

        {/* DOB */}
        <div className="mb-2.5">
          <label className="block text-xs font-semibold text-black mb-1">
            Date of Birth <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            name="dob"
            onChange={handleChange}
            className={`w-full border rounded-lg px-3 py-2 text-xs text-black outline-none focus:border-gray-400 transition-colors ${
              fieldErrors.dob ? "border-red-400 bg-red-50" : "border-gray-200"
            }`}
          />
          {fieldErrors.dob && <p className="text-red-500 text-[10px] mt-0.5">{fieldErrors.dob}</p>}
        </div>

        {/* Profile Photo */}
        <div className="mb-3">
          <label className="block text-xs font-semibold text-black mb-1">Profile Photo</label>
          <input
            type="file"
            name="profile_photo"
            accept="image/*"
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-black hover:file:bg-gray-200 transition-colors"
          />
        </div>

        {/* Register Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-gray-900 hover:bg-black text-white text-sm font-semibold py-2 rounded-lg transition-colors duration-150"
        >
          Register
        </button>

        {/* Login redirect */}
        <p className="text-center text-xs text-gray-500 mt-2.5">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-black font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}